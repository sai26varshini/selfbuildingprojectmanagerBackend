import os
import requests

def suggest_youtube_videos(project_name, domain, max_results=5):
    """
    Fetches highly relevant YouTube videos showing project demos 
    related to the given project name and domain.
    Guarantees 5 results (adds fallback videos if needed).
    """
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        return "❌ YouTube API key not found in environment variables."

    def fetch_videos(query, limit=20):
        """Helper: fetch raw YouTube data"""
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": limit,
            "order": "relevance",
            "key": api_key,
            "regionCode": "IN",
            "safeSearch": "strict"
        }
        r = requests.get(url, params=params)
        if r.status_code != 200:
            return []
        return r.json().get("items", [])

    # --- Step 1: project-focused query ---
    main_query = (
        f'"{project_name}" "{domain}" project demo OR "final year project" OR '
        f'"implementation" OR "working model" OR "project explanation" '
        f'-tutorial -lecture -course -class -training'
    )
    items = fetch_videos(main_query)

    exclude_keywords = [
        "tutorial", "lecture", "class", "course", "learn", "training",
        "introduction", "beginner", "theory", "concept", "lesson"
    ]
    include_keywords = ["project", "demo", "implementation", "model", "simulation"]

    videos = []

    # --- Step 2: filter project-related ones ---
    for item in items:
        title = item["snippet"]["title"].strip()
        description = item["snippet"]["description"].replace("\n", " ").strip()
        video_id = item["id"]["videoId"]
        url = f"https://www.youtube.com/watch?v={video_id}"
        channel = item["snippet"].get("channelTitle", "Unknown")

        # Skip tutorials
        if any(word.lower() in (title + description).lower() for word in exclude_keywords):
            continue

        # Must contain project/demo keyword
        if not any(word.lower() in (title + description).lower() for word in include_keywords):
            continue

        videos.append({
            "title": title,
            "description": description,
            "url": url,
            "channel": channel
        })

    # --- Step 3: fallback if not enough ---
    if len(videos) < max_results:
        fallback_query = f"{project_name} {domain} project OR final year project OR working model"
        fallback_items = fetch_videos(fallback_query)
        for item in fallback_items:
            if len(videos) >= max_results:
                break
            title = item["snippet"]["title"].strip()
            description = item["snippet"]["description"].replace("\n", " ").strip()
            video_id = item["id"]["videoId"]
            url = f"https://www.youtube.com/watch?v={video_id}"
            channel = item["snippet"].get("channelTitle", "Unknown")
            # Avoid duplicates
            if url not in [v["url"] for v in videos]:
                videos.append({
                    "title": title,
                    "description": description,
                    "url": url,
                    "channel": channel
                })

    # --- Step 4: still fewer? Fetch general project videos ---
    if len(videos) < max_results:
        general_items = fetch_videos("engineering project demo OR working model")
        for item in general_items:
            if len(videos) >= max_results:
                break
            title = item["snippet"]["title"].strip()
            description = item["snippet"]["description"].replace("\n", " ").strip()
            video_id = item["id"]["videoId"]
            url = f"https://www.youtube.com/watch?v={video_id}"
            channel = item["snippet"].get("channelTitle", "Unknown")
            if url not in [v["url"] for v in videos]:
                videos.append({
                    "title": title,
                    "description": description,
                    "url": url,
                    "channel": channel
                })

    # --- Step 5: ensure exactly 5 ---
    return videos[:max_results]


# Example usage:
if __name__ == "__main__":
    project_name = "Disease Prediction using Machine Learning"
    domain = "Artificial Intelligence"

    results = suggest_youtube_videos(project_name, domain, max_results=5)

    if isinstance(results, list):
        print(f"### 🎥 Top {len(results)} YouTube Project Demos for '{project_name}'\n")
        for i, vid in enumerate(results, 1):
            print(f"**{i}. [{vid['title']}]({vid['url']})**")
            print(f"📺 Channel: {vid['channel']}")
            print(f"📝 {vid['description']}\n")
    else:
        print(results)
