# soccer_news_post.py
import os
import requests
import feedparser
from datetime import datetime
from dotenv import load_dotenv
import re
from io import BytesIO
import json

load_dotenv()

FB_PAGE_ID = os.getenv("FB_PAGE_ID")
FB_PAGE_TOKEN = os.getenv("FB_PAGE_TOKEN")
GEMINI = os.getenv("GEMINI_API_KEY")

# Popular soccer RSS feeds
SOCCER_RSS_FEEDS = [
    "https://www.espn.com/espn/rss/soccer/news",  # ESPN Soccer News
    "https://www.bbc.co.uk/sport/football/rss.xml",  # BBC Football
    "https://www.skysports.com/rss/12040",  # Sky Sports Football
    "https://www.goal.com/feeds/en/news",  # Goal.com News
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
        "yourselves", "football", "soccer", "match", "game", "goal", "player", "team"
    ])
    keywords = set()
    words = re.findall(r'\b[A-Z][a-zA-Z]*\b', text)
    for word in words:
        if word.lower() not in stop_words and len(word) > 2:
            keywords.add(word)
    return list(keywords)[:5]

def fb_post(message, image_urls=None):
    if image_urls and len(image_urls) > 0:
        uploaded_media_ids = []
        upload_photo_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/photos"

        print(f"[FB POST] Attempting to upload {len(image_urls)} images for multi-photo post...")
        for img_url in image_urls:
            try:
                image_response = requests.get(img_url, stream=True, timeout=10)
                image_response.raise_for_status()

                image_file = BytesIO(image_response.content)
                content_type = image_response.headers.get('Content-Type', 'image/jpeg')
                
                params = {
                    "access_token": FB_PAGE_TOKEN,
                    "published": "false"
                }
                files = {'source': ('image', image_file.getvalue(), content_type)}
                
                response = requests.post(upload_photo_url, data=params, files=files)
                response.raise_for_status()
                result = response.json()
                
                if 'id' in result:
                    uploaded_media_ids.append({"media_fbid": result['id']})
                    print(f"  [FB POST] Uploaded image {img_url} with ID: {result['id']}")
                else:
                    print(f"  [FB POST] ❌ Failed to get ID for image {img_url}: {result}")

            except requests.exceptions.RequestException as e:
                print(f"  [FB POST Error] ❌ Failed to download or upload image {img_url}: {e}")
            except Exception as e:
                print(f"  [FB POST Error] ❌ An unexpected error occurred during image upload {img_url}: {e}")
        
        if uploaded_media_ids:
            print(f"[FB POST] Creating multi-photo post with {len(uploaded_media_ids)} images.")
            feed_post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
            
            post_data = {
                "message": message,
                "access_token": FB_PAGE_TOKEN,
                "attached_media": json.dumps(uploaded_media_ids)
            }

            try:
                response = requests.post(feed_post_url, data=post_data, timeout=10)
                response.raise_for_status()
                print("[FB POST Result - Multi-photo Post]", response.json())
            except requests.exceptions.RequestException as e:
                print(f"[FB POST Error] ❌ Failed to create multi-photo post: {e}")
                print("[FB POST] Falling back to text-only post.")
                text_post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
                text_data = {
                    "message": message,
                    "access_token": FB_PAGE_TOKEN
                }
                response = requests.post(text_post_url, data=text_data, timeout=10)
                print("[FB POST Result - Text Only Fallback]", response.json())
            except Exception as e:
                print(f"[FB POST Error] ❌ An unexpected error occurred during multi-photo post: {e}")
                print("[FB POST] Falling back to text-only post.")
                text_post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
                text_data = {
                    "message": message,
                    "access_token": FB_PAGE_TOKEN
                }
                response = requests.post(text_post_url, data=text_data, timeout=10)
                print("[FB POST Result - Text Only Fallback]", response.json())
        else:
            print("[FB POST] No images successfully uploaded. Posting text-only message.")
            post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
            data = {
                "message": message,
                "access_token": FB_PAGE_TOKEN
            }
            response = requests.post(post_url, data=data, timeout=10)
            print("[FB POST Result - Text Only]", response.json())

    else:
        print("[FB POST] No images provided. Posting text-only message.")
        post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
        data = {
            "message": message,
            "access_token": FB_PAGE_TOKEN
        }
        response = requests.post(post_url, data=data, timeout=10)
        print("[FB POST Result - Text Only]", response.json())

def get_soccer_news():
    """Fetch soccer news from multiple RSS feeds and return combined entries"""
    all_entries = []
    
    for rss_url in SOCCER_RSS_FEEDS:
        try:
            print(f"📰 Fetching soccer news from: {rss_url}")
            feed = feedparser.parse(rss_url)
            
            if feed.entries:
                for entry in feed.entries:
                    # Add source information to each entry
                    entry.source = rss_url.split('//')[1].split('/')[0]  # Extract domain
                    all_entries.append(entry)
                print(f"✅ Found {len(feed.entries)} entries from {rss_url}")
            else:
                print(f"⚠️ No entries found in: {rss_url}")
                
        except Exception as e:
            print(f"❌ Error parsing RSS feed {rss_url}: {e}")
    
    # Sort entries by published date (newest first)
    all_entries.sort(key=lambda x: getattr(x, 'published_parsed', (0, 0, 0, 0, 0, 0, 0, 0, 0)), reverse=True)
    
    return all_entries[:10]  # Return top 10 most recent entries

def extract_images_from_entry(entry):
    """Extract images from an RSS entry using multiple methods"""
    images = []
    
    # Method 1: Check media_content
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            if hasattr(media, 'url') and media.url and media.get('type', '').startswith('image/'):
                images.append(media.url)
    
    # Method 2: Check enclosures
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enc in entry.enclosures:
            if hasattr(enc, 'href') and enc.href and enc.get('type', '').startswith('image/'):
                images.append(enc.href)
    
    # Method 3: Check links
    if hasattr(entry, 'links') and entry.links:
        for link in entry.links:
            if hasattr(link, 'href') and link.href and link.get('type', '').startswith('image/'):
                images.append(link.href)
    
    # Method 4: Parse HTML content for img tags
    content_fields = ['summary', 'description', 'content']
    for field in content_fields:
        if hasattr(entry, field) and getattr(entry, field):
            content = getattr(entry, field)
            # Extract image URLs from HTML
            img_matches = re.findall(r'<img[^>]+src="([^">]+)"', content)
            images.extend(img_matches)
            
            # Also check for srcset and data-src attributes
            srcset_matches = re.findall(r'srcset="([^"]+)"', content)
            for srcset in srcset_matches:
                urls = re.findall(r'([^\s,]+)\s*(?:\d+w)?[,]?', srcset)
                images.extend(urls)
            
            data_src_matches = re.findall(r'data-src="([^">]+)"', content)
            images.extend(data_src_matches)
    
    # Method 5: Check for common image fields
    image_fields = ['image', 'thumbnail', 'media:thumbnail', 'media:content']
    for field in image_fields:
        if hasattr(entry, field) and getattr(entry, field):
            image_obj = getattr(entry, field)
            if hasattr(image_obj, 'url') and image_obj.url:
                images.append(image_obj.url)
            elif isinstance(image_obj, str) and image_obj.startswith('http'):
                images.append(image_obj)
    
    # Filter and clean image URLs
    unique_images = []
    for img_url in images:
        if img_url and img_url.startswith('http'):
            # Clean URL by removing query parameters that might cause issues
            clean_url = img_url.split('?')[0]
            if clean_url not in unique_images:
                unique_images.append(clean_url)
    
    return unique_images[:5]  # Return up to 5 unique images per entry

def post_soccer_news():
    print("⚽ Fetching latest soccer news from multiple sources...")
    
    try:
        entries = get_soccer_news()
        
        if not entries:
            print("❌ No soccer news entries found from any RSS feed.")
            fallback_message = (
                "📢 أبرز العناوين:\n\n"
                "⚽ لا توجد أخبار كرة قدم رئيسية الآن\n\n"
                "ما رأيكم في هذه التطورات؟ شاركونا آراءكم 👇\n\n"
                "#كرة_القدم #أخبار_الكرة #متابعات_كروية"
            )
            fb_post(fallback_message)
            return

        posts_for_ai = []
        all_text_for_keywords = []
        image_urls_to_post = []

        for entry in entries[:5]:  # Use top 5 entries
            title = getattr(entry, 'title', 'No Title').strip()
            summary = getattr(entry, 'summary', title)[:300].replace('\n', ' ').strip()
            link = getattr(entry, 'link', '#').strip()
            source = getattr(entry, 'source', 'Unknown Source')
            
            if not title or not summary or title.lower().startswith('no title'):
                print(f"[Soccer News] Skipping malformed entry: Title='{title}', Summary='{summary}'")
                continue

            posts_for_ai.append(f"Source: {source}\nTitle: {title}\nSummary: {summary}\nLink: {link}")
            all_text_for_keywords.append(title + " " + summary)

            # Extract images from entry using improved function
            entry_images = extract_images_from_entry(entry)
            print(f"Found {len(entry_images)} images for entry: {title}")
            
            for img_url in entry_images:
                if img_url and img_url.startswith('http') and img_url not in image_urls_to_post: 
                    image_urls_to_post.append(img_url)

        image_urls_to_post = list(set(image_urls_to_post))[:10]
        print(f"Total unique images collected for post: {len(image_urls_to_post)}")
        
        # If no images found, try to get some default soccer images
        if not image_urls_to_post:
            print("No images found in RSS feeds, using fallback soccer images...")
            fallback_images = [
                "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
                "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
                "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800"
            ]
            image_urls_to_post = fallback_images[:2]

        raw_combined = "\n\n".join(posts_for_ai)
        generated_keywords = extract_keywords(" ".join(all_text_for_keywords))

        prompt = (
            "أنشئ منشور فيسبوك باللغة العربية الفصحى فقط عن أخبار كرة القدم التالية. "
            "ابدأ مباشرة بالمحتوى الرئيسي بدون أي تحيات أو مقدمات. "
            "ركز على العناوين الرئيسية والأخبار المهمة فقط. "
            "استخدم نبرة احترافية ورياضية. "
            "قم بتنسيق المنشور بفقرات واضحة ورموز تعبيرية مناسبة. "
            "اختتم بدعوة الجمهور للمشاركة والتعليق. "
            "لا تدرج أي روابط في المنشور النهائي. "
            "إليك الأخبار:\n\n" + raw_combined
        )

        try:
            response = requests.post(
                "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
                params={"key": GEMINI},
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=20
            )

            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and data["candidates"]:
                    ai_summary = data["candidates"][0]["content"]["parts"][0]["text"]
                    fb_post(ai_summary, image_urls_to_post)
                    print("[Gemini Soccer News] Successfully generated and posted content in Arabic.")
                    return
                else:
                    print(f"[Gemini Soccer News] ❌ No valid candidates found in Gemini response: {data}")
            else:
                print(f"[Gemini Soccer News Error] ❌ API Status {response.status_code}: {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"[Gemini Soccer News Exception] ❌ Network or API error during Gemini call: {e}")
        except json.JSONDecodeError:
            print(f"[Gemini Soccer News Exception] ❌ Could not decode JSON response from Gemini API.")
        except Exception as e:
            print(f"[Gemini Soccer News Exception] ❌ An unexpected error occurred with Gemini API: {e}")

    except Exception as e:
        print(f"[Soccer News Exception] ❌ An error occurred while processing soccer news: {e}")
    
    # Fallback if anything above fails (direct to headlines)
    if entries:
        headlines = []
        for i, entry in enumerate(entries[:3]):
            title = getattr(entry, 'title', 'أخبار كرة القدم').strip()
            if title:
                headlines.append(f"• {title}")
        
        if headlines:
            fallback_message = (
                "📢 أبرز العناوين:\n\n" +
                "\n".join(headlines) +
                "\n\nما رأيكم في هذه التطورات؟ شاركونا آراءكم 👇\n\n"
                "#كرة_القدم #أخبار_الكرة #متابعات_كروية"
            )
        else:
            fallback_message = (
                "📢 أبرز العناوين:\n\n"
                "⚽ لا توجد أخبار كرة قدم رئيسية الآن\n\n"
                "ما رأيكم في هذه التطورات؟ شاركونا آراءكم 👇\n\n"
                "#كرة_القدم #أخبار_الكرة #متابعات_كروية"
            )
    else:
        fallback_message = (
            "📢 أبرز العناوين:\n\n"
            "⚽ لا توجد أخبار كرة قدم رئيسية الآن\n\n"
            "ما رأيكم في هذه التطورات؟ شاركونا آراءكم 👇\n\n"
            "#كرة_القدم #أخبار_الكرة #متابعات_кروية"
        )

    fb_post(fallback_message, image_urls_to_post if image_urls_to_post else None)

if __name__ == '__main__':
    post_soccer_news()