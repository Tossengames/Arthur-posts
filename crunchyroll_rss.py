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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
        
        logger.info("Fetching Crunchyroll news page...")
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try multiple selectors for articles
        articles = []
        for selector in ['article.news-item', 'div.news-item', 'div.news-card', 'article.news-card']:
            articles = soup.select(selector)
            if articles:
                break
        
        if not articles:
            logger.error(f"No articles found. Page title: {soup.title.string if soup.title else 'No title'}")
            return None
            
        latest_article = articles[0]
        
        # Extract data with multiple fallback selectors
        title = (latest_article.select_one('h2.title') or 
                latest_article.select_one('h1.title') or
                latest_article.select_one('h3.title')).get_text(strip=True)
                
        description = (latest_article.select_one('div.description') or
                     latest_article.select_one('p.excerpt') or
                     latest_article.select_one('div.excerpt')).get_text(strip=True)
        
        img_elem = (latest_article.select_one('img.thumbnail') or
                   latest_article.select_one('img.news-image') or
                   latest_article.select_one('img'))
        image_url = img_elem['src'] if img_elem else None
        
        if image_url and not image_url.startswith('http'):
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