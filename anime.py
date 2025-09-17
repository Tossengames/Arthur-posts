# anime_manga_news_post.py
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

# Anime and manga RSS feeds
ANIME_MANGA_RSS_FEEDS = [
    "https://www.animenewsnetwork.com/news/rss.xml",
    "https://www.crunchyroll.com/news/rss",
    "https://myanimelist.net/rss/news.xml",
    "https://www.anime-planet.com/forum/rss/announcements.xml",
    "https://www.manga-updates.com/rss.php",
    "https://www.animeherald.com/feed/",
    "https://www.animecorner.me/feed/",
    "https://www.anitrendz.net/feed/",
]

def extract_keywords(text):
    stop_words = set([
        "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "with",
        "in", "out", "over", "under", "about", "above", "below", "into", "through",
        "during", "before", "after", "while", "of", "off", "up", "down", "then", "now",
        "a", "an", "is", "was", "were", "be", "been", "being", "have", "has", "had", "do",
        "does", "did", "not", "no", "yes", "my", "your", "his", "her", "its", "our", "their",
        "me", "you", "him", "us", "them", "this", "that", "these", "those", "can", "could",
        "would", "should", "will", "may", "might", "must", "very", "just", "only", "also",
        "even", "much", "more", "most", "such", "too", "so", "as", "if", "unless", "until",
        "where", "when", "why", "how", "what", "which", "who", "whom", "whose", "it",
        "said", "says", "told", "announced", "reported", "new", "old", "big", "small", "good",
        "bad", "great", "little", "much", "many", "some", "any", "all", "each", "every",
        "other", "another", "first", "second", "third", "last", "next", "this", "that",
        "here", "there", "then", "now", "well", "still", "always", "often", "seldom", "never",
        "always", "usually", "sometimes", "rarely", "almost", "nearly", "quite", "rather",
        "enough", "too", "very", "just", "only", "ago", "back", "away", "along", "around",
        "about", "again", "already", "also", "anyhow", "anyway", "anywhere", "apart", "aside",
        "at", "away", "back", "before", "behind", "below", "beneath", "beside", "besides",
        "between", "beyond", "but", "by", "down", "during", "early", "elsewhere", "enough",
        "especially", "even", "ever", "everywhere", "except", "far", "fast", "finally",
        "first", "following", "for", "formerly", "forth", "forward", "from", "further",
        "generally", "hardly", "hence", "hereafter", "hereby", "herein", "hereupon", "how",
        "however", "if", "immediately", "in", "inc", "indeed", "instead", "into", "last",
        "later", "least", "less", "likewise", "little", "long", "mainly", "many", "may",
        "maybe", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much",
        "must", "my", "namely", "near", "nearly", "never", "nevertheless", "next", "no",
        "none", "nonetheless", "noone", "nor", "not", "nothing", "now", "nowhere", "obviously",
        "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "otherwise",
        "our", "out", "outside", "over", "overall", "perhaps", "quite", "rather", "really",
        "regarding", "regardless", "right", "round", "same", "seem", "seen", "several",
        "shall", "should", "since", "so", "some", "somehow", "someone", "something",
        "sometime", "sometimes", "somewhat", "somewhere", "soon", "still", "such", "surely",
        "than", "that", "the", "their", "them", "then", "thence", "there", "thereafter",
        "thereby", "therefore", "therein", "thereupon", "these", "they", "think", "third",
        "this", "those", "though", "three", "through", "throughout", "thus", "to", "together",
        "too", "toward", "towards", "under", "unless", "unlike", "unlikely", "until", "up",
        "upon", "us", "use", "usually", "various", "very", "via", "was", "we", "well",
        "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter",
        "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which",
        "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will",
        "with", "within", "without", "would", "yes", "yet", "you", "your", "yourself",
        "yourselves", "anime", "manga", "series", "episode", "chapter", "character", "characters",
        "season", "studio", "release", "announce", "announced", "update", "updated", "news"
    ])
    keywords = set()
    words = re.findall(r'\b[A-Z][a-zA-Z]*\b', text)
    for word in words:
        if word.lower() not in stop_words and len(word) > 2:
            keywords.add(word)
    return list(keywords)[:5]

def manual_rss_image_extraction(rss_url):
    """
    Manually extract images from RSS feeds that don't follow standard formats
    Based on Stack Overflow solution: [citation:1]
    """
    try:
        response = requests.get(rss_url, timeout=10)
        response.raise_for_status()
        raw_xml = response.text
        
        # Enhanced image extraction patterns
        image_patterns = [
            r'<image>(.*?)</image>',
            r'<media:content url="([^"]+)"',
            r'<media:thumbnail url="([^"]+)"',
            r'<enclosure url="([^"]+)" type="image/[^"]+"',
            r'<img src="([^"]+)"',
            r'<url>([^<]+\.(?:jpg|jpeg|png|gif|webp))</url>'
        ]
        
        images = []
        for pattern in image_patterns:
            matches = re.findall(pattern, raw_xml, re.IGNORECASE | re.DOTALL)
            images.extend(matches)
        
        # Filter and clean image URLs
        cleaned_images = []
        for img_url in images:
            if img_url.startswith('http') and img_url not in cleaned_images:
                cleaned_images.append(img_url)
        
        return cleaned_images[:5]  # Return top 5 images
        
    except Exception as e:
        print(f"Error in manual RSS extraction: {e}")
        return []

def extract_images_from_html_content(html_content):
    """Extract images from HTML content using multiple patterns"""
    if not html_content:
        return []
    
    patterns = [
        r'<img[^>]+src="([^">]+)"',
        r'<img[^>]+data-src="([^">]+)"',
        r'<img[^>]+srcset="[^"]*?([^"\\s,]+)[^"]*?"',
        r'background-image:[^"]*url\(["\']?([^"\'\\s)]+)["\']?\)'
    ]
    
    images = []
    for pattern in patterns:
        matches = re.findall(pattern, html_content, re.IGNORECASE)
        images.extend(matches)
    
    return images

def get_images_from_entry(entry, rss_url):
    """Enhanced image extraction from RSS entry"""
    images = []
    
    # Method 1: Manual RSS extraction for problematic feeds
    images.extend(manual_rss_image_extraction(rss_url))
    
    # Method 2: Standard feedparser methods
    content_fields = ['summary', 'description', 'content', 'content[0].value']
    
    for field in content_fields:
        try:
            if hasattr(entry, field.split('.')[0]):
                content = getattr(entry, field.split('.')[0])
                if '.' in field:
                    for part in field.split('.')[1:]:
                        if part == 'value' and hasattr(content, part):
                            content = getattr(content, part)
                        elif isinstance(content, dict) and part in content:
                            content = content[part]
                        else:
                            content = None
                            break
                
                if content and isinstance(content, str):
                    html_images = extract_images_from_html_content(content)
                    images.extend(html_images)
        except:
            continue
    
    # Method 3: Check enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enc in entry.enclosures:
            try:
                if (hasattr(enc, 'type') and 'image' in enc.type.lower() and 
                    hasattr(enc, 'href')):
                    images.append(enc.href)
            except:
                continue
    
    # Method 4: Check media fields
    media_fields = ['media_content', 'media_thumbnail', 'media_group']
    for field in media_fields:
        if hasattr(entry, field):
            media = getattr(entry, field)
            if isinstance(media, list):
                for item in media:
                    if hasattr(item, 'url'):
                        images.append(item.url)
                    elif isinstance(item, dict) and 'url' in item:
                        images.append(item['url'])
    
    # Clean and filter images
    valid_images = []
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
    
    for img in images:
        if (isinstance(img, str) and img.startswith('http') and 
            any(ext in img.lower() for ext in image_extensions) and
            img not in valid_images):
            valid_images.append(img)
    
    return valid_images[:10]  # Limit to 10 images

def fb_post(message, image_urls=None):
    """Post to Facebook with improved image handling"""
    if not image_urls or len(image_urls) == 0:
        print("[FB POST] No images provided, posting text only")
        return post_text_only(message)
    
    # Filter valid image URLs
    valid_images = []
    for img_url in image_urls:
        if (isinstance(img_url, str) and img_url.startswith('http') and
            any(ext in img_url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp'])):
            valid_images.append(img_url)
    
    if not valid_images:
        print("[FB POST] No valid image URLs found, falling back to text")
        return post_text_only(message)
    
    print(f"[FB POST] Attempting to upload {len(valid_images)} images")
    
    uploaded_media_ids = []
    for img_url in valid_images[:4]:  # Facebook allows max 4 images per post
        try:
            print(f"  Downloading: {img_url}")
            response = requests.get(img_url, timeout=15, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            
            if response.status_code != 200:
                continue
                
            # Verify it's actually an image
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                continue
            
            # Upload to Facebook
            upload_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/photos"
            files = {'source': ('image.jpg', BytesIO(response.content), content_type)}
            data = {
                'access_token': FB_PAGE_TOKEN,
                'published': 'false'
            }
            
            upload_response = requests.post(upload_url, data=data, files=files, timeout=15)
            result = upload_response.json()
            
            if 'id' in result:
                uploaded_media_ids.append({"media_fbid": result['id']})
                print(f"  ✅ Uploaded: {result['id']}")
            else:
                print(f"  ❌ Upload failed: {result}")
                
        except Exception as e:
            print(f"  ❌ Error uploading {img_url}: {e}")
    
    if uploaded_media_ids:
        # Create post with attached media
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
                print("[FB POST] ✅ Multi-image post successful!")
                return result
            else:
                print("[FB POST] ❌ Multi-image post failed:", result)
                return post_text_only(message)
        except Exception as e:
            print("[FB POST] ❌ Error creating post:", e)
            return post_text_only(message)
    else:
        print("[FB POST] ❌ No images uploaded successfully")
        return post_text_only(message)

def post_text_only(message):
    """Post text-only message to Facebook"""
    post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
    data = {
        "message": message,
        "access_token": FB_PAGE_TOKEN
    }
    try:
        response = requests.post(post_url, data=data, timeout=10)
        result = response.json()
        print("[FB POST] ✅ Text post successful")
        return result
    except Exception as e:
        print("[FB POST] ❌ Text post failed:", e)
        return None

def get_anime_manga_news():
    """Fetch anime and manga news from multiple RSS feeds"""
    all_entries = []
    
    for rss_url in ANIME_MANGA_RSS_FEEDS:
        try:
            print(f"🎌 Fetching: {rss_url}")
            feed = feedparser.parse(rss_url)
            
            if feed.entries:
                for entry in feed.entries:
                    entry.source_url = rss_url  # Store source URL for image extraction
                    entry.source = rss_url.split('//')[1].split('/')[0]
                    all_entries.append(entry)
                print(f"✅ Found {len(feed.entries)} entries")
            else:
                print(f"⚠️ No entries found")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Sort by date
    all_entries.sort(key=lambda x: getattr(x, 'published_parsed', (0, 0, 0, 0, 0, 0, 0, 0, 0)), reverse=True)
    
    return all_entries[:10]

def clean_facebook_text(text):
    """Remove markdown formatting"""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'__(.*?)__', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'_(.*?)_', r'\1', text)
    text = re.sub(r'[#`~]', '', text)
    return text.strip()

def post_anime_manga_news():
    print("🎌 Starting anime/manga news collection...")
    
    generated_keywords = []
    all_image_urls = []
    
    try:
        entries = get_anime_manga_news()
        
        if not entries:
            fallback_message = (
                "🎌 لا توجد أخبار أنمي أو مانغا رئيسية للإبلاغ عنها الآن! "
                "ما هو آخر أنمي شاهدته أو مانغا قرأتها؟ شاركنا تجربتك! 👇 "
                "#أنمي #مانغا #أخبار_الأنمي"
            )
            fb_post(fallback_message)
            return

        posts_for_ai = []
        all_text_for_keywords = []

        for entry in entries[:5]:
            title = getattr(entry, 'title', 'No Title').strip()
            summary = getattr(entry, 'summary', title)[:300].replace('\n', ' ').strip()
            link = getattr(entry, 'link', '#').strip()
            source = getattr(entry, 'source', 'Unknown Source')
            
            if not title or title.lower().startswith('no title'):
                continue

            posts_for_ai.append(f"Source: {source}\nTitle: {title}\nSummary: {summary}\nLink: {link}")
            all_text_for_keywords.append(title + " " + summary)

            # Extract images using enhanced method
            entry_images = get_images_from_entry(entry, getattr(entry, 'source_url', ''))
            print(f"  Found {len(entry_images)} images for: {title[:50]}...")
            
            for img_url in entry_images:
                if img_url and img_url not in all_image_urls:
                    all_image_urls.append(img_url)

        print(f"Total images found: {len(all_image_urls)}")
        if all_image_urls:
            print("Sample images:", all_image_urls[:3])

        # AI content generation (same as before)
        raw_combined = "\n\n".join(posts_for_ai)
        generated_keywords = extract_keywords(" ".join(all_text_for_keywords))
        
        prompt = (
            "قم بإنشاء منشور فيسبوك جذاب عن أخبار الأنمي والمانغا. "
            "ابدأ مباشرة بخطاف قوي وجذاب للانتباه بدون أي تحية أو مقدمة. "
            "استخدم نبرة حماسية وعادية تناسب مجتمع الأنمي والمانغا. "
            "قم بتنسيق المنشور بفقرات ورموز تعبيرية استراتيجية لتحسين قابلية القراءة. "
            "لا تستخدم أي تنسيق مثل العريض أو المائل (** أو __). "
            "استخدم اللغة العربية الفصحى الرسمية فقط مع الحفاظ على أسماء الأنمي والمانغا بالإنجليزية أو اليابانية. "
            "اختتم بدعوة قوية للجمهور للإعجاب والمشاركة والتعليق على آرائهم، "
            "وانتهي بـ 3-4 وسوم ذات صلة. "
            "لا تدرج روابط في المنشور النهائي. "
            "إليك الأخبار:\n\n" + raw_combined
        )

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
                    fb_post(cleaned_summary, all_image_urls)
                    return
        except:
            pass

    except Exception as e:
        print(f"Error: {e}")
    
    # Fallback
    emoji_list = ["🎌", "🔥", "📺", "📖", "🚨", "✨", "🌟", "🎯"]
    clean_posts = []

    if entries:
        for i, entry in enumerate(entries[:3]):
            emoji = emoji_list[i % len(emoji_list)]
            title = getattr(entry, 'title', 'Latest Update').strip()
            summary = getattr(entry, 'summary', '')[:180].strip().replace('\n', ' ')
            if title and summary:
                clean_posts.append(f"{emoji} {title}\n{summary}")
            elif title:
                clean_posts.append(f"{emoji} {title}")
    
    if clean_posts:
        fallback_message = "🎌 آخر أخبار عالم الأنمي والمانغا:\n\n" + "\n\n".join(clean_posts)
    else:
        fallback_message = "🎌 لا توجد أخبار أنمي أو مانغا رئيسية للإبلاغ عنها الآن!"
    
    fallback_message += "\n\nما رأيك في هذه الأخبار؟ شاركنا رأيك في التعليقات! 👇"
    fallback_hashtags = "#أنمي #مانغا #أخبار_الأنمي #مجتمع_الأنمي"
    
    if generated_keywords:
        fallback_hashtags += " " + " ".join([f"#{kw}" for kw in generated_keywords])
    
    cleaned_fallback = clean_facebook_text(fallback_message)
    fb_post(f"{cleaned_fallback}\n\n{fallback_hashtags}", all_image_urls)

if __name__ == '__main__':
    post_anime_manga_news()