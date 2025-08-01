from shared_utils import *
import feedparser

CRUNCHYROLL_RSS = "https://www.crunchyroll.com/newsrss?lang=enUS"

def process_crunchyroll_feed():
    print("Fetching Crunchyroll RSS feed...")
    feed = feedparser.parse(CRUNCHYROLL_RSS)
    
    if not feed.entries:
        print("No entries found in Crunchyroll RSS feed")
        return False
    
    # Get the latest entry
    entry = feed.entries[0]
    
    # Extract image if available
    image_url = None
    if 'media_content' in entry and entry.media_content:
        image_url = entry.media_content[0]['url']
    
    # Generate AI summary
    content = f"{entry.title}\n\n{entry.description}"
    summary = generate_ai_summary(content)
    
    if not summary:
        return False
    
    # Post to Facebook
    return post_to_facebook("🎬 Crunchyroll Update!", summary, image_url)

if __name__ == "__main__":
    process_crunchyroll_feed()