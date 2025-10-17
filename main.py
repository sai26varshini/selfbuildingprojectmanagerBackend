# ---------------------------
# List Project ZIPs for User
# ---------------------------
# ---------------------------
# List Projects for User
# ---------------------------
# import os
# from fastapi import FastAPI, Request
# from pydantic import BaseModel
# from fastapi.responses import FileResponse, StreamingResponse
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv
# from fastapi.responses import FileResponse
# import shutil
# from agent.project_generator import create_project_structure
# from agent.github_suggester import suggest_github_repos
# from agent.youtube_video_suggester import suggest_youtube_videos
# from agent.research_paper_generator import generate_research_paper_pdf
# from agent.researchpaper_suggestion import suggest_researchpaper_suggestions
# from agent.code_generator import generate_code_snippets
# import time
# import asyncio

# # Load environment variables
# load_dotenv()

# # Initialize FastAPI app


# app = FastAPI(title="AI Project Assistant", version="1.0")

# # SSE endpoint for generative code snippets (like ChatGPT)
# @app.get("/code_snippets/stream")
# async def stream_code_snippets(project_name: str, domain: str, request: Request):
#     async def event_generator():
#         try:
#             for i in range(5):  # Example: Replace with actual code generation logic
#                 yield f"data: Code snippet {i}\n\n"
#                 await asyncio.sleep(1)  # Simulate delay
#                 if await request.is_disconnected():
#                     print("[INFO] Client disconnected")
#                     break
#             yield "data: DONE\n\n"
#         except Exception as e:
#             print(f"[ERROR] Streaming error: {e}")

#     return StreamingResponse(event_generator(), media_type="text/event-stream")

# # Enable CORS for frontend integration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Or specify your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# # ---------------------------
# # Create project structure
# # ---------------------------

# # ---------------------------
# # Create project structure
# # ---------------------------


# # Pydantic model for project creation
# class ProjectRequest(BaseModel):
#     project_name: str
#     domain: str

# @app.post("/create_project_structure/")
# def create_structure(req: ProjectRequest):
#     """
#     Dynamically create a project folder structure.
#     """
#     base_path = create_project_structure(req.project_name, req.domain)
#     repos = suggest_github_repos(req.project_name, req.domain, 5)
#     videos = suggest_youtube_videos(req.project_name, req.domain, 5)
#     papers = suggest_researchpaper_suggestions(req.project_name, req.domain, 5)
#     return {
#         "message": "Project structure created",
#         "base_path": base_path,
#         "repos": repos,
#         "videos": videos,
#         "papers": papers
#     }
    
    
    


# @app.get("/download_project")
# def download_project(project_name: str):
#     """
#     Bundle the generated project structure and code files into a zip archive and return it for download.
#     """
#     project_dir = os.path.join(os.getcwd(), project_name.replace(" ", "_"))
#     zip_path = f"{project_dir}.zip"

#     # Create a zip archive of the project directory
#     shutil.make_archive(project_dir, 'zip', project_dir)

#     # Return the zip file as a response
#     return FileResponse(zip_path, media_type="application/zip", filename=f"{project_name}.zip")

# # SSE endpoint for real-time project creation progress
# @app.get("/create_project_structure/stream")
# async def stream_project_structure(project_name: str, domain: str, request: Request):
#     import time
#     def event_stream():
#         for i in range(1, 6):
#             yield f"data: Step {i}/5 - working on {project_name} ({domain})\n\n"
#             time.sleep(1)
#         yield "data: DONE\n\n"
#     return StreamingResponse(event_stream(), media_type="text/event-stream")

# # ---------------------------
# # GitHub repositories endpoint
# # ---------------------------
# @app.get("/github_repos/")
# def get_github_repos(project_name: str, domain: str, max_results: int = 5):
#     repos = suggest_github_repos(project_name, domain, max_results)
#     return {"repositories": repos}

# # ---------------------------
# # YouTube videos endpoint
# # ---------------------------
# @app.get("/youtube_videos/")
# def get_youtube_videos(project_name: str, domain: str, max_results: int = 5):
#     videos = suggest_youtube_videos(project_name, domain, max_results)
#     return {"videos": videos}

# # ---------------------------
# # Generate research paper PDF
# # ---------------------------
# class ResearchPaperRequest(BaseModel):
#     project_name: str
#     domain: str

# @app.post("/research_paper/download/")
# def download_research_paper(req: ResearchPaperRequest):
#     # Optionally create a temporary folder
#     base_path = os.path.join(os.getcwd(), "temp_pdfs")
#     paper_text, pdf_path = generate_research_paper_pdf(req.project_name, req.domain, base_path)
#     return FileResponse(pdf_path, filename="RESEARCH_PAPER.pdf", media_type="application/pdf")

# # ---------------------------
# # Suggest related research papers
# # ---------------------------
# @app.get("/related_papers/")
# def get_related_papers(project_name: str, domain: str, limit: int = 5):
#     papers = suggest_researchpaper_suggestions(project_name, domain, limit)
#     return {"papers": papers}

# # ---------------------------
# # Root endpoint
# # ---------------------------
# @app.get("/")
# def root():
#     return {
#         "message": "Welcome to AI Project Assistant API!",
#         "endpoints": [
#             "/create_project_structure/?project_name=...&domain=...",
#             "/github_repos/?project_name=...&domain=...",
#             "/youtube_videos/?project_name=...&domain=...",
#             "/research_paper/download/?project_name=...&domain=...",
#             "/related_papers/?project_name=...&domain=..."
#         ]
#     }


import os
import shutil
import time
import asyncio
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from pymongo import MongoClient
import gridfs

# Import agent modules
from agent.project_generator import create_project_structure
from agent.github_suggester import suggest_github_repos
from agent.youtube_video_suggester import suggest_youtube_videos
from agent.research_paper_generator import generate_research_paper_pdf
from agent.researchpaper_suggestion import suggest_researchpaper_suggestions
from agent.code_generator import generate_code_snippets
from fastapi import Body

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL")
mongo_client = MongoClient(MONGODB_URL)
db = mongo_client["project_manager"]
users_collection = db["users"]
app = FastAPI(title="AI Project Assistant", version="1.1")
fs = gridfs.GridFS(db)

# ---------------------------
# Save Project to GridFS
# ---------------------------

# Place after app initialization

# ---------------------------
# Save Project to GridFS
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Update this with frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi import Body

from fastapi import Query

class ProjectRequest(BaseModel):
    project_name: str
    domain: str

class UserRegisterRequest(BaseModel):
    username: str
    password: str

class UserLoginRequest(BaseModel):
    username: str
    password: str


class ResearchPaperRequest(BaseModel):
    project_name: str
    domain: str
@app.get("/api/list_projects")
def list_projects(username: str = Query(...)):
    # Find all files for user, group by project_name
    files = db.fs.files.find({"username": username})
    projects = {}
    for f in files:
        pname = f.get("project_name", "Unknown")
        if pname not in projects:
            projects[pname] = {
                "project_name": pname,
                "file_count": 0,
                "last_saved": f.get("uploadDate", "")
            }
        projects[pname]["file_count"] += 1
        # Update last_saved if newer
        if f.get("uploadDate", "") > projects[pname]["last_saved"]:
            projects[pname]["last_saved"] = f.get("uploadDate", "")
    return {"success": True, "projects": list(projects.values())}

# ---------------------------
# Request Models
# ---------------------------


# ---------------------------
# Code Generation (SSE)
# ---------------------------
@app.get("/code_snippets/stream")
async def stream_code_snippets(project_name: str, domain: str, request: Request):
    """
    SSE endpoint for real-time code generation based on domain/project.
    """
    async def event_generator():
        try:
            generator = generate_code_snippets(project_name, domain)
            for snippet in generator:
                # Check if client disconnected
                if await request.is_disconnected():
                    print("[INFO] Client disconnected from /code_snippets/stream")
                    break
                yield snippet
                await asyncio.sleep(0.1)  # prevent blocking loop
        except Exception as e:
            print(f"[ERROR] Code streaming failed: {e}")
            yield f"data: ERROR - {str(e)}\n\n"
        yield "data: DONE\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


# ---------------------------
# Create project structure
# ---------------------------
@app.post("/create_project_structure/")
def create_structure(req: ProjectRequest):
    """
    Dynamically create a project folder structure and suggest resources.
    """
    base_path = create_project_structure(req.project_name, req.domain)
    repos = suggest_github_repos(req.project_name, req.domain, 5)
    videos = suggest_youtube_videos(req.project_name, req.domain, 5)
    papers = suggest_researchpaper_suggestions(req.project_name, req.domain, 5)

    return {
        "message": "Project structure created",
        "base_path": base_path,
        "repos": repos,
        "videos": videos,
        "papers": papers
    }


@app.get("/create_project_structure/stream")
async def stream_project_structure(project_name: str, domain: str, request: Request):
    """
    SSE endpoint for real-time project creation progress.
    """
    async def event_stream():
        try:
            for i in range(1, 6):
                if await request.is_disconnected():
                    print("[INFO] Client disconnected from /create_project_structure/stream")
                    break
                yield f"data: Step {i}/5 - setting up {project_name} ({domain})\n\n"
                await asyncio.sleep(1)
        except Exception as e:
            yield f"data: ERROR - {str(e)}\n\n"
        yield "data: DONE\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# ---------------------------
# Download full project as ZIP
# ---------------------------
@app.get("/download_project")
def download_project(project_name: str):
    """
    Bundle the generated project structure into a zip archive for download.
    """
    project_dir = os.path.join(os.getcwd(), project_name.replace(" ", "_"))
    zip_path = f"{project_dir}.zip"

    if not os.path.exists(project_dir):
        return {"error": f"Project '{project_name}' does not exist"}

    # Create a zip archive
    shutil.make_archive(project_dir, 'zip', project_dir)

    return FileResponse(zip_path, media_type="application/zip", filename=f"{project_name}.zip")


# ---------------------------
# GitHub repositories endpoint
# ---------------------------
@app.get("/github_repos/")
def get_github_repos(project_name: str, domain: str, max_results: int = 5):
    repos = suggest_github_repos(project_name, domain, max_results)
    return {"repositories": repos}


# ---------------------------
# YouTube videos endpoint
# ---------------------------
@app.get("/youtube_videos/")
def get_youtube_videos(project_name: str, domain: str, max_results: int = 5):
    videos = suggest_youtube_videos(project_name, domain, max_results)
    return {"videos": videos}


# ---------------------------
# Generate research paper PDF
# ---------------------------
@app.post("/research_paper/download/")
def download_research_paper(req: ResearchPaperRequest):
    base_path = os.path.join(os.getcwd(), "temp_pdfs")
    paper_text, pdf_path = generate_research_paper_pdf(req.project_name, req.domain, base_path)
    return FileResponse(pdf_path, filename="RESEARCH_PAPER.pdf", media_type="application/pdf")


# ---------------------------
# Suggest related research papers
# ---------------------------
@app.get("/related_papers/")
def get_related_papers(project_name: str, domain: str, limit: int = 5):
    papers = suggest_researchpaper_suggestions(project_name, domain, limit)
    return {"papers": papers}


# ---------------------------
# Root endpoint
# ---------------------------
@app.get("/dashboard")
def root():
    return {
        "message": "Welcome to AI Project Assistant API!",
        "endpoints": [
            "/create_project_structure/",
            "/create_project_structure/stream",
            "/code_snippets/stream",
            "/github_repos/",
            "/youtube_videos/",
            "/research_paper/download/",
            "/related_papers/",
            "/download_project"
        ]
    }


# ---------------------------
# User Registration
# ---------------------------
@app.post("/api/register")
def register_user(req: UserRegisterRequest):
    if users_collection.find_one({"username": req.username}):
        return {"success": False, "message": "Username already exists"}
    users_collection.insert_one({"username": req.username, "password": req.password})
    return {"success": True, "message": "User registered successfully"}

# ---------------------------
# User Login
# ---------------------------
@app.post("/api/login")
def login_user(req: UserLoginRequest):
    user = users_collection.find_one({"username": req.username, "password": req.password})
    if user:
        return {"success": True, "message": "Login successful"}
    return {"success": False, "message": "Invalid username or password"}

# ---------------------------
# Save Project ZIP to GridFS
# ---------------------------
@app.post("/api/save_project_zip")
def save_project_zip(username: str = Body(...), project_name: str = Body(...)):
    import shutil
    base_dir = os.path.join(os.getcwd(), project_name.replace(" ", "_"))
    zip_path = f"{base_dir}.zip"
    if not os.path.exists(base_dir):
        return {"success": False, "message": f"Project '{project_name}' not found"}
    shutil.make_archive(base_dir, 'zip', base_dir)
    with open(zip_path, "rb") as f:
        file_id = fs.put(
            f.read(),
            filename=f"{project_name}.zip",
            username=username,
            project_name=project_name,
            filetype="zip"
        )
    os.remove(zip_path)
    return {"success": True, "message": "Project zip saved to MongoDB", "file_id": str(file_id)}

# ---------------------------
# Download Project ZIP from GridFS
# ---------------------------
from fastapi.responses import StreamingResponse
@app.get("/api/download_project_zip")
def download_project_zip(username: str = Query(...), project_name: str = Query(...)):
    from bson import ObjectId
    file_obj = db.fs.files.find_one({"username": username, "project_name": project_name, "filetype": "zip"})
    if not file_obj:
        return {"success": False, "message": "Zip file not found"}
    file_id = file_obj["_id"]
    grid_out = fs.get(file_id)
    return StreamingResponse(grid_out, media_type="application/zip", headers={"Content-Disposition": f"attachment; filename={project_name}.zip"})
from fastapi import Query

@app.get("/api/list_project_zips")
def list_project_zips(username: str = Query(...)):
    # Find all zip files for user
    files = db.fs.files.find({"username": username, "filetype": "zip"})
    zips = []
    for f in files:
        zips.append({
            "project_name": f.get("project_name", "Unknown"),
            "filename": f.get("filename", ""),
            "uploadDate": f.get("uploadDate", "")
        })
    return {"success": True, "zips": zips}
# User Logout
# ---------------------------
from fastapi import Response

@app.post("/api/logout")
def logout_user(response: Response):
    # No session logic, just return success
    return {"success": True, "message": "Logged out"}