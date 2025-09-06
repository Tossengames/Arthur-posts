#!/usr/bin/env python3
"""
Freelance Finance Coach: Generate VARIED content for freelancers on finance, taxes, green investing, and budgeting.
Creates images with text overlay and posts to Facebook Page.
"""

import os
import requests
import random
import textwrap
import json
import hashlib
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from io import BytesIO
import time
from urllib.parse import quote_plus

# Try the new Google GenAI SDK import first
try:
    from google import genai
    print("✅ Using new Google GenAI SDK")
    SDK_TYPE = "new"
except ImportError:
    try:
        # Fallback to old import style
        import google.generativeai as genai
        print("✅ Using old Google Generative AI SDK")
        SDK_TYPE = "old"
    except ImportError as e:
        print(f"❌ Failed to import Google AI libraries: {e}")
        print("💡 Please install the required package:")
        print("   pip install google-genai  # For new SDK")
        print("   or")
        print("   pip install google-generativeai  # For old SDK")
        exit(1)

# Try to import googlesearch for real web searches
try:
    from googlesearch import search as google_search
    GOOGLE_SEARCH_AVAILABLE = True
    print("✅ Using googlesearch-python for web searches")
except ImportError:
    GOOGLE_SEARCH_AVAILABLE = False
    print("❌ googlesearch-python not available")

# File to store posted tips for duplication check - using absolute path
POST_HISTORY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "posted_quotes.json")

def load_posted_tips():
    """Load history of posted tips to avoid duplicates"""
    try:
        print(f"Looking for history file at: {POST_HISTORY_FILE}")
        if os.path.exists(POST_HISTORY_FILE):
            with open(POST_HISTORY_FILE, 'r') as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
                else:
                    return []
        return []
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading history file: {e}")
        return []

def save_posted_tip(tip_text):
    """Save a posted tip to history using its main text"""
    try:
        posted_tips = load_posted_tips()
        
        # Create a unique hash of the main tip text to identify duplicates
        tip_hash = hashlib.md5(tip_text.encode()).hexdigest()
        
        # Add to history if not already there
        if tip_hash not in posted_tips:
            posted_tips.append(tip_hash)
            # Ensure directory exists
            os.makedirs(os.path.dirname(POST_HISTORY_FILE), exist_ok=True)
            with open(POST_HISTORY_FILE, 'w') as f:
                json.dump(posted_tips, f)
            print(f"✅ Saved tip to history: {tip_text[:50]}...")
            return True
        else:
            print(f"❌ Tip already exists in history: {tip_text[:50]}...")
            return False
    except Exception as e:
        print(f"❌ Error saving to history: {e}")
        return False

def is_duplicate_tip(tip_text):
    """Check if a tip has already been posted"""
    try:
        posted_tips = load_posted_tips()
        tip_hash = hashlib.md5(tip_text.encode()).hexdigest()
        is_dup = tip_hash in posted_tips
        if is_dup:
            print(f"❌ Duplicate detected: {tip_text[:50]}...")
        else:
            print(f"✅ New tip: {tip_text[:50]}...")
        return is_dup
    except Exception as e:
        print(f"❌ Error checking duplicate: {e}")
        return False

def get_google_trends():
    """Get trending topics using reliable fallback method - EXPANDED TOPICS"""
    try:
        # Use a more reliable approach for trend discovery - EXPANDED FOR FINANCE + GREEN TOPICS
        trending_keywords = [
            "freelancer taxes 2024", "gig economy finance", "variable income budgeting", 
            "quarterly taxes", "freelance retirement", "1099 income",
            "ESG investing", "sustainable personal finance", "green loans",
            "ethical banking", "carbon footprint money", "basic budgeting",
            "credit score tips", "compound interest", "saving for beginners",
            "debt payoff strategies", "financial literacy", "crypto taxes freelancer"
        ]
        
        all_trends = []
        for keyword in trending_keywords:
            try:
                print(f"🔍 Searching for trends: {keyword}")
                
                # Perform Google search with correct parameters
                results = list(google_search(
                    keyword, 
                    num_results=5,
                    pause=2.0,
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                ))
                
                # Extract potential trends from URLs
                for url in results:
                    if any(x in url for x in ['trend', 'news', 'blog', 'article', 'report']):
                        # Extract meaningful words from URL
                        url_parts = url.split('/')
                        for part in url_parts:
                            if len(part) > 3 and '-' in part and any(c.isalpha() for c in part):
                                words = part.split('-')
                                for word in words:
                                    if (len(word) > 4 and word.isalpha() and 
                                        word.lower() not in ['https', 'www', 'com', 'org', 'net', 'html', 'php']):
                                        all_trends.append(word)
                
                time.sleep(1)  # Be polite with requests
                
            except Exception as e:
                print(f"❌ Error searching for {keyword}: {e}")
                continue
        
        # Filter and return unique trends
        unique_trends = list(set([t for t in all_trends if 3 < len(t) < 20]))
        if unique_trends:
            print(f"✅ Found {len(unique_trends)} potential trends")
            return unique_trends[:10]
        
        return get_fallback_trends()
            
    except Exception as e:
        print(f"❌ Error fetching trends: {e}")
        return get_fallback_trends()

def get_fallback_trends():
    """Get reliable fallback trending topics - EXPANDED FOR FINANCE + GREEN TOPICS"""
    fallback_trends = [
        # Freelance Finance
        "quarterly taxes", "variable income", "freelance budget", "1099 form",
        "self employed", "tax deductions", "emergency fund", "retirement planning",
        "invoicing clients", "contract work", "gig economy", "freelance rates",
        "cash flow", "business expenses", "tax savings", "Solo 401k", "SEP IRA",
        "estimated taxes", "financial planning", "freelance finance",
        # Basic Personal Finance
        "budgeting basics", "credit score", "saving money", "compound interest",
        "debt free", "financial freedom", "money management", "personal finance",
        "investment basics", "rainy day fund", "financial goals", "smart spending",
        # Green Finance
        "ESG investing", "sustainable investing", "green banking", "ethical finance",
        "climate friendly investing", "socially responsible", "green loans",
        "carbon neutral", "impact investing", "renewable energy stocks"
    ]
    selected = random.sample(fallback_trends, min(8, len(fallback_trends)))
    print(f"✅ Using fallback trends: {selected}")
    return selected

def search_web_content(topic):
    """Perform real web search for the topic using Google Search"""
    try:
        if not GOOGLE_SEARCH_AVAILABLE:
            print("❌ Google search not available, using fallback content")
            return f"Financial experts are discussing {topic} as an important topic for freelancers and individuals managing their money."
        
        print(f"🔍 Performing real web search for: {topic}")
        
        # Perform Google search with correct parameters
        search_query = f"{topic} finance money tips 2024"
        results = list(google_search(
            search_query, 
            num_results=3,
            pause=2.0,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        ))
        
        # Create meaningful content from search results
        content_parts = []
        content_parts.append(f"Recent discussions show that {topic} is a relevant topic right now.")
        
        if results:
            content_parts.append("Financial sources indicate several important points:")
            content_parts.append(f"- {topic} is gaining attention among finance professionals")
            content_parts.append(f"- This topic connects to broader financial trends and personal money management")
            
            # Mention that we found relevant sources
            domain_count = len(set(url.split('/')[2] for url in results if len(url.split('/')) > 2))
            content_parts.append(f"Based on analysis of {domain_count} sources, this is a valuable area for financial education.")
        else:
            content_parts.append("This financial concept is gaining attention across financial communities and discussions.")
        
        content_parts.append("Financial advisors and coaches are discussing the importance of this topic.")
        
        return " ".join(content_parts)
        
    except Exception as e:
        print(f"❌ Error in web search: {e}")
        return f"Recent discussions about {topic} indicate it's a significant financial topic. Experts are highlighting its importance for money management and financial health."

def generate_finance_post():
    """Generate a VARIED finance post using Gemini. No rigid templates."""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Get real trending topics
            trends = get_google_trends()
            selected_trend = random.choice(trends) if trends else "financial wellness"
            
            # Perform real web search about this trend
            web_content = search_web_content(selected_trend)
            print(f"🎯 Selected trend: {selected_trend}")
            print(f"🔍 Web context: {web_content[:100]}...")
            
            # Initialize client based on available SDK
            if SDK_TYPE == "new":
                client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
            else:
                genai.configure(api_key=os.environ["GEMINI_API_KEY"])
            
            # REVOLUTIONIZED PROMPT: No templates, just creative guidance
            prompt = f"""
            ACT AS: A knowledgeable and engaging finance professional with expertise in freelance finance, personal finance, and sustainable/green investing. You are creating content for your social media followers who want practical, actionable advice.

            TOPIC/TREND: "{selected_trend}"
            CONTEXT: "{web_content}"

            TASK: Create exactly ONE complete social media post about this topic. DO NOT USE A RIGID TEMPLATE. Be creative and varied in your approach.

            **CRITICAL REQUIREMENTS:**
            1. **VARY YOUR STYLE:** Mix up your formats. Examples:
               - "Did you know...?" (fact-based)
               - "Here's a simple trick..." (actionable tip)
               - "Myth vs. Fact: ..." (debunking misconceptions)
               - "Question for you: ..." (engagement-focused)
               - "The one thing I wish everyone knew about..." (personal insight)
               - "3 ways to..." (list-based)

            2. **INCLUDE THESE ELEMENTS NATURALLY:**
               - A compelling main point or tip (keep it concise)
               - A brief explanation or why it matters
               - A Call-To-Action (CTA) that feels organic, not generic. Ask for a like, share, or follow in a creative way.
               - A question to prompt comments and engagement. Make it specific to the post.
               - 5-7 relevant and specific hashtags. Include #FreelanceFinance and others that fit the topic.

            3. **TOPIC AREAS TO DRAW FROM:**
               - Freelancer-specific issues (taxes, variable income, contracts)
               - Basic personal finance (budgeting, saving, debt, credit)
               - Green/sustainable finance (ESG investing, ethical banking, green loans)

            **IMPORTANT:** Write in a natural, conversational social media style. Do not use markdown. Do not label sections like "MAIN TIP" or "EXPLANATION". Just write the complete post as you would naturally post it.

            Example output style (just one example of many possible styles):
            "Did you know you can often deduct a portion of your home internet bill as a business expense if you're a freelancer? 📊 This is one of those overlooked deductions that can save you money at tax time. 

            What's your most unexpected freelance tax deduction? Share below! 👇

            👍 Like if you found this helpful and follow for more freelance finance tips!

            #FreelanceTaxes #TaxDeductions #FreelanceFinance #MoneyTips #SideHustle"

            Now create your post about {selected_trend}:
            """
            
            # Generate content based on available SDK
            if SDK_TYPE == "new":
                response = client.models.generate_content(
                    model='gemini-2.0-flash',
                    contents=prompt,
                )
                response_text = response.text
            else:
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content(prompt)
                response_text = response.text
            
            response_text = response_text.strip()
            print(f"Gemini response:\n{response_text}")
            
            # Extract the first line to use for duplicate checking and image text
            first_line = response_text.split('\n')[0].strip()
            
            # Check if this is a duplicate before returning
            if is_duplicate_tip(first_line):
                print(f"🔄 Generated post is a duplicate, trying again... (Attempt {retry_count + 1}/{max_retries})")
                retry_count += 1
                continue
            
            # Return the full post and the first line for the image
            return {
                'full_post': response_text,
                'image_text': first_line
            }
            
        except Exception as e:
            print(f"❌ Error generating finance post: {e}")
            retry_count += 1
            if retry_count >= max_retries:
                break
            time.sleep(2)  # Wait before retrying
    
    # Fallback if all retries fail
    print("🔄 Using fallback after Gemini failures...")
    fallback_posts = [
        "Just a reminder: pay your quarterly taxes if you're a freelancer! It's not fun, but avoiding penalties is even better. 💸 What's your strategy for setting aside tax money? #FreelanceFinance #Taxes #Adulting",
        "Compound interest is literally free money. The sooner you start saving, the less you actually have to save. Mind-blowing, right? 🤯 What's your favorite 'money magic' fact? #PersonalFinance #Investing #CompoundInterest",
        "Green investing isn't just good for the planet—it's becoming really good for returns too. 🌱 Have you looked into ESG funds? What's been your experience? #SustainableInvesting #GreenFinance #ESG"
    ]
    
    # Filter out duplicates from fallback posts
    non_duplicate_posts = [
        p for p in fallback_posts 
        if not is_duplicate_tip(p.split('\n')[0])
    ]
    
    if non_duplicate_posts:
        chosen_post = random.choice(non_duplicate_posts)
        return {
            'full_post': chosen_post,
            'image_text': chosen_post.split('\n')[0]
        }
    else:
        # If all fallbacks are duplicates, return a random one anyway
        print("⚠️ All fallback posts are duplicates, using random one")
        chosen_post = random.choice(fallback_posts)
        return {
            'full_post': chosen_post,
            'image_text': chosen_post.split('\n')[0]
        }

def get_pixabay_image():
    """Get a random image from Pixabay API - EXPANDED CATEGORIES"""
    try:
        api_key = os.environ.get("PIXABAY_KEY")
        if not api_key:
            print("❌ PIXABAY_KEY not found in environment variables")
            return None
            
        # EXPANDED CATEGORIES FOR FINANCE + GREEN THEMES
        categories = ["home office", "laptop", "money", "calculator", "finance", 
                     "freelance", "workspace", "tax", "budget", "entrepreneur",
                     "nature", "renewable energy", "sustainability", "earth", "green",
                     "savings", "investment", "growth", "planning", "success"]
        category = random.choice(categories)
        
        print(f"🌄 Searching Pixabay for: {category}")
        
        url = "https://pixabay.com/api/"
        params = {
            "key": api_key,
            "q": category,
            "image_type": "photo",
            "orientation": "horizontal",
            "per_page": 20,
            "safesearch": "true",
            "editors_choice": "true"
        }
        
        response = requests.get(url, params=params, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            if data['hits']:
                # Select a random image from the results
                image_data = random.choice(data['hits'])
                image_url = image_data["largeImageURL"]
                
                print(f"✅ Found Pixabay image: {image_url}")
                
                # Download the image
                img_response = requests.get(image_url, timeout=15)
                return BytesIO(img_response.content)
            else:
                print(f"❌ No images found for category: {category}")
                return None
        else:
            print(f"❌ Pixabay API error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error fetching image from Pixabay: {e}")
        return None

def create_finance_image(image_text):
    """Create finance-themed image with Pixabay background and text overlay"""
    width, height = 1200, 1200
    
    # Try to get a Pixabay image first
    image_bytes = get_pixabay_image()
    
    if image_bytes:
        try:
            # Open and process the Pixabay image
            background = Image.open(image_bytes)
            background = background.resize((width, height), Image.LANCZOS)
            
            # Apply a slight darkening filter for better text readability
            enhancer = ImageEnhance.Brightness(background)
            background = enhancer.enhance(0.7)  # Darken slightly
            
            print("✅ Using Pixabay background image")
            
        except Exception as e:
            print(f"❌ Error processing Pixabay image: {e}")
            # Fallback to solid color background
            professional_colors = [
                '#1a4b8c', '#2c5aa0', '#3d69b4', '#4f78c8', '#6187dc',
                '#2d6a4f', '#3e7c61', '#4f8e73', '#60a085', '#71b297',
                '#495057', '#5c636a', '#6f777e', '#828a91', '#959da4'
            ]
            bg_color = random.choice(professional_colors)
            background = Image.new('RGB', (width, height), color=bg_color)
            print("✅ Using fallback solid color background")
    else:
        # Fallback to solid color background
        professional_colors = [
            '#1a4b8c', '#2c5aa0', '#3d69b4', '#4f78c8', '#6187dc',
            '#2d6a4f', '#3e7c61', '#4f8e73', '#60a085', '#71b297',
            '#495057', '#5c636a', '#6f777e', '#828a91', '#959da4'
        ]
        bg_color = random.choice(professional_colors)
        background = Image.new('RGB', (width, height), color=bg_color)
        print("✅ Using fallback solid color background")
    
    # Create drawing context
    draw = ImageDraw.Draw(background)
    
    # Try to load font
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        tip_font = ImageFont.truetype(font_path, 62)
    except (IOError, OSError):
        try:
            tip_font = ImageFont.truetype("arial.ttf", 62)
        except (IOError, OSError):
            tip_font = ImageFont.load_default()
    
    # Wrap the main tip text
    max_chars_per_line = 22
    wrapped_tip = textwrap.fill(image_text, width=max_chars_per_line)
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), wrapped_tip, font=tip_font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Generate random background color for text box 
    random_bg_color = (
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255),
        180  # Alpha value for transparency
    )
    
    # Add semi-transparent background with random color for better readability
    padding = 40
    draw.rectangle([
        x - padding, y - padding,
        x + text_width + padding, y + text_height + padding
    ], fill=random_bg_color)
    
    # Draw main tip text
    draw.text((x, y), wrapped_tip, fill=(255, 255, 255), font=tip_font, align='center')
    
    # Convert to bytes
    output_buffer = BytesIO()
    background.save(output_buffer, format="JPEG", quality=95)
    return output_buffer.getvalue()

def post_to_facebook(image_data, post_data):
    """Post the image to Facebook Page with the AI-generated caption"""
    try:
        page_id = os.environ.get("FB_PAGE_ID")
        access_token = os.environ.get("FB_PAGE_TOKEN")
        
        if not page_id or not access_token:
            print("❌ Facebook credentials not found in environment variables")
            return False
        
        # Upload image to Facebook
        url = f"https://graph.facebook.com/v19.0/{page_id}/photos"
        
        # Use the AI-generated full post as the caption
        caption = post_data['full_post']
        
        files = {'source': ('finance_tip.jpg', image_data, 'image/jpeg')}
        data = {'message': caption, 'access_token': access_token}
        
        response = requests.post(url, files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            # Save to posted tips history to prevent duplicates (using first line)
            if save_posted_tip(post_data['image_text']):
                print(f"✅ Successfully posted to Facebook! Post ID: {result.get('id')}")
            else:
                print(f"⚠️ Posted to Facebook but failed to save to history: {result.get('id')}")
            return True
        else:
            print(f"❌ Facebook API error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error posting to Facebook: {e}")
        return False

def main():
    """Main function to run the entire process"""
    print("🚀 Starting freelance finance content generation and posting process...")
    print(f"📁 History file location: {POST_HISTORY_FILE}")
    
    # Check environment variables
    required_env_vars = ["GEMINI_API_KEY", "PIXABAY_KEY", "FB_PAGE_ID", "FB_PAGE_TOKEN"]
    missing_vars = [var for var in required_env_vars if not os.environ.get(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("💡 Please add missing variables to your GitHub Secrets")
        return
    
    # Load existing history to check functionality
    posted_tips = load_posted_tips()
    print(f"📊 Existing tips in history: {len(posted_tips)}")
    
    # Generate a varied finance post
    post_data = generate_finance_post()
    print("🎯 Generated finance post")
    print(f"📝 Full Post:\n{post_data['full_post']}")
    
    # Create image with the first line of the post
    final_image = create_finance_image(post_data['image_text'])
    print("🎨 Finance image created")
    
    # Post to Facebook
    success = post_to_facebook(final_image, post_data)
    
    if success:
        print("✅ Process completed successfully! The finance post has been shared.")
    else:
        print("❌ Process completed with errors")

if __name__ == "__main__":
    main()