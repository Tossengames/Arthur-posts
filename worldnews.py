# gaming_news_post.py
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

# Video games and indie games RSS feeds
GAMING_RSS_FEEDS = [
    "https://variety.com/t/one-piece/feed/",  # PC Gamer
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
        "yourselves", "game", "games", "gaming", "video", "player", "players", "play",
        "playing", "release", "released", "announce", "announced", "update", "updated",
        "news", "title", "titles", "studio", "studios", "developer", "developers", "indie"
    ])
    keywords = set()
    words = re.findall(r'\b[A-Z][a-zA-Z]*\b', text)
    for word in words:
        if word.lower() not in stop_words and len(word) > 2:
            # Add the '#' prefix to make it a hashtag
            keywords.add(f"#{word}")
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
            "markdown": message,
            "access_token": FB_PAGE_TOKEN
        }
        response = requests.post(post_url, data=data, timeout=10)
        print("[FB POST Result - Text Only]", response.json())

def get_gaming_news():
    """Fetch gaming news from multiple RSS feeds and return combined entries"""
    all_entries = []
    
    for rss_url in GAMING_RSS_FEEDS:
        try:
            print(f"🎮 Fetching gaming news from: {rss_url}")
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

def post_gaming_news():
    print("🎮 Fetching latest gaming news from multiple sources...")
    
    # Initialize generated_keywords with empty list to avoid UnboundLocalError
    generated_keywords = []
    
    try:
        entries = get_gaming_news()
        
        # Filter only recent entries (last 48 hours)
        recent_entries = [entry for entry in entries if is_recent_entry(entry)]
        
        if not recent_entries:
            print("❌ No recent gaming news entries found from any RSS feed.")
            fallback_message = (
                "📰 أخبار الألعاب من GameSea\n\n"
                "لا توجد أخبار ألعاب رئيسية للإبلاغ عنها حالياً! "
                "ما هي آخر لعبة لعبتها؟ شاركنا تجربتك! 👇\n\n"
                "📲 تابع الصفحة للحصول على آخر أخبار وتحديثات الألعاب يومياً!\n\n"
                "#أخبار_الألعاب #ألعاب_فيديو #ألعاب_إندي #GameSea"
            )
            fb_post(fallback_message)
            return

        posts_for_ai = []
        all_text_for_keywords = []
        image_urls_to_post = []

        for entry in recent_entries[:8]:  # Use up to 8 recent entries for detailed coverage
            title = getattr(entry, 'title', 'No Title').strip()
            summary = getattr(entry, 'summary', '')
            description = getattr(entry, 'description', summary)
            
            # Use the longer of summary or description
            content = description if len(description) > len(summary) else summary
            content = content[:500].replace('\n', ' ').strip()  # Limit length but keep it detailed
            
            link = getattr(entry, 'link', '#').strip()
            source = getattr(entry, 'source', 'Unknown Source')
            published = getattr(entry, 'published', '')
            
            if not title or title.lower().startswith('no title'):
                print(f"[Gaming News] Skipping malformed entry: Title='{title}'")
                continue

            # Create detailed entry information
            detailed_entry = f"المصدر: {source}\nتاريخ النشر: {published}\nالعنوان: {title}\nالمحتوى: {content}\nالرابط: {link}"
            posts_for_ai.append(detailed_entry)
            all_text_for_keywords.append(title + " " + content)

            # Extract images from entry - handle different RSS formats safely
            current_entry_images = []
            
            # Handle media_content
            if hasattr(entry, 'media_content') and entry.media_content:
                for media in entry.media_content:
                    if hasattr(media, 'url') and hasattr(media, 'type') and media.get('type', '').startswith('image/'):
                        current_entry_images.append(media.url)
                    elif isinstance(media, dict) and 'url' in media and media.get('type', '').startswith('image/'):
                        current_entry_images.append(media['url'])
            
            # Handle enclosures
            if hasattr(entry, 'enclosures') and entry.enclosures:
                for enc in entry.enclosures:
                    if hasattr(enc, 'href') and hasattr(enc, 'type') and enc.get('type', '').startswith('image/'):
                        current_entry_images.append(enc.href)
                    elif isinstance(enc, dict) and 'href' in enc and enc.get('type', '').startswith('image/'):
                        current_entry_images.append(enc['href'])
            
            # Extract images from HTML content
            if hasattr(entry, 'summary'):
                try:
                    matches = re.findall(r'<img[^>]+src="([^">]+)"', entry.summary)
                    current_entry_images.extend(matches)
                except:
                    pass
            
            if hasattr(entry, 'description'):
                try:
                    matches = re.findall(r'<img[^>]+src="([^">]+)"', entry.description)
                    current_entry_images.extend(matches)
                except:
                    pass
            
            # Add valid image URLs
            for img_url in current_entry_images:
                if img_url and isinstance(img_url, str) and img_url.startswith('http') and img_url not in image_urls_to_post: 
                    image_urls_to_post.append(img_url)

        image_urls_to_post = list(set(image_urls_to_post))[:10]
        print(f"Total unique images collected for post: {len(image_urls_to_post)}")

        raw_combined = "\n\n" + "="*50 + "\n\n".join(posts_for_ai) + "\n" + "="*50
        generated_keywords = extract_keywords(" ".join(all_text_for_keywords))

        prompt = (
            "قم بإنشاء منشور فيسبوك شامل ومفصل عن آخر أخبار ألعاب الفيديو والألعاب المستقلة. "
            "ابدأ مباشرة بالعنوان: 'أخبار الألعاب من GameSea' متبوعاً بخطاف قوي وجذاب. "
            "استخدم نبرة حماسية واحترافية تناسب مجتمع الألعاب باللغة العربية الفصحى. "
            "قم بتنسيق المنشور بفقرات واضحة ورموز تعبيرية استراتيجية لتحسين قابلية القراءة. "
            "لا تستخدم أي تنسيق مثل العريض أو المائل (** أو __). "
            "قدم معلومات كاملة عن كل خبر - لا تترك أي تفاصيل مهمة. "
            "احتفظ بأسماء الألعاب بلغتها الأصلية (الإنجليزية). "
            "قم بتضمين جميع الأخبار المقدمة، مع التأكد من تغطية كل منها بشكل مناسب. "
            "أنهِ المنشور بدعوة قوية للجمهور للإعجاب والمشاركة والتعليق بآرائهم. "
            "أضف دعوة للمتابعة: '📲 تابع الصفحة للحصول على آخر أخبار وتحديثات الألعاب يومياً!' "
            "اختم بـ 3-4 وسوم ذات صلة باللغتين العربية والإنجليزية بما في ذلك #GameSea. "
            "لا تدرج روابط في المنشور النهائي. "
            "يجب أن يكون النص باللغة العربية الفصحى مع الحفاظ على أسماء الألعاب بالإنجليزية. "
            "إليك الأخبار المفصلة:\n\n" + raw_combined +
            ("\n\nيمكنك النظر في هذه الكلمات المفتاحية للوسوم الإضافية: " +
            ", ".join(generated_keywords) if generated_keywords else "")
        )

        try:
            response = requests.post(
                "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
                params={"key": GEMINI},
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=30  # Increased timeout for more detailed processing
            )

            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and data["candidates"]:
                    ai_summary = data["candidates"][0]["content"]["parts"][0]["text"]
                    # Clean the text from any markdown formatting but preserve hashtags
                    cleaned_summary = clean_facebook_text(ai_summary)
                    fb_post(cleaned_summary, image_urls_to_post)
                    print("[Gemini Gaming News] Successfully generated and posted detailed content in Arabic.")
                    return
                else:
                    print(f"[Gemini Gaming News] ❌ No valid candidates found in Gemini response: {data}")
            else:
                print(f"[Gemini Gaming News Error] ❌ API Status {response.status_code}: {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"[Gemini Gaming News Exception] ❌ Network or API error during Gemini call: {e}")
        except json.JSONDecodeError:
            print(f"[Gemini Gaming News Exception] ❌ Could not decode JSON response from Gemini API.")
        except Exception as e:
            print(f"[Gemini Gaming News Exception] ❌ An unexpected error occurred with Gemini API: {e}")

    except Exception as e:
        print(f"[Gaming News Exception] ❌ An error occurred while processing gaming news: {e}")
    
    # Fallback if anything above fails (in Arabic)
    emoji_list = ["🎮", "🔥", "💻", "🏆", "🚨", "✨", "👾", "🎯"]
    clean_posts = []

    if entries:
        for i, entry in enumerate(entries[:5]):  # Show more entries in fallback
            if not is_recent_entry(entry):
                continue
                
            emoji = emoji_list[i % len(emoji_list)]
            title = getattr(entry, 'title', 'Latest Gaming Update').strip()
            summary = getattr(entry, 'summary', '')
            description = getattr(entry, 'description', summary)
            content = description if len(description) > len(summary) else summary
            content = content[:250].strip().replace('\n', ' ')
            
            if title and content:
                clean_posts.append(f"{emoji} {title}\n{content}")
            elif title:
                clean_posts.append(f"{emoji} {title}")
    
    if clean_posts:
        fallback_message = (
            "📰 أخبار الألعاب من GameSea\n\n" +
            "\n\n".join(clean_posts) +
            "\n\nما رأيك في هذه الأخبار؟ شاركنا رأيك في التعليقات! 👇\n\n"
            "📲 تابع الصفحة للحصول على آخر أخبار وتحديثات الألعاب يومياً!\n\n"
        )
    else:
        fallback_message = (
            "📰 أخبار الألعاب من GameSea\n\n"
            "لا توجد أخبار ألعاب رئيسية للإبلاغ عنها حالياً! "
            "ما هي آخر لعبة لعبتها؟ شاركنا تجربتك! 👇\n\n"
            "📲 تابع الصفحة للحصول على آخر أخبار وتحديثات الألعاب يومياً!\n\n"
        )

    # Add hashtags properly
    fallback_hashtags = "#أخبار_الألعاب #ألعاب_فيديو #ألعاب_إندي #GameSea"
    if generated_keywords:
        fallback_hashtags += " " + " ".join(generated_keywords)
        # Remove any duplicates
        fallback_hashtags = " ".join(sorted(list(set(fallback_hashtags.split())))[:8])

    # Clean the fallback message from any markdown but preserve hashtags
    cleaned_fallback = clean_facebook_text(fallback_message)
    fb_post(f"{cleaned_fallback}{fallback_hashtags}", image_urls_to_post if image_urls_to_post else None)

if __name__ == '__main__':
    post_gaming_news()