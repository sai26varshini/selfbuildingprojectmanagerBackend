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

    videos = []
    for item in items:
        title = item["snippet"]["title"]
        description = item["snippet"]["description"].replace("\n", " ")
        video_id = item["id"]["videoId"]
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        channel = item["snippet"].get("channelTitle", "Unknown")
        videos.append({
            "title": title,
            "description": description,
            "url": video_url,
            "channel": channel
        })
    return videos
