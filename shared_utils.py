from shared_utils import *
import feedparser
import logging
from bs4 import BeautifulSoup
import requests

logger = logging.getLogger(__name__)

# Alternative RSS feeds to try (in order)
CRUNCHYROLL_SOURCES = [
    {
        'type': 'rss',
        'url': 'https://www.crunchyroll.com/news/rss'
    },
    {
        'type': 'rss', 
        'url': 'https://feeds.feedburner.com/crunchyroll/rss/anime'
    },
    {
        'type': 'scrape',
        'url': 'https://www.crunchyroll.com/news'
    }
]

def get_crunchyroll_content():
    """Try multiple sources until we get valid content"""
    for source in CRUNCHYROLL_SOURCES:
        try:
            if source['type'] == 'rss':
                logger.info(f"Trying RSS feed: {source['url']}")
                feed = feedparser.parse(source['url'])
                
                if hasattr(feed, 'bozo') and feed.bozo:
                    logger.warning(f"RSS error: {feed.bozo_exception}")
                    continue
                    
                if not feed.entries:
                    logger.warning("No entries in RSS feed")
                    continue
                    
                entry = feed.entries[0]
                image_url = None
                
                # Try multiple possible image locations
                if hasattr(entry, 'media_content'):
                    image_url = entry.media_content[0]['url']
                elif hasattr(entry, 'links'):
                    for link in entry.links:
                        if getattr(link, 'type', '') == 'image/jpeg':
                            image_url = link.href
                            break
                
                return {
                    'title': entry.title,
                    'description': getattr(entry, 'description', ''),
                    'image_url': image_url
                }
                
            else:  # Scrape fallback
                logger.info(f"Scraping: {source['url']}")
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
                response = requests.get(source['url'], headers=headers)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # New improved selectors
                article = soup.select_one('article.news-item, div.news-item, section.news-item')
                if not article:
                    continue
                    
                title = article.select_one('h1, h2, h3').get_text(strip=True)
                description = article.select_one('p, div.description').get_text(strip=True)
                
                # Find image - checking multiple attributes
                img = article.select_one('img')
                image_url = img.get('src') if img else None
                if not image_url and img:
                    image_url = img.get('data-src')
                
                if image_url and not image_url.startswith('http'):
                    image_url = f"https:{image_url}" if image_url.startswith('//') else f"https://www.crunchyroll.com{image_url}"
                
                return {
                    'title': title,
                    'description': description,
                    'image_url': image_url
                }
                
        except Exception as e:
            logger.error(f"Error with source {source['url']}: {str(e)}")
            continue
            
    logger.error("All Crunchyroll sources failed")
    return None

def process_crunchyroll_feed():
    content = get_crunchyroll_content()
    if not content:
        return False
        
    # Generate AI summary
    summary = generate_ai_summary(f"{content['title']}\n\n{content['description']}")
    if not summary:
        return False
        
    # Post to Facebook with image if available
    return post_to_facebook(
        f"🎬 Crunchyroll Update: {content['title']}",
        summary,
        content['image_url']
    )

if __name__ == "__main__":
    process_crunchyroll_feed()