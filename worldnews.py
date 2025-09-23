# hollywood_news_post.py
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

# Hollywood and celebrities RSS feeds
HOLLYWOOD_RSS_FEEDS = [
    "https://feeds.feedburner.com/people/news",  # People Magazine
    "https://www.eonline.com/news.rss",  # E! News
    "https://feeds.feedburner.com/justjared",  # Just Jared
    "https://www.tmz.com/rss.xml",  # TMZ
    "https://feeds.feedburner.com/etonline/news",  # Entertainment Tonight
    "https://www.hollywoodreporter.com/feed/",  # Hollywood Reporter
    "https://variety.com/feed/",  # Variety
    "https://deadline.com/feed/",  # Deadline
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
        "none", "nonetheless", "noone", "nor", "not", "nothing", "now", "nowwhere", "obviously",
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
        "yourselves", "hollywood", "celebrity", "celebrities", "movie", "movies", "film",
        "films", "actor", "actors", "actress", "actresses", "star", "stars", "famous",
        "entertainment", "news", "gossip", "red", "carpet", "award", "awards", "oscar",
        "oscars", "grammy", "golden", "globe", "premiere", "premieres", "tv", "television",
        "show", "shows", "series", "netflix", "hbo", "amazon", "disney", "marvel", "dc"
    ])
    keywords = set()
    words = re.findall(r'\b[A-Z][a-zA-Z]*\b', text)
    for word in words:
        if word.lower() not in stop_words and len(word) > 2:
            # Add the '#' prefix to make it a hashtag
            keywords.add(f"#{word}")
    return list(keywords)[:5]

def fb_post(message, image_urls=None):
    # Check if message is empty or contains only whitespace
    if not message or not message.strip():
        print("[FB POST] ❌ Error: Message is empty, cannot post.")
        return
        
    message = message.strip()
    print(f"[FB POST] Message length: {len(message)} characters")
    
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
                result = response.json()
                print("[FB POST Result - Multi-photo Post]", result)
                return result
            except requests.exceptions.RequestException as e:
                print(f"[FB POST Error] ❌ Failed to create multi-photo post: {e}")
                print("[FB POST] Falling back to text-only post.")
        else:
            print("[FB POST] No images successfully uploaded. Posting text-only message.")
    
    # Text-only post fallback
    print("[FB POST] Posting text-only message.")
    post_url = f"https://graph.facebook.com/v18.0/{FB_PAGE_ID}/feed"
    data = {
        "message": message,
        "access_token": FB_PAGE_TOKEN
    }
    try:
        response = requests.post(post_url, data=data, timeout=10)
        response.raise_for_status()
        result = response.json()
        print("[FB POST Result - Text Only]", result)
        return result
    except requests.exceptions.RequestException as e:
        print(f"[FB POST Error] ❌ Failed to create text post: {e}")
        return None

def get_hollywood_news():
    """Fetch Hollywood and celebrities news from multiple RSS feeds and return combined entries"""
    all_entries = []
    
    for rss_url in HOLLYWOOD_RSS_FEEDS:
        try:
            print(f"🎬 Fetching Hollywood news from: {rss_url}")
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

def clean_facebook_text(text):
    """Remove markdown formatting that doesn't work well on Facebook"""
    if not text:
        return ""
    # Remove **bold** formatting
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    # Remove __bold__ formatting
    text = re.sub(r'__(.*?)__', r'\1', text)
    # Remove *italic* formatting
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    # Remove _italic_ formatting
    text = re.sub(r'_(.*?)_', r'\1', text)
    # Remove any remaining markdown symbols except hashtags
    text = re.sub(r'[`~]', '', text)
    return text.strip()

def is_recent_entry(entry, hours_threshold=48):
    """Check if the entry was published within the last specified hours"""
    try:
        if hasattr(entry, 'published_parsed'):
            published_time = datetime(*entry.published_parsed[:6])
            time_diff = datetime.utcnow() - published_time
            return time_diff.total_seconds() <= (hours_threshold * 3600)
    except:
        pass
    return False

def extract_images_from_entry(entry):
    """Extract images from RSS entry with better error handling"""
    images = []
    
    # Try different methods to extract images
    methods = [
        # Method 1: media_content
        lambda: [media.url for media in getattr(entry, 'media_content', []) 
                if hasattr(media, 'url') and hasattr(media, 'type') and getattr(media, 'type', '').startswith('image/')],
        
        # Method 2: enclosures
        lambda: [enc.href for enc in getattr(entry, 'enclosures', [])
                if hasattr(enc, 'href') and hasattr(enc, 'type') and getattr(enc, 'type', '').startswith('image/')],
        
        # Method 3: HTML content parsing
        lambda: re.findall(r'<img[^>]+src="([^">]+)"', getattr(entry, 'summary', '') + getattr(entry, 'description', '')),
        
        # Method 4: links with image extensions
        lambda: [link.href for link in getattr(entry, 'links', [])
                if hasattr(link, 'href') and any(ext in link.href.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp'])]
    ]
    
    for method in methods:
        try:
            found_images = method()
            if found_images:
                images.extend(found_images)
        except Exception as e:
            continue
    
    # Filter and return unique images
    valid_images = []
    for img in images:
        if (isinstance(img, str) and img.startswith('http') and 
            any(ext in img.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']) and
            img not in valid_images):
            valid_images.append(img)
    
    return valid_images[:3]  # Return max 3 images per entry

def post_hollywood_news():
    print("🎬 Fetching latest Hollywood and celebrities news from multiple sources...")
    
    try:
        entries = get_hollywood_news()
        
        # Filter only recent entries (last 48 hours)
        recent_entries = [entry for entry in entries if is_recent_entry(entry)]
        
        if not recent_entries:
            print("❌ No recent Hollywood news entries found from any RSS feed.")
            fallback_message = (
                "🌟 أخبار هوليوود والمشاهير\n\n"
                "لا توجد أخبار مثيرة عن المشاهير للإبلاغ عنها حالياً! "
                "من هو نجمك المفضل؟ شاركنا رأيك! 👇\n\n"
                "📲 تابع الصفحة للحصول على آخر أخبار هوليوود والمشاهير يومياً!\n\n"
                "#أخبار_هوليوود #المشاهير #أخبار_الفن #هوليوود"
            )
            fb_post(fallback_message)
            return

        posts_for_ai = []
        all_text_for_keywords = []
        image_urls_to_post = []

        for entry in recent_entries[:6]:  # Use up to 6 recent entries
            title = getattr(entry, 'title', 'No Title').strip()
            summary = getattr(entry, 'summary', '')
            description = getattr(entry, 'description', summary)
            
            # Use the longer of summary or description
            content = description if len(description) > len(summary) else summary
            content = content[:400].replace('\n', ' ').strip()
            
            link = getattr(entry, 'link', '#').strip()
            source = getattr(entry, 'source', 'Unknown Source')
            published = getattr(entry, 'published', '')
            
            if not title or title.lower().startswith('no title'):
                print(f"[Hollywood News] Skipping malformed entry: Title='{title}'")
                continue

            # Create detailed entry information
            detailed_entry = f"المصدر: {source}\nتاريخ النشر: {published}\nالعنوان: {title}\nالمحتوى: {content}\nالرابط: {link}"
            posts_for_ai.append(detailed_entry)
            all_text_for_keywords.append(title + " " + content)

            # Extract images
            entry_images = extract_images_from_entry(entry)
            for img_url in entry_images:
                if img_url not in image_urls_to_post:
                    image_urls_to_post.append(img_url)

        image_urls_to_post = image_urls_to_post[:10]
        print(f"Total unique images collected for post: {len(image_urls_to_post)}")

        if not posts_for_ai:
            print("❌ No valid news entries to process.")
            fallback_message = (
                "🌟 أخبار هوليوود والمشاهير\n\n"
                "لا توجد أخبار جديدة عن المشاهير حالياً. "
                "ما هو آخر فيلم شاهدته؟ شاركنا رأيك! 👇\n\n"
                "📲 تابع الصفحة للحصول على آخر أخبار هوليوود!\n\n"
                "#أخبار_هوليوود #المشاهير #أفلام #هوليوود"
            )
            fb_post(fallback_message)
            return

        raw_combined = "\n\n".join(posts_for_ai)
        generated_keywords = extract_keywords(" ".join(all_text_for_keywords))

        prompt = (
            "قم بإنشاء منشور فيسبوك عربي عن أخبار هوليوود والمشاهير باستخدام المعلومات التالية. "
            "المنشور يجب أن يكون:\n"
            "- باللغة العربية الفصحى السليمة\n"
            "- يبدأ بعنوان جذاب عن أخبار هوليوود\n"
            "- يحتوي على ملخص للأخبار المهمة\n"
            "- يستخدم رموز تعبيرية مناسبة\n"
            -" يكون مناسباً لجمهور عربي مهتم بأخبار المشاهير\n"
            "- ينتهي بدعوة للتفاعل ووسوم ذات صلة\n"
            "- لا يستخدم تنسيق الماركداون (لا ** أو __ أو *)\n"
            "- يحافظ على أسماء النجوم والأفلام بالإنجليزية\n\n"
            "الأخبار:\n" + raw_combined +
            ("\n\nالكلمات المفتاحية للوسوم: " + ", ".join(generated_keywords) if generated_keywords else "")
        )

        print("[Gemini] Sending request to Gemini API...")
        try:
            response = requests.post(
                "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
                params={"key": GEMINI},
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "temperature": 0.7,
                        "topK": 40,
                        "topP": 0.8,
                        "maxOutputTokens": 2000
                    }
                },
                timeout=45
            )

            if response.status_code == 200:
                data = response.json()
                print("[Gemini] Received response from API")
                
                if "candidates" in data and data["candidates"]:
                    ai_summary = data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"[Gemini] Generated text length: {len(ai_summary)} characters")
                    
                    if ai_summary and len(ai_summary.strip()) > 50:  # Ensure meaningful content
                        cleaned_summary = clean_facebook_text(ai_summary)
                        print("[Gemini] Posting to Facebook...")
                        fb_post(cleaned_summary, image_urls_to_post)
                        print("[Gemini Hollywood News] Successfully generated and posted content.")
                        return
                    else:
                        print("[Gemini] ❌ Generated content is too short or empty")
                else:
                    print(f"[Gemini] ❌ No valid candidates found: {data}")
            else:
                print(f"[Gemini] ❌ API Error {response.status_code}: {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"[Gemini] ❌ Network error: {e}")
        except json.JSONDecodeError as e:
            print(f"[Gemini] ❌ JSON decode error: {e}")
        except Exception as e:
            print(f"[Gemini] ❌ Unexpected error: {e}")

    except Exception as e:
        print(f"[Hollywood News] ❌ Main processing error: {e}")
    
    # Fallback content
    print("[Fallback] Using fallback content...")
    emoji_list = ["🌟", "🎬", "✨", "🏆", "📸", "💫"]
    clean_posts = []

    if entries:
        for i, entry in enumerate(entries[:4]):
            if not is_recent_entry(entry):
                continue
                
            emoji = emoji_list[i % len(emoji_list)]
            title = getattr(entry, 'title', 'Latest Hollywood News').strip()
            if title and not title.lower().startswith('no title'):
                clean_posts.append(f"{emoji} {title}")

    if clean_posts:
        fallback_message = (
            "🌟 أخبار هوليوود والمشاهير 🌟\n\n"
            "أبرز العناوين:\n" +
            "\n".join(clean_posts) +
            "\n\nما رأيك في هذه الأخبار؟ شاركنا رأيك في التعليقات! 👇\n\n"
            "📲 تابع الصفحة للحصول على آخر أخبار هوليوود والمشاهير يومياً!\n\n"
            "#أخبار_هوليوود #المشاهير #أخبار_الفن #هوليوود"
        )
    else:
        fallback_message = (
            "🌟 أخبار هوليوود والمشاهير\n\n"
            "تابعونا لأحدث أخبار المشاهير والأفلام من هوليوود! 🎬\n\n"
            "ما هو آخر فيلم شاهدته؟ ومن نجمك المفضل؟ شاركنا في التعليقات! 👇\n\n"
            "📲 تابع الصفحة للبقاء على اطلاع دائم بأخبار هوليوود!\n\n"
            "#أخبار_هوليوود #المشاهير #أفلام #هوليوود"
        )

    # Extract images for fallback
    fallback_images = []
    if entries:
        for entry in entries[:3]:
            fallback_images.extend(extract_images_from_entry(entry))
    
    cleaned_fallback = clean_facebook_text(fallback_message)
    fb_post(cleaned_fallback, fallback_images[:3])

if __name__ == '__main__':
    post_hollywood_news()