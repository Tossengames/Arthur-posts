from shared_utils import *
import requests
import logging
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

def get_crunchyroll_news():
    """Scrape Crunchyroll news directly from their website"""
    try:
        url = "https://www.crunchyroll.com/news"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        logger.info("Fetching Crunchyroll news page...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.select('article.news-item')  # Updated selector
        
        if not articles:
            logger.error("No articles found on news page")
            return None
            
        latest_article = articles[0]
        
        # Extract data with error handling for each element
        title_elem = latest_article.select_one('h2.title, h1.title')  # Multiple possible selectors
        desc_elem = latest_article.select_one('div.description, p.excerpt')
        img_elem = latest_article.select_one('img.thumbnail, img.news-image')
        
        if not all([title_elem, desc_elem, img_elem]):
            logger.error("Missing required elements in article")
            return None
            
        title = title_elem.get_text(strip=True)
        description = desc_elem.get_text(strip=True)
        image_url = img_elem.get('src', img_elem.get('data-src', ''))
        
        if not image_url.startswith('http'):
            image_url = f"https:{image_url}" if image_url.startswith('//') else f"https://www.crunchyroll.com{image_url}"
            
        return {
            'title': title,
            'description': description,
            'image_url': image_url
        }
        
    except Exception as e:
        logger.error(f"Error scraping Crunchyroll: {str(e)}")
        return None

def process_crunchyroll_feed():
    news_item = get_crunchyroll_news()
    if not news_item:
        logger.error("Failed to get Crunchyroll news")
        return False
        
    # Generate AI summary
    content = f"{news_item['title']}\n\n{news_item['description']}"
    summary = generate_ai_summary(content)
    
    if not summary:
        return False
        
    # Post to Facebook
    return post_to_facebook(
        f"📢 Crunchyroll News: {news_item['title']}",
        summary,
        news_item['image_url']
    )

if __name__ == "__main__":
    process_crunchyroll_feed()