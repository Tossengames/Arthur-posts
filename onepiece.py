# one_piece_news_post.py
import os
import requests
import feedparser
from datetime import datetime
from dotenv import load_dotenv
import re
from io import BytesIO
import json
import time

load_dotenv()

FB_PAGE_ID = os.getenv("FB_PAGE_ID")
FB_PAGE_TOKEN = os.getenv("FB_PAGE_TOKEN")
GEMINI = os.getenv("GEMINI_API_KEY")

# One Piece specific RSS feeds
ONE_PIECE_RSS_FEEDS = [
    "https://onepiecechapters.com/rss",
    "https://www.reddit.com/r/OnePiece/.rss",
    "https://onepiece.fandom.com/ru/wiki/Служебная:NewsFeed",
    "https://www.animenewsnetwork.com/news/rss.xml",
]

# One Piece image sources
ONE_PIECE_IMAGE_SOURCES = [
    "https://static.wikia.nocookie.net/onepiece/images/",
    "https://cdn.one-piece.com/",
    "https://img.onepiecechapters.com/",
    "https://i.redd.it/",
]

def extract_keywords(text):
    # One Piece specific keywords
    one_piece_keywords = [
        "One", "Piece", "Luffy", "Zoro", "Nami", "Usopp", "Sanji", "Chopper", 
        "Robin", "Franky", "Brook", "Jimbei", "Kaido", "Big", "Mom", "Shanks", 
        "Blackbeard", "Straw", "Hat", "Grand", "Line", "Devil", "Fruit", "Haki", 
        "Wano", "Egghead", "Gear", "Chapter", "Spoilers", "Oda"
    ]
    
    keywords = set()
    words = re.findall(r'\b[A-Z][a-zA-Z]*\b', text)
    
    for word in words:
        if word in one_piece_keywords:
            keywords.add(word)
    
    return list(keywords)[:8]

def is_one_piece_related(content):
    """Check if content is related to One Piece"""
    if not content:
        return False
    
    one_piece_indicators = [
        'one piece', 'onepiece', 'luffy', 'zoro', 'nami', 'usopp', 'sanji',
        'chopper', 'robin', 'franky', 'brook', 'straw hat', 'grand line',
        'devil fruit', 'haki', 'kaido', 'big mom', 'shanks', 'blackbeard'
    ]
    
    content_lower = content.lower()
    return any(indicator in content_lower for indicator in one_piece_indicators)

def get_one_piece_images():
    """Get reliable One Piece images"""
    fallback_images = [
        "https://static.wikia.nocookie.net/onepiece/images/6/6d/Straw_Hat_Pirates.png",
        "https://static.wikia.nocookie.net/onepiece/images/b/bc/Monkey_D._Luffy_Anime_Post_Timeskip_Infobox.png",
        "https://static.wikia.nocookie.net/onepiece/images/5/53/Egghead_Arc.png",
        "https://static.wikia.nocookie.net/onepiece/images/3/33/Volume_108.png"
    ]
    return fallback_images

def fb_post(message, image_urls=None):
    """Post to Facebook with One Piece focus"""
    if not image_urls:
        image_urls = get_one_piece_images()
    
    valid_images = []
    for img_url in image_urls:
        if (isinstance(img_url, str) and img_url.startswith('http') and
            any(ext in img_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif'])):
            valid_images.append(img_url)
    
    if not valid_images:
        valid_images = get_one_piece_images()
    
    print(f"🏴‍☠️ Uploading {len(valid_images)} One Piece images")
    
    uploaded_media_ids = []
    for img_url in valid_images[:4]:
        try:
            response = requests.get(img_url, timeout=15, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if content_type.startswith('image/'):
                    upload_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/photos"
                    files = {'source': ('onepiece.jpg', BytesIO(response.content), content_type)}
                    data = {'access_token': FB_PAGE_TOKEN, 'published': 'false'}
                    
                    upload_response = requests.post(upload_url, data=data, files=files, timeout=15)
                    result = upload_response.json()
                    
                    if 'id' in result:
                        uploaded_media_ids.append({"media_fbid": result['id']})
                        print(f"✅ Uploaded: {result['id']}")
                        
        except Exception as e:
            print(f"❌ Error: {e}")
    
    if uploaded_media_ids:
        post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
        post_data = {
            'message': message,
            'access_token': FB_PAGE_TOKEN,
            'attached_media': json.dumps(uploaded_media_ids)
        }
        
        try:
            response = requests.post(post_url, data=post_data, timeout=15)
            result = response.json()
            if 'id' in result:
                print("✅ One Piece post with images successful!")
                return result
        except Exception as e:
            print("❌ Error creating post:", e)
    
    # Fallback to text
    return post_text_only(message)

def post_text_only(message):
    """Post text-only message"""
    post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
    data = {"message": message, "access_token": FB_PAGE_TOKEN}
    try:
        response = requests.post(post_url, data=data, timeout=10)
        result = response.json()
        print("✅ One Piece text post successful")
        return result
    except Exception as e:
        print("❌ Text post failed:", e)
        return None

def get_one_piece_news():
    """Fetch One Piece news"""
    all_entries = []
    
    for rss_url in ONE_PIECE_RSS_FEEDS:
        try:
            print(f"🏴‍☠️ Checking: {rss_url}")
            feed = feedparser.parse(rss_url)
            
            if feed.entries:
                for entry in feed.entries:
                    title = getattr(entry, 'title', '')
                    if is_one_piece_related(title):
                        all_entries.append(entry)
                print(f"✅ Found {len(feed.entries)} entries")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    return all_entries[:5]

def clean_facebook_text(text):
    """Clean text for Facebook"""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'__(.*?)__', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    return text.strip()

def post_one_piece_news():
    print("🏴‍☠️ Starting One Piece news collection...")
    
    try:
        entries = get_one_piece_news()
        
        if not entries:
            fallback_message = (
                "🏴‍☠️ لا توجد أخبار جديدة عن ون بيس اليوم! "
                "ما هو رأيك في آخر فصل من ون بيس؟ شاركنا توقعاتك! 👇 "
                "#ون_بيس #ون_بيس_العربي #لوفي #مانغا #أنمي"
            )
            fb_post(fallback_message)
            return

        # Prepare content for AI
        news_text = ""
        for entry in entries:
            title = getattr(entry, 'title', '').strip()
            summary = getattr(entry, 'summary', '')[:200].strip()
            news_text += f"{title}\n{summary}\n\n"

        # AI prompt for One Piece
        prompt = (
            "أنشئ منشور فيسبوك جذاب عن آخر أخبار ون بيس (One Piece). "
            "ابدأ بجملة افتتاحية قوية تجذب انتباه محبي ون بيس. "
            "تحدث عن آخر التطورات في القصة أو الشخصيات. "
            "استخدم نبرة حماسية ومناسبة لعشاق السلسلة. "
            "أضف رموز تعبيرية بحرية مثل 🏴‍☠️⚓️🗺️. "
            "اختتم بسؤال جمهورك عن آرائهم. "
            "استخدم الوسوم المناسبة مثل #ون_بيس #لوفي. "
            "إليك الأخبار:\n\n" + news_text
        )

        # Get AI response
        try:
            response = requests.post(
                "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
                params={"key": GEMINI},
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and data["candidates"]:
                    ai_summary = data["candidates"][0]["content"]["parts"][0]["text"]
                    cleaned_summary = clean_facebook_text(ai_summary)
                    
                    # Add One Piece hashtags
                    final_message = cleaned_summary + "\n\n#ون_بيس #ون_بيس_العربي #لوفي #مانغا #أنمي"
                    fb_post(final_message, get_one_piece_images())
                    return
                    
        except Exception as e:
            print("❌ AI error:", e)

    except Exception as e:
        print("❌ Main error:", e)
    
    # Fallback message
    fallback_message = (
        "🏴‍☠️ أخبار ون بيس اليوم: تابعوا آخر التطورات في عالم القراصنة! "
        "ما هي توقعاتكم للفصول القادمة؟ شاركونا آراءكم! 👇 "
        "#ون_بيس #ون_بيس_العربي #لوفي #مانغا #أنمي"
    )
    fb_post(fallback_message, get_one_piece_images())

if __name__ == '__main__':
    post_one_piece_news()