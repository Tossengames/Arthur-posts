import os
import requests
import random
import logging
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini AI
try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    logger.error(f"Gemini AI setup failed: {str(e)}")
    model = None

# Hashtag pool for anime/manga posts
HASHTAGS = [
    "#AnimeNews", "#MangaUpdates", "#WeebLife", "#OtakuCulture",
    "#AnimeCommunity", "#MangaLovers", "#Crunchyroll", "#AnimeTrending",
    "#NewEpisodeAlert", "#ChapterUpdate", "#MustWatch", "#MustRead"
]

def get_random_hashtags():
    return ' '.join(random.sample(HASHTAGS, 4))

def generate_ai_summary(content):
    if not model:
        logger.error("Gemini AI not initialized")
        return None
        
    prompt = f"""
    Act as an enthusiastic anime and manga content creator. Summarize this in an engaging way for Facebook fans:
    {content}
    
    Rules:
    - Be informative but fun
    - Use 1-2 relevant emojis
    - Don't sound like AI
    - Keep it under 200 characters
    - Highlight why fans should care
    - Never mention that you're summarizing
    - Use casual, friendly language like a real fan
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"AI generation error: {str(e)}")
        return None

def post_to_facebook(title, summary, image_url=None):
    if not summary:
        logger.error("Skipping post - no summary generated")
        return False
        
    fb_token = os.getenv('FB_PAGE_TOKEN')
    fb_page_id = os.getenv('FB_PAGE_ID')
    
    if not all([fb_token, fb_page_id]):
        logger.error("Missing Facebook credentials")
        return False
    
    message = f"{title}\n\n{summary}\n\n{get_random_hashtags()}"
    
    try:
        if image_url:
            # First upload the image
            image_response = requests.post(
                f'https://graph.facebook.com/{fb_page_id}/photos',
                files={'source': ('image.jpg', requests.get(image_url).content)},
                data={
                    'message': message,
                    'access_token': fb_token
                }
            )
            image_response.raise_for_status()
            logger.info("Posted with image successfully")
        else:
            # Fallback to text-only post
            response = requests.post(
                f'https://graph.facebook.com/{fb_page_id}/feed',
                data={
                    'message': message,
                    'access_token': fb_token
                }
            )
            response.raise_for_status()
            logger.info("Posted text successfully")
            
        return True
    except Exception as e:
        logger.error(f"Facebook post error: {str(e)}")
        return False