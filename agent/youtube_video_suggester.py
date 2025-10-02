import os
import requests

def suggest_youtube_videos(project_name, domain, max_results=5):
    """
    Fetches real YouTube videos using YouTube Data API v3.
    Returns Markdown content with video titles, links, and descriptions.
    """
    api_key = os.getenv("YOUTUBE_API_KEY")  # Make sure you set this in .env
    if not api_key:
        return "❌ YouTube API key not found in environment variables."

    query = f"{project_name} {domain} tutorial"
    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": api_key
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        return f"❌ Error fetching videos: {response.text}"

    data = response.json()
    items = data.get("items", [])

    if not items:
        return "No relevant YouTube videos found."

    # Build Markdown output
    md_output = f"# 🎥 YouTube Video Suggestions for {project_name} ({domain})\n\n"
    for i, item in enumerate(items, 1):
        title = item["snippet"]["title"]
        description = item["snippet"]["description"].replace("\n", " ")
        video_id = item["id"]["videoId"]
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        md_output += f"**{i}. [{title}]({video_url})**\n\n"
        md_output += f"_{description}_\n\n"

    return md_output
