import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from dotenv import load_dotenv

from agent.project_generator import create_project_structure
from agent.github_suggester import suggest_github_repos
from agent.youtube_video_suggester import suggest_youtube_videos
from agent.research_paper_generator import generate_research_paper_pdf
from agent.researchpaper_suggestion import suggest_researchpaper_suggestions

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="AI Project Assistant", version="1.0")

# ---------------------------
# Create project structure
# ---------------------------
@app.post("/create_project_structure/")
def create_structure(project_name: str, domain: str):
    """
    Dynamically create a project folder structure.
    """
    base_path = create_project_structure(project_name, domain)
    return {"message": "Project structure created", "base_path": base_path}

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
def download_research_paper(project_name: str, domain: str):
    # Optionally create a temporary folder
    base_path = os.path.join(os.getcwd(), "temp_pdfs")
    paper_text, pdf_path = generate_research_paper_pdf(project_name, domain, base_path)
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
@app.get("/")
def root():
    return {
        "message": "Welcome to AI Project Assistant API!",
        "endpoints": [
            "/create_project_structure/?project_name=...&domain=...",
            "/github_repos/?project_name=...&domain=...",
            "/youtube_videos/?project_name=...&domain=...",
            "/research_paper/download/?project_name=...&domain=...",
            "/related_papers/?project_name=...&domain=..."
        ]
    }
