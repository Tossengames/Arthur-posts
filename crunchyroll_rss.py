from shared_utils import *
import feedparser

MANGAUPDATES_RSS = "https://www.mangaupdates.com/rss.php"

def process_mangaupdates_feed():
    print("Fetching MangaUpdates RSS feed...")
    feed = feedparser.parse(MANGAUPDATES_RSS)
    
    if not feed.entries:
        print("No entries found in MangaUpdates RSS feed")
        return False
    
    # Get the latest entry
    entry = feed.entries[0]
    
    # Extract image if available
    image_url = None
    if 'links' in entry:
        for link in entry.links:
            if link.type == 'image/jpeg':
                image_url = link.href
                break
    
    # Generate AI summary
    content = f"{entry.title}\n\n{entry.description}"
    summary = generate_ai_summary(content)
    
    if not summary:
        return False
    
    # Post to Facebook
    return post_to_facebook("📖 Manga News Flash!", summary, image_url)

if __name__ == "__main__":
    process_mangaupdates_feed()