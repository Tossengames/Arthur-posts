# one_piece_news_post.py
import os
import requests
import feedparser
from dotenv import load_dotenv
import re
from io import BytesIO
import json

load_dotenv()

FB_PAGE_ID = os.getenv("FB_PAGE_ID")
FB_PAGE_TOKEN = os.getenv("FB_PAGE_TOKEN")
GEMINI = os.getenv("GEMINI_API_KEY")

# One Piece specific RSS feeds
ONE_PIECE_RSS_FEEDS = [
    "https://onepiecechapters.com/rss",
    "https://www.reddit.com/r/OnePiece/.rss",
    "https://www.animenewsnetwork.com/news/rss.xml",
]

def extract_keywords(text):
    one_piece_keywords = [
        "One", "Piece", "Luffy", "Zoro", "Nami", "Usopp", "Sanji", "Chopper", 
        "Robin", "Franky", "Brook", "Jimbei", "Kaido", "Big", "Mom", "Shanks", 
        "Blackbeard", "Straw", "Hat", "Grand", "Line", "Devil", "Fruit", "Haki", 
        "Wano", "Egghead", "Gear", "Chapter", "Spoilers", "Oda", "Manga", "Anime"
    ]
    
    keywords = set()
    words = re.findall(r'\b[A-Z][a-zA-Z]*\b', text)
    
    for word in words:
        if word in one_piece_keywords:
            keywords.add(word)
    
    return list(keywords)[:6]

def is_one_piece_related(content):
    if not content:
        return False
    
    one_piece_indicators = [
        'one piece', 'onepiece', 'luffy', 'zoro', 'nami', 'usopp', 'sanji',
        'chopper', 'robin', 'franky', 'brook', 'straw hat', 'grand line',
        'devil fruit', 'haki', 'kaido', 'big mom', 'shanks', 'blackbeard',
        'oda', 'manga chapter', 'anime episode'
    ]
    
    content_lower = content.lower()
    return any(indicator in content_lower for indicator in one_piece_indicators)

def extract_images_from_entry(entry):
    """Extract images directly from RSS entry"""
    images = []
    
    # Check media content
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            try:
                if hasattr(media, 'url') and hasattr(media, 'type') and 'image' in media.type:
                    images.append(media.url)
            except:
                pass
    
    # Check enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enc in entry.enclosures:
            try:
                if hasattr(enc, 'href') and hasattr(enc, 'type') and 'image' in enc.type:
                    images.append(enc.href)
            except:
                pass
    
    # Check links
    if hasattr(entry, 'links') and entry.links:
        for link in entry.links:
            try:
                if (hasattr(link, 'href') and 
                    any(ext in link.href.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp'])):
                    images.append(link.href)
            except:
                pass
    
    # Extract from HTML content
    content_fields = ['summary', 'description', 'content']
    for field in content_fields:
        if hasattr(entry, field):
            try:
                content = getattr(entry, field)
                if content:
                    img_matches = re.findall(r'<img[^>]+src="([^">]+)"', content)
                    images.extend(img_matches)
            except:
                pass
    
    # Clean and deduplicate
    clean_images = []
    for img in images:
        if (img and isinstance(img, str) and img.startswith('http') and
            any(ext in img.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']) and
            img not in clean_images):
            clean_images.append(img)
    
    return clean_images[:4]  # Return max 4 images

def fb_post(message, image_urls=None):
    """Post to Facebook with images from RSS"""
    if not image_urls:
        # If no images, post text only but skip generic "no image" posts
        print("📝 No images found, posting text only")
        return post_text_only(message)
    
    uploaded_media_ids = []
    
    for img_url in image_urls[:4]:  # Facebook allows max 4 images
        try:
            print(f"📸 Downloading: {img_url}")
            response = requests.get(img_url, timeout=15, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            
            if response.status_code == 200 and response.headers.get('content-type', '').startswith('image/'):
                upload_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/photos"
                files = {'source': ('image.jpg', BytesIO(response.content), 'image/jpeg')}
                data = {'access_token': FB_PAGE_TOKEN, 'published': 'false'}
                
                upload_response = requests.post(upload_url, data=data, files=files, timeout=15)
                result = upload_response.json()
                
                if 'id' in result:
                    uploaded_media_ids.append({"media_fbid": result['id']})
                    print(f"✅ Uploaded image: {result['id']}")
                    
        except Exception as e:
            print(f"❌ Image error: {e}")
    
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
                print("✅ Post with images successful!")
                return result
        except Exception as e:
            print("❌ Post creation error:", e)
    
    # Fallback to text if image upload fails
    return post_text_only(message)

def post_text_only(message):
    """Post text-only message"""
    post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
    data = {"message": message, "access_token": FB_PAGE_TOKEN}
    try:
        response = requests.post(post_url, data=data, timeout=10)
        result = response.json()
        print("✅ Text post successful")
        return result
    except Exception as e:
        print("❌ Text post failed:", e)
        return None

def get_one_piece_news():
    """Fetch One Piece news with images from RSS"""
    all_entries = []
    
    for rss_url in ONE_PIECE_RSS_FEEDS:
        try:
            print(f"🔍 Checking: {rss_url}")
            feed = feedparser.parse(rss_url)
            
            if feed.entries:
                for entry in feed.entries:
                    title = getattr(entry, 'title', '')
                    if is_one_piece_related(title):
                        # Extract images from this specific entry
                        entry.images = extract_images_from_entry(entry)
                        all_entries.append(entry)
                
                print(f"📰 Found {len([e for e in feed.entries if is_one_piece_related(getattr(e, 'title', ''))])} One Piece entries")
                
        except Exception as e:
            print(f"❌ RSS error: {e}")
    
    return sorted(all_entries, 
                 key=lambda x: getattr(x, 'published_parsed', (0, 0, 0, 0, 0, 0, 0, 0, 0)), 
                 reverse=True)[:3]  # Get top 3 newest entries

def clean_facebook_text(text):
    """Clean text for Facebook"""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'__(.*?)__', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'_{2,}', '', text)
    return text.strip()

def post_one_piece_news():
    print("🏴‍☠️ Starting One Piece news check...")
    
    try:
        entries = get_one_piece_news()
        
        # If no One Piece news found, skip posting entirely
        if not entries:
            print("⏭️ No One Piece news found today. Skipping post.")
            return None
        
        # Prepare content from actual news entries
        news_content = []
        all_images = []
        
        for entry in entries:
            title = getattr(entry, 'title', '').strip()
            summary = getattr(entry, 'summary', '')[:250].strip()
            link = getattr(entry, 'link', '')
            
            if title:
                news_content.append(f"{title}\n{summary}")
                # Collect images from this entry
                if hasattr(entry, 'images'):
                    all_images.extend(entry.images)
        
        if not news_content:
            print("⏭️ No valid One Piece content. Skipping post.")
            return None
        
        news_text = "\n\n".join(news_content)
        
        # AI prompt for actual news
        prompt = (
            "أنشئ منشور فيسبوك جذاب عن آخر أخبار ون بيس (One Piece) بناء على المحتوى التالي. "
            "ابدأ بجملة افتتاحية قوية تجذب انتباه محبي ون بيس. "
            "تحدث عن الأخبار الحقيقية الموجودة في المحتوى. "
            "استخدم نبرة حماسية ومناسبة لعشاق السلسلة. "
            "أضف رموز تعبيرية بحرية مثل 🏴‍☠️⚓️🗺️. "
            "اختتم بسؤال جمهورك عن آرائهم. "
            "لا تختلق أخباراً غير موجودة في المحتوى. "
            "استخدم اللغة العربية الفصحى. "
            "المحتوى:\n\n" + news_text
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
                    
                    # Add relevant hashtags
                    keywords = extract_keywords(news_text)
                    hashtags = " ".join([f"#{kw}" for kw in keywords[:3]]) if keywords else "#ون_بيس #مانغا #أنمي"
                    
                    final_message = f"{cleaned_summary}\n\n{hashtags}"
                    
                    # Post with images from the actual RSS entries
                    return fb_post(final_message, all_images)
                    
        except Exception as e:
            print("❌ AI error:", e)
            # If AI fails, create a simple post from the news
            simple_message = (
                f"🏴‍☠️ جديد ون بيس!\n\n{news_text[:300]}...\n\n"
                "ما رأيك في هذه الأخبار؟ شاركنا توقعاتك! 👇\n\n"
                "#ون_بيس #مانغا #أنمي"
            )
            return fb_post(simple_message, all_images)

    except Exception as e:
        print("❌ Main error:", e)
    
    # If anything fails, skip posting entirely
    print("⏭️ Error occurred. Skipping post for today.")
    return None

if __name__ == '__main__':
    post_one_piece_news()