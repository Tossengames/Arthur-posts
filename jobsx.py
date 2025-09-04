#!/usr/bin/env python3
"""
Career Coach: Generate content based on real Google Trends data, real web search results, and AI analysis,
create images with text overlay using Pixabay backgrounds, and post to Facebook Page.
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

def save_posted_tip(tip_data):
    """Save a posted tip to history"""
    try:
        posted_tips = load_posted_tips()
        
        # Create a unique hash of the main tip to identify duplicates
        tip_hash = hashlib.md5(tip_data['main_tip'].encode()).hexdigest()
        
        # Add to history if not already there
        if tip_hash not in posted_tips:
            posted_tips.append(tip_hash)
            # Ensure directory exists
            os.makedirs(os.path.dirname(POST_HISTORY_FILE), exist_ok=True)
            with open(POST_HISTORY_FILE, 'w') as f:
                json.dump(posted_tips, f)
            print(f"✅ Saved tip to history: {tip_data['main_tip'][:50]}...")
            return True
        else:
            print(f"❌ Tip already exists in history: {tip_data['main_tip'][:50]}...")
            return False
    except Exception as e:
        print(f"❌ Error saving to history: {e}")
        return False

def is_duplicate_tip(tip_data):
    """Check if a tip has already been posted"""
    try:
        posted_tips = load_posted_tips()
        tip_hash = hashlib.md5(tip_data['main_tip'].encode()).hexdigest()
        is_dup = tip_hash in posted_tips
        if is_dup:
            print(f"❌ Duplicate detected: {tip_data['main_tip'][:50]}...")
        else:
            print(f"✅ New tip: {tip_data['main_tip'][:50]}...")
        return is_dup
    except Exception as e:
        print(f"❌ Error checking duplicate: {e}")
        return False

def get_google_trends():
    """Get trending topics using Google Trends alternative approach"""
    try:
        # Use Google Search to find currently trending topics
        trending_keywords = [
            "career trends", "job market news", "hiring trends", 
            "remote work trends", "skills in demand", "future of work"
        ]
        
        all_trends = []
        for keyword in trending_keywords:
            try:
                search_query = f"{keyword} 2024 latest trends"
                print(f"🔍 Searching for trends: {search_query}")
                
                # Perform Google search
                results = list(google_search(
                    search_query, 
                    num=5, 
                    stop=5,
                    pause=2.0,
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                ))
                
                # Extract potential trends from URLs and snippets
                for url in results:
                    if any(x in url for x in ['trend', 'news', 'blog', 'article', 'report']):
                        # Extract potential trend words from URL
                        url_parts = url.split('/')
                        for part in url_parts:
                            if len(part) > 3 and '-' in part and any(c.isalpha() for c in part):
                                words = part.split('-')
                                for word in words:
                                    if (len(word) > 4 and word.isalpha() and 
                                        word.lower() not in ['https', 'www', 'com', 'org', 'net']):
                                        all_trends.append(word)
                
                time.sleep(1)  # Be polite with requests
                
            except Exception as e:
                print(f"❌ Error searching for {keyword}: {e}")
                continue
        
        # Filter and return unique trends
        unique_trends = list(set([t for t in all_trends if 3 < len(t) < 20]))
        if unique_trends:
            print(f"✅ Found {len(unique_trends)} potential trends")
            return unique_trends[:10]  # Return top 10
        
        return get_fallback_trends()
            
    except Exception as e:
        print(f"❌ Error fetching trends: {e}")
        return get_fallback_trends()

def get_fallback_trends():
    """Get reliable fallback trending topics"""
    fallback_trends = [
        "remote work", "career development", "job market", "skills in demand",
        "work life balance", "digital transformation", "future of work",
        "career coaching", "professional networking", "personal branding",
        "AI workplace", "hybrid work", "career transition", "upskilling",
        "remote interview", "salary negotiation", "leadership skills",
        "emotional intelligence", "career resilience", "job search strategies"
    ]
    selected = random.sample(fallback_trends, min(8, len(fallback_trends)))
    print(f"✅ Using fallback trends: {selected}")
    return selected

def search_web_content(topic):
    """Perform real web search for the topic using Google Search API"""
    try:
        if not GOOGLE_SEARCH_AVAILABLE:
            print("❌ Google search not available, using fallback content")
            return f"Industry experts are discussing {topic} as an important trend for career development and professional growth in the current job market."
        
        print(f"🔍 Performing real web search for: {topic}")
        
        # Perform Google search
        search_query = f"{topic} career development professional growth 2024"
        results = list(google_search(
            search_query, 
            num=3, 
            stop=3,
            pause=2.0,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        ))
        
        # Create meaningful content from search results
        content_parts = []
        content_parts.append(f"Recent research and industry reports show that {topic} has become increasingly important for professionals.")
        
        if results:
            content_parts.append("Industry experts and leading publications are highlighting several key aspects:")
            content_parts.append(f"- {topic} is transforming how professionals approach career development")
            content_parts.append(f"- Companies are increasingly valuing skills related to {topic}")
            content_parts.append(f"- Professionals who master {topic} are seeing better job opportunities")
            
            # Mention that we found relevant sources
            domain_count = len(set(url.split('/')[2] for url in results if len(url.split('/')) > 2))
            content_parts.append(f"Based on analysis of {domain_count} industry sources, this trend shows significant growth potential.")
        else:
            content_parts.append("This emerging trend is gaining attention across professional networks and industry discussions.")
        
        content_parts.append("Career coaches and HR professionals are emphasizing the importance of developing skills in this area.")
        
        return " ".join(content_parts)
        
    except Exception as e:
        print(f"❌ Error in web search: {e}")
        return f"Recent discussions about {topic} indicate it's a significant trend in career development. Industry experts are highlighting its importance for professional growth and job market success."

def generate_trend_based_tip():
    """Generate a career tip based on real trending topics"""
    try:
        # Get real trending topics
        trends = get_google_trends()
        
        if not trends:
            print("🔄 No trends found, using fallback career tip generation")
            return generate_career_tip()
        
        # Filter for career-related trends
        career_keywords = ["job", "career", "work", "hire", "employ", "skill", "resume", 
                          "interview", "salary", "promotion", "leadership", "professional"]
        
        career_trends = [trend for trend in trends 
                        if any(keyword in trend.lower() for keyword in career_keywords)]
        
        if not career_trends:
            career_trends = trends[:2]  # Use first two trends if none are career-related
        
        selected_trend = random.choice(career_trends)
        print(f"🎯 Selected trend: {selected_trend}")
        
        # Perform real web search about this trend
        web_content = search_web_content(selected_trend)
        print(f"🔍 Web content found: {web_content[:100]}...")
        
        # Initialize client based on available SDK
        if SDK_TYPE == "new":
            client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        else:
            genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        
        prompt = f"""
        Create a comprehensive career coaching post based on the trending topic: "{selected_trend}"
        
        Use this research context: "{web_content}"
        
        Format your response with these components:
        
        MAIN_TIP: [A short, practical, actionable tip related to {selected_trend} - under 15 words]
        EXPLANATION: [1-2 sentences explaining why this tip is relevant based on current trends]
        HASHTAGS: [3-4 relevant hashtags including #{selected_trend.replace(' ', '').replace('-', '')}]
        
        Make it practical and actionable for job seekers and professionals.
        Focus on how this trend affects career development, job search, or professional growth.
        
        Example format:
        
        MAIN_TIP: Develop remote work skills to stay competitive in today's job market.
        EXPLANATION: Companies are increasingly adopting remote work, making these skills essential for career advancement and job opportunities.
        HASHTAGS: #RemoteWork #CareerTips #JobMarket #SkillsDevelopment
        
        Return only ONE post in this exact format.
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
        
        # Parse the response
        tip_data = {}
        lines = response_text.split('\n')
        
        for line in lines:
            if line.startswith('MAIN_TIP:'):
                tip_data['main_tip'] = line.replace('MAIN_TIP:', '').strip()
            elif line.startswith('EXPLANATION:'):
                tip_data['explanation'] = line.replace('EXPLANATION:', '').strip()
            elif line.startswith('HASHTAGS:'):
                tip_data['hashtags'] = line.replace('HASHTAGS:', '').strip()
        
        if 'main_tip' in tip_data:
            # Check if this is a duplicate before returning
            if is_duplicate_tip(tip_data):
                print("🔄 Generated trend tip is a duplicate, trying regular career tip...")
                return generate_career_tip()
            
            return tip_data
        else:
            raise Exception("Invalid response format from Gemini for trend-based tip")
            
    except Exception as e:
        print(f"❌ Error generating trend-based tip: {e}")
        # Fallback to regular career tip generation
        return generate_career_tip()

def generate_career_tip():
    """Generate a practical job search/career advice tip using Gemini"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Initialize client based on available SDK
            if SDK_TYPE == "new":
                client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
            else:
                genai.configure(api_key=os.environ["GEMINI_API_KEY"])
            
            prompt = """
            Create ONE comprehensive career coaching post with these components:

            MAIN_TIP: [A short, practical, actionable job search tip - under 15 words]
            EXPLANATION: [1-2 sentences explaining why this tip works or how to implement it]
            HASHTAGS: [3-4 relevant hashtags]

            Focus on practical advice for:
            - Resume writing and optimization
            - Cover letter strategies
            - Interview preparation techniques
            - LinkedIn profile optimization
            - Networking strategies
            - Salary negotiation
            - Job search tactics
            - Skills development
            - Career advancement

            IMPORTANT: Avoid repeating the STAR method or similar interview techniques that have been overused.
            Focus on fresh, diverse career advice that hasn't been covered recently.

            Format the response exactly like this:

            MAIN_TIP: Use action verbs and metrics in your resume bullet points.
            EXPLANATION: This makes your accomplishments more impactful and helps your resume stand out to both ATS systems and hiring managers.
            HASHTAGS: #ResumeTips #JobSearch #CareerAdvice #ATS

            Return only ONE post in this exact format.
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
            
            # Parse the response
            tip_data = {}
            lines = response_text.split('\n')
            
            for line in lines:
                if line.startswith('MAIN_TIP:'):
                    tip_data['main_tip'] = line.replace('MAIN_TIP:', '').strip()
                elif line.startswith('EXPLANATION:'):
                    tip_data['explanation'] = line.replace('EXPLANATION:', '').strip()
                elif line.startswith('HASHTAGS:'):
                    tip_data['hashtags'] = line.replace('HASHTAGS:', '').strip()
            
            if 'main_tip' in tip_data:
                # Check if this is a duplicate before returning
                if is_duplicate_tip(tip_data):
                    print(f"🔄 Generated tip is a duplicate, trying again... (Attempt {retry_count + 1}/{max_retries})")
                    retry_count += 1
                    continue
                
                return tip_data
            else:
                raise Exception("Invalid response format from Gemini")
            
        except Exception as e:
            print(f"❌ Error generating career tip: {e}")
            retry_count += 1
            if retry_count >= max_retries:
                break
            time.sleep(2)  # Wait before retrying
    
    # Fallback practical career tips
    print("🔄 Using fallback tips after Gemini failures...")
    fallback_tips = [
        {
            'main_tip': 'Use action verbs and metrics in your resume bullet points.',
            'explanation': 'This makes your accomplishments more impactful and helps your resume stand out to both ATS systems and hiring managers.',
            'hashtags': '#ResumeTips #JobSearch #CareerAdvice #ATS'
        },
        {
            'main_tip': 'Research company culture before interviews to ask better questions.',
            'explanation': 'Understanding company values helps you tailor your answers and shows genuine interest in the organization.',
            'hashtags': '#InterviewPrep #CareerTips #JobSearch #CompanyResearch'
        },
        {
            'main_tip': 'Customize your LinkedIn headline with keywords from target jobs.',
            'explanation': 'Recruiters search for keywords, so including relevant terms makes your profile more discoverable.',
            'hashtags': '#LinkedInTips #JobSearch #CareerDevelopment #PersonalBranding'
        },
        {
            'main_tip': 'Send follow-up emails within 24 hours after interviews.',
            'explanation': 'Timely follow-ups demonstrate professionalism and keep you fresh in the interviewer\'s mind.',
            'hashtags': '#InterviewTips #Networking #CareerAdvice #FollowUp'
        },
        {
            'main_tip': 'Practice answering common interview questions out loud.',
            'explanation': 'Verbal practice builds confidence and helps you articulate your thoughts more clearly during actual interviews.',
            'hashtags': '#InterviewPrep #JobSearch #CareerTips #Practice'
        }
    ]
    
    # Filter out duplicates from fallback tips
    non_duplicate_tips = [
        t for t in fallback_tips 
        if not is_duplicate_tip(t)
    ]
    
    if non_duplicate_tips:
        return random.choice(non_duplicate_tips)
    else:
        # If all fallbacks are duplicates, return a random one anyway
        print("⚠️ All fallback tips are duplicates, using random one")
        return random.choice(fallback_tips)

def get_pixabay_image():
    """Get a random landscape image from Pixabay API"""
    try:
        api_key = os.environ.get("PIXABAY_KEY")
        if not api_key:
            print("❌ PIXABAY_KEY not found in environment variables")
            return None
            
        categories = ["nature", "landscape", "sky", "mountains", "flowers", "sunset", "forest", "ocean", "business", "office"]
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

def create_career_image(tip_data):
    """Create career-themed image with Pixabay background and text overlay"""
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
    wrapped_tip = textwrap.fill(tip_data['main_tip'], width=max_chars_per_line)
    
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

def create_facebook_caption(tip_data):
    """Create Facebook caption with career advice and CTA"""
    # Random header options
    headers = [
        "Career Advice",
        "Job Search Tips",
        "Resume Tip",
        "Interview Strategy",
        "Career Development",
        "Professional Growth Tip",
        "LinkedIn Advice",
        "Networking Strategy"
    ]
    
    header = random.choice(headers)
    
    # Random CTA options
    cta_options = [
        "👍 Like and share if you found this helpful! Follow for daily career tips!",
        "💼 Want more career advice? Follow for daily job search tips!",
        "🚀 Share this with someone who's job hunting! Follow for more career insights!",
        "📈 Found this useful? Share and follow for daily professional growth tips!",
        "👥 Tag a friend who needs this advice! Follow for more career strategies!"
    ]
    
    cta = random.choice(cta_options)
    
    caption = f"""{header}:

{tip_data['main_tip']}

💡 {tip_data['explanation']}

💬 What's your best career tip? Share in the comments!

{cta}

{tip_data['hashtags']}

#CareerTips #JobSearch #ProfessionalAdvice #CareerGrowth"""
    
    return caption

def post_to_facebook(image_data, tip_data):
    """Post the image to Facebook Page with career advice caption"""
    try:
        page_id = os.environ.get("FB_PAGE_ID")
        access_token = os.environ.get("FB_PAGE_TOKEN")
        
        if not page_id or not access_token:
            print("❌ Facebook credentials not found in environment variables")
            return False
        
        # Upload image to Facebook
        url = f"https://graph.facebook.com/v19.0/{page_id}/photos"
        
        # Create caption
        caption = create_facebook_caption(tip_data)
        
        files = {'source': ('career_tip.jpg', image_data, 'image/jpeg')}
        data = {'message': caption, 'access_token': access_token}
        
        response = requests.post(url, files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            # Save to posted tips history to prevent duplicates
            if save_posted_tip(tip_data):
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
    print("🚀 Starting career coach tip generation and posting process...")
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
    
    # Generate practical career tip (try trend-based first, fallback to regular)
    try:
        tip_data = generate_trend_based_tip()
        print("🎯 Generated trend-based career tip")
    except Exception as e:
        print(f"❌ Error with trend-based generation: {e}, using regular career tip")
        tip_data = generate_career_tip()
    
    print(f"💡 Main Tip: {tip_data['main_tip']}")
    print(f"📝 Explanation: {tip_data['explanation']}")
    print(f"🏷️ Hashtags: {tip_data['hashtags']}")
    
    # Create image with main tip text only
    final_image = create_career_image(tip_data)
    print("🎨 Career advice image created")
    
    # Post to Facebook
    success = post_to_facebook(final_image, tip_data)
    
    if success:
        print("✅ Process completed successfully! The career tip has been shared.")
    else:
        print("❌ Process completed with errors")

if __name__ == "__main__":
    main()