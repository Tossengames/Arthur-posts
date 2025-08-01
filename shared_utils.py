import os
import feedparser
import requests
import random
from datetime import datetime
import google.generativeai as genai

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

# Hashtag pool for anime/manga posts
HASHTAGS = [
    "#AnimeNews", "#MangaUpdates", "#WeebLife", "#OtakuCulture",
    "#AnimeCommunity", "#MangaLovers", "#Crunchyroll", "#AnimeTrending",
    "#NewEpisodeAlert", "#ChapterUpdate", "#MustWatch", "#MustRead"
]

def get_random_hashtags():
    return ' '.join(random.sample(HASHTAGS, 4))

def generate_ai_summary(content):
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
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"AI generation error: {str(e)}")
        return None

def post_to_facebook(title, summary, image_url=None):
    fb_token = os.getenv('FB_PAGE_TOKEN')
    fb_page_id = os.getenv('FB_PAGE_ID')
    
    if not summary:
        print("Skipping post - no summary generated")
        return False
    
    message = f"{title}\n\n{summary}\n\n{get_random_hashtags()}"
    
    payload = {
        'message': message,
        'access_token': fb_token
    }
    
    if image_url:
        payload['url'] = image_url
    
    try:
        response = requests.post(
            f'https://graph.facebook.com/{fb_page_id}/feed',
            data=payload
        )
        response.raise_for_status()
        print("Posted successfully to Facebook")
        return True
    except Exception as e:
        print(f"Facebook post error: {str(e)}")
        return False