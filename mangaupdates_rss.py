from shared_utils import *
import feedparser
import logging

logger = logging.getLogger(__name__)

MANGAUPDATES_RSS = "https://www.mangaupdates.com/rss.php"

def process_mangaupdates_feed():
    logger.info("Fetching MangaUpdates RSS feed...")
    try:
        feed = feedparser.parse(
            MANGAUPDATES_RSS,
            agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            request_headers={'Accept': 'application/rss+xml'}
        )
        
        if hasattr(feed, 'bozo') and feed.bozo:
            logger.error(f"RSS parsing error: {feed.bozo_exception}")
            return False
            
        if not feed.entries:
            logger.error("No entries found in MangaUpdates RSS feed")
            return False
            
        # Get the latest entry
        entry = feed.entries[0]
        logger.info(f"Found entry: {entry.title}")
        
        # Extract image if available
        image_url = None
        if hasattr(entry, 'links'):
            for link in entry.links:
                if getattr(link, 'type', '') == 'image/jpeg':
                    image_url = link.href
                    break
        
        # Generate AI summary
        content = f"{entry.title}\n\n{getattr(entry, 'description', 'No description available')}"
        summary = generate_ai_summary(content)
        
        if not summary:
            return False
            
        # Post to Facebook
        return post_to_facebook("📖 Manga News Flash!", summary, image_url)
        
    except Exception as e:
        logger.error(f"Error processing MangaUpdates feed: {str(e)}")
        return False

if __name__ == "__main__":
    process_mangaupdates_feed()