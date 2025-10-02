# filepath: a:\Timepass\self-building-project-manager-agent\agent\code_generator.py
import os
import re
import json
import hashlib
from typing import Dict, List
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ---------------- File Structures ---------------- #

BASE_BACKEND = [
    "main.py",          # FastAPI entry
    "db.py",            # engine + SessionLocal + Base
    "models.py",        # SQLAlchemy models
    "schemas.py",       # Pydantic schemas
    "routes.py",        # APIRouter with endpoints
    "utils.py",         # helpers
]

ML_EXTRA = [
    "ml/model.py",
    "ml/train.py",
    "ml/evaluate.py",
    "ml/predict.py",
    "ml/data_loader.py"
]

AI_EXTRA = [
    "agent/agent_core.py",
    "agent/llm_client.py",
    "agent/tools.py"
]

GENERIC_EXTRA = [
    "services/service_layer.py"
]

FRONTEND_FILES = [
    "frontend/package.json",
    "frontend/public/index.html",
    "frontend/src/index.jsx",
    "frontend/src/App.jsx",
    "frontend/src/components/Header.jsx",
    "frontend/src/components/Footer.jsx",
    "frontend/src/api/client.js",
    "frontend/src/styles.css"
]

ALWAYS = ["README.md"]

# ---------------- Roles ---------------- #

FILE_ROLES = {
    "main.py": "Create FastAPI app (app = FastAPI()). Include router from routes.py. No models or DB engine definitions.",
    "db.py": "Define SQLAlchemy engine, SessionLocal, Base. No FastAPI app.",
    "models.py": "SQLAlchemy ORM models only (import Base from db).",
    "schemas.py": "Pydantic schemas referencing models. No app, no DB.",
    "routes.py": "Create APIRouter with CRUD endpoints for models. No FastAPI(). Import from db, models, schemas.",
    "utils.py": "Pure utility helpers (logging, common functions).",
    "ml/model.py": "Define ML model class or pipeline construction logic.",
    "ml/train.py": "Training script using data_loader to train model and save artifacts.",
    "ml/evaluate.py": "Load trained model, compute metrics.",
    "ml/predict.py": "Prediction script (CLI or function) using saved model.",
    "ml/data_loader.py": "Data loading / preprocessing utilities.",
    "agent/agent_core.py": "Core agent loop / planning logic.",
    "agent/llm_client.py": "Wrapper for LLM API calls (use placeholders / environment vars).",
    "agent/tools.py": "Tool functions (search, file ops).",
    "services/service_layer.py": "Business/service layer functions isolating DB operations.",
    "frontend/package.json": "Minimal React + dependencies config (scripts: dev/build).",
    "frontend/public/index.html": "HTML root with div#root.",
    "frontend/src/index.jsx": "React entry point createRoot + render <App/>.",
    "frontend/src/App.jsx": "Main React component calling backend sample endpoint.",
    "frontend/src/components/Header.jsx": "Reusable header component.",
    "frontend/src/components/Footer.jsx": "Reusable footer component.",
    "frontend/src/api/client.js": "Fetch wrapper (baseURL, GET/POST helpers).",
    "frontend/src/styles.css": "Basic global styles.",
    "README.md": "Project overview, setup (backend + frontend), run instructions."
}

# ---------------- Utilities ---------------- #

PY_IMPORT_RE = re.compile(r'^\s*(from\s+\w[\w\.]*\s+import\s+.+|import\s+[\w\w\. ,]+)\s*$')
JS_IMPORT_RE = re.compile(r'^\s*import\s+.*')
CODE_FENCE = re.compile(r'```[\w-]*')

def safe_name(name: str) -> str:
    return re.sub(r'[^A-Za-z0-9_\-]+', '_', name).strip('_') or "project"

def hash_short(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]

def pick_files(domain: str) -> List[str]:
    d = (domain or "").lower()
    files = BASE_BACKEND[:]
    if any(k in d for k in ["ml", "machine", "data"]):
        files += ML_EXTRA
    elif any(k in d for k in ["ai", "agent", "llm"]):
        files += AI_EXTRA
    else:
        files += GENERIC_EXTRA
    files += FRONTEND_FILES
    files += ALWAYS
    # Ensure uniqueness preserving order
    seen, ordered = set(), []
    for f in files:
        if f not in seen:
            ordered.append(f); seen.add(f)
    return ordered

def strip_fences(text: str) -> str:
    if "```" not in text:
        return text.strip()
    cleaned = []
    inside = False
    for line in text.splitlines():
        if line.strip().startswith("```"):
            inside = not inside
            continue
        if inside:
            cleaned.append(line)
    return "\n".join(cleaned).strip() or text.strip()

def remove_explanations(code: str, filename: str) -> str:
    if filename == "README.md":
        return code.strip()
    return re.sub(r'\n+(This code|The code|Above code|In this file).*', '', code, flags=re.IGNORECASE|re.DOTALL).rstrip()

def dedupe_imports(code: str, filename: str) -> str:
    if filename.endswith(".py"):
        out, seen = [], set()
        for ln in code.splitlines():
            if PY_IMPORT_RE.match(ln.strip()):
                key = ln.strip()
                if key in seen: continue
                seen.add(key)
            out.append(ln)
        return "\n".join(out)
    if filename.endswith((".js", ".jsx", ".ts", ".tsx")):
        out, seen = [], set()
        for ln in code.splitlines():
            if JS_IMPORT_RE.match(ln.strip()):
                k = ln.strip()
                if k in seen: continue
                seen.add(k)
            out.append(ln)
        return "\n".join(out)
    return code

def enforce_role_rules(code: str, filename: str) -> str:
    if filename != "main.py":
        code = re.sub(r'app\s*=\s*FastAPI\([^)]*\)', '# (Removed duplicate FastAPI app)', code)
    if filename not in ("db.py",):
        code = re.sub(r'create_engine\([^)]*\)', 'create_engine(...)  # defined in db.py', code)
        code = re.sub(r'SessionLocal\s*=\s*sessionmaker\([^)]*\)', '# SessionLocal in db.py', code)
        code = re.sub(r'Base\s*=\s*declarative_base\(\)', '# Base in db.py', code)
    if filename == "routes.py":
        # Ensure APIRouter pattern
        if "APIRouter" not in code:
            code = "from fastapi import APIRouter, Depends\nfrom sqlalchemy.orm import Session\nfrom . import schemas, models\nfrom .db import get_db\n\nrouter = APIRouter(prefix='/items', tags=['items'])\n\n" + code
        code = code.replace("app.", "router.")
        code = re.sub(r'@app\.', '@router.', code)
    return code

def collapse_blank(code: str) -> str:
    return re.sub(r'\n{3,}', '\n\n', code)

def summarize(existing: Dict[str, str]) -> str:
    parts = []
    for fn, content in existing.items():
        lines = [l for l in content.splitlines() if l.strip() and not l.strip().startswith("#")]
        parts.append(f"{fn}:\n" + "\n".join(lines[:6]) + "\n---")
    return "\n".join(parts) if parts else "None"

def build_prompt(project: str, domain: str, filename: str, summary: str) -> str:
    role = FILE_ROLES.get(filename, "Support module.")
    return f"""
Project: {project}
Domain: {domain}
Target File: {filename}
Role: {role}

Existing Project Summary:
{summary}

Rules:
- Output ONLY the file content (no surrounding explanation, no code fences).
- Provide COMPLETE, runnable, idiomatic code.
- Avoid duplicate definitions already implied by other roles.
- Keep imports minimal (only what is used).
- No placeholder text like TODO/...".
- For React files: functional components, export default where appropriate.
- For package.json: valid JSON.
- For README.md: markdown only.

Begin file content now.
""".strip()

def call_llm(prompt: str, model: str = "llama-3.1-8b-instant", max_tokens: int = 1400) -> str:
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a precise senior engineer. Output only the file content."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.25,
        max_tokens=max_tokens
    )
    return resp.choices[0].message.content or ""

def refine(code: str, filename: str) -> str:
    code = strip_fences(code)
    code = remove_explanations(code, filename)
    code = dedupe_imports(code, filename)
    code = enforce_role_rules(code, filename)
    code = collapse_blank(code)
    return code.strip() + ("\n" if not code.endswith("\n") else "")

# ---------------- Generation Core ---------------- #

def generate_file(filename: str, domain: str, project: str, existing: Dict[str, str]) -> str:
    prompt = build_prompt(project, domain, filename, summarize(existing))
    raw = call_llm(prompt)
    return refine(raw, filename)

def stream_snippets(project_name: str, domain: str):
    """
    SSE generator: each event is JSON: {"file": "...", "code": "..."}
    """
    safe = safe_name(project_name)
    base_dir = os.path.join(os.getcwd(), safe)
    os.makedirs(base_dir, exist_ok=True)

    files = pick_files(domain)
    generated: Dict[str, str] = {}
    seen_hashes = set()

    for filename in files:
        try:
            code = generate_file(filename, domain, safe, generated)
        except Exception as e:
            code = f"# Error generating {filename}: {e}\n"

        h = hash_short(code)
        if h in seen_hashes:
            code = f"# Duplicate content skipped for {filename}\n"
        else:
            seen_hashes.add(h)

        abs_path = os.path.join(base_dir, filename)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(code)

        generated[filename] = code
        payload = {"file": filename, "code": code}
        yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"

    yield "data: DONE\n\n"

# Backward compatibility
def generate_code_snippets(project_name: str, domain: str):
    return stream_snippets(project_name, domain)

