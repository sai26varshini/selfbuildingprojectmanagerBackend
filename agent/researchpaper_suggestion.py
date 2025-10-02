import arxiv
from sentence_transformers import SentenceTransformer, util

# Load semantic embedding model once
model = SentenceTransformer('all-MiniLM-L6-v2')

def suggest_researchpaper_suggestions(project_name, domain, limit=5):
    """
    Fetch related research papers from arXiv and rank dynamically by semantic similarity.
    """
    query = f"{project_name} {domain}"

    # Fetch more papers (so we can filter)
    search = arxiv.Search(
        query=query,
        max_results=20,
        sort_by=arxiv.SortCriterion.Relevance
    )

    # Encode project description
    project_text = f"{project_name} {domain}"
    project_embedding = model.encode(project_text, convert_to_tensor=True)

    papers = []
    for result in search.results():
        paper_text = result.title + " " + result.summary
        paper_embedding = model.encode(paper_text, convert_to_tensor=True)

        similarity = util.cos_sim(project_embedding, paper_embedding).item()

        papers.append({
            "title": result.title,
            "authors": [author.name for author in result.authors],
            "abstract": result.summary,
            "url": result.entry_id,
            "pdf_url": result.pdf_url,
            "year": result.published.year,
            "similarity": similarity
        })

    # Rank by similarity (descending)
    papers = sorted(papers, key=lambda x: x["similarity"], reverse=True)

    # Return top-N
    return papers[:limit]
