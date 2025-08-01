from shared_utils import *
import feedparser
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Updated Crunchyroll RSS endpoints to try (will attempt in order)
CRUNCHYROLL_FEEDS = [
    "https://www.crunchyroll.com/rss/anime/news",
    "https://www.crunchyroll.com/newsrss?lang=enUS",
    "https://feeds.feedburner.com/crunchyroll/rss/anime"
]

def process_crunchyroll_feed():
    logger.info("Starting Crunchyroll RSS processing...")
    
    for feed_url in CRUNCHYROLL_FEEDS:
        try:
            logger.info(f"Attempting feed: {feed_url}")
            
            # Fetch feed with custom headers
            feed = feedparser.parse(
                feed_url,
                agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                request_headers={'Accept': 'application/rss+xml'}
            )
            
            # Debug: Check what keys exist in the feed
            logger.debug(f"Feed keys: {list(feed.keys())}")
            
            if hasattr(feed, 'bozo') and feed.bozo:
                logger.warning(f"Feed parsing error (bozo): {feed.bozo_exception}")
                continue
                
            if not feed.entries:
                logger.warning(f"No entries found in feed: {feed_url}")
                continue
                
            # Get the latest entry
            entry = feed.entries[0]
            logger.info(f"Found entry: {entry.title}")
            
            # Extract image if available
            image_url = None
            if hasattr(entry, 'media_content') and entry.media_content:
                image_url = entry.media_content[0]['url']
            elif hasattr(entry, 'links'):
                for link in entry.links:
                    if getattr(link, 'type', '') == 'image/jpeg':
                        image_url = link.href
                        break
            
            # Generate AI summary
            content = f"{entry.title}\n\n{getattr(entry, 'description', 'No description available')}"
            summary = generate_ai_summary(content)
            
            if not summary:
                logger.error("Failed to generate AI summary")
                continue
                
            # Post to Facebook
            if post_to_facebook("🎬 Crunchyroll Update!", summary, image_url):
                logger.info("Successfully posted to Facebook")
                return True
                
        except Exception as e:
            logger.error(f"Error processing feed {feed_url}: {str(e)}")
            continue
            
    logger.error("All feed attempts failed. No content posted.")
    return False

if __name__ == "__main__":
    process_crunchyroll_feed()