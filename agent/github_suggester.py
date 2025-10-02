import os
import requests
from dotenv import load_dotenv

# Load env
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def suggest_github_repos(project_name, domain, max_results=5):
    """
    Fetch related GitHub repositories and format them nicely.
    """
    query = f"{project_name} {domain}"
    url = "https://api.github.com/search/repositories"
    params = {
        "q": query,
        "sort": "updated",
        "order": "desc",
        "per_page": max_results * 2   # fetch more to allow deduplication
    }

    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"  # add auth

    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    data = response.json()

    seen = set()
    repos = []
    for item in data.get("items", []):
        name = item["name"]
        if name in seen:
            continue  # skip duplicates
        seen.add(name)

        repos.append({
            "name": name,
            "url": item["html_url"],
            "stars": item["stargazers_count"],
            "language": item["language"] or "Unknown",
            "last_updated": item["updated_at"]
        })

        if len(repos) >= max_results:
            break

    # Format nicely
    formatted = "\n[📂] Suggested GitHub Repositories:\n\n"
    for i, repo in enumerate(repos, start=1):
        formatted += (
            f"{i}. **{repo['name']}**\n"
            f"   🔗 URL: {repo['url']}\n"
            f"   ⭐ Stars: {repo['stars']}\n"
            f"   📝 Language: {repo['language']}\n"
            f"   🕒 Last Updated: {repo['last_updated']}\n\n"
        )

    return formatted
