#!/usr/bin/env python3
"""
Tenchu Series Content Generator: Generate content about Tenchu games - characters, weapons, stages, music, and lore.
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

# File to store posted tips for duplication check - using absolute path
POST_HISTORY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "posted_tenchu_content.json")

def load_posted_tips():
    """Load history of posted content to avoid duplicates"""
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
    """Save a posted content to history using its main text"""
    try:
        posted_tips = load_posted_tips()
        
        # Create a unique hash of the main content text to identify duplicates
        tip_hash = hashlib.md5(tip_text.encode()).hexdigest()
        
        # Add to history if not already there
        if tip_hash not in posted_tips:
            posted_tips.append(tip_hash)
            # Ensure directory exists
            os.makedirs(os.path.dirname(POST_HISTORY_FILE), exist_ok=True)
            with open(POST_HISTORY_FILE, 'w') as f:
                json.dump(posted_tips, f)
            print(f"✅ Saved content to history: {tip_text[:50]}...")
            return True
        else:
            print(f"❌ Content already exists in history: {tip_text[:50]}...")
            return False
    except Exception as e:
        print(f"❌ Error saving to history: {e}")
        return False

def is_duplicate_tip(tip_text):
    """Check if content has already been posted"""
    try:
        posted_tips = load_posted_tips()
        tip_hash = hashlib.md5(tip_text.encode()).hexdigest()
        is_dup = tip_hash in posted_tips
        if is_dup:
            print(f"❌ Duplicate detected: {tip_text[:50]}...")
        else:
            print(f"✅ New content: {tip_text[:50]}...")
        return is_dup
    except Exception as e:
        print(f"❌ Error checking duplicate: {e}")
        return False

def get_tenchu_topics():
    """Get Tenchu-specific topics for content generation"""
    tenchu_topics = [
        # Characters
        "Rikimaru", "Ayame", "Tatsumaru", "Tesshu", "Onikage", "Lord Gohda",
        "Princess Kiku", "Princess Rin", "Lady Kagami", "Master Shiunsai",
        
        # Weapons & Tools
        "Izayoi (Rikimaru's sword)", "Kodachi (Ayame's sword)", "Shuriken", 
        "Kunai", "Smoke bombs", "Grappling hook", "Caltrops", "Poison rice",
        "Medicine", "Firecrackers", "Blowgun", "Ninja scrolls",
        
        # Games & Stages
        "Tenchu: Stealth Assassins", "Tenchu 2: Birth of the Stealth Assassins",
        "Tenchu: Wrath of Heaven", "Tenchu: Fatal Shadows", "Tenchu: Time of the Assassins",
        "Tenchu Z", "Tenchu: Shadow Assassins", "Azuma Castle", "Gohda Village",
        "Mountaintop Temple", "Underground Caverns", "Port Town", "Bamboo Forest",
        
        # Game Mechanics
        "Stealth kills", "Ninja ranking system", "Ki meter", "Body hiding",
        "Environmental kills", "Multiple assassination methods", "Alternative routes",
        
        # Lore & Story
        "Azuma Ninja Clan", "Gohda Clan", "Rikimaru's backstory", "Ayame's training",
        "Onikage's betrayal", "The Dark Clan", "Spiritual elements", "Feudal Japan setting",
        
        # Music & Sound
        "Noriyuki Asakura's soundtrack", "Stealth music themes", "Combat music",
        "Sound design", "Ambient sounds", "Voice acting",
        
        # Memorable Moments
        "Boss fights", "Stealth sequences", "Story revelations", "Character development",
        "Hidden areas", "Secret techniques", "Multiple endings"
    ]
    return random.sample(tenchu_topics, min(5, len(tenchu_topics)))

def generate_tenchu_post():
    """Generate a Tenchu series post using Gemini."""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Get Tenchu-specific topics
            topics = get_tenchu_topics()
            selected_topic = random.choice(topics)
            
            print(f"🎯 Selected Tenchu topic: {selected_topic}")
            
            # Initialize client based on available SDK
            if SDK_TYPE == "new":
                client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
            else:
                genai.configure(api_key=os.environ["GEMINI_API_KEY"])
            
            # REVISED PROMPT: Tenchu-specific content
            prompt = f"""
            ACT AS: A knowledgeable Tenchu series expert and fan. You are creating social media content for fellow Tenchu enthusiasts.

            TOPIC: "{selected_topic}"

            TASK: Create a social media post with TWO distinct parts:

            PART 1: IMAGE_HOOK
            - This is a SHORT, compelling one-line statement about the Tenchu topic.
            - It must be under 10 words.
            - It must be strong enough to stand alone on an image.
            - **NO EMOJIS.** Just plain text.
            - Examples: "Rikimaru's Izayoi: The silent blade of justice." | "Stealth is the true ninja way in Tenchu." | "Ayame's agility defines graceful assassination."

            PART 2: FULL_CAPTION
            - This is the full social media caption that expands on the hook.
            - **VARY YOUR OPENING:** Do NOT start with greeting or "Did you know". Use different openings like:
              "In Tenchu lore..." / "This weapon..." / "Character detail..." / "Game mechanic..." / "Hidden fact..." / "Memorable moment..."
            - **USE LINE BREAKS:** Make it easy to read. Use empty lines to separate ideas.
            - Include a specific question to prompt comments from Tenchu fans.
            - **MUST INCLUDE 5-7 RELEVANT HASHTAGS at the end** (Tenchu, StealthAssassin, etc.)
            - **DO NOT** start with any greeting or AI-disclosing phrase. Just start the content.

            FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

            IMAGE_HOOK: [Your short, emoji-free hook here]
            FULL_CAPTION: [Your engaging full caption here]

            Now create a post about {selected_topic}:
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
            post_data = {}
            lines = response_text.split('\n')
            
            image_hook_found = False
            full_caption_lines = []
            
            for line in lines:
                if line.startswith('IMAGE_HOOK:'):
                    post_data['image_text'] = line.replace('IMAGE_HOOK:', '').strip()
                    image_hook_found = True
                elif line.startswith('FULL_CAPTION:'):
                    # Start collecting the caption after this line
                    caption_start = line.replace('FULL_CAPTION:', '').strip()
                    if caption_start:  # If there's text on the same line
                        full_caption_lines.append(caption_start)
                elif image_hook_found and 'full_post' not in post_data:
                    # Check if we are in the caption section
                    if line.strip() == '' and not full_caption_lines:
                        continue  # Skip empty lines before caption starts
                    full_caption_lines.append(line)
            
            # Join the caption lines to form the full post
            if full_caption_lines:
                post_data['full_post'] = '\n'.join(full_caption_lines).strip()
            
            # Check if we have both parts and if the hook is a duplicate
            if 'image_text' in post_data and 'full_post' in post_data:
                if is_duplicate_tip(post_data['image_text']):
                    print(f"🔄 Generated hook is a duplicate, trying again... (Attempt {retry_count + 1}/{max_retries})")
                    retry_count += 1
                    continue
                
                # Final check: Ensure hashtags are present
                if '#' not in post_data['full_post']:
                    print("🔄 Generated caption lacks hashtags, trying again...")
                    retry_count += 1
                    continue
                
                return post_data
            else:
                raise Exception("Invalid response format from Gemini. Missing IMAGE_HOOK or FULL_CAPTION.")
            
        except Exception as e:
            print(f"❌ Error generating Tenchu post: {e}")
            retry_count += 1
            if retry_count >= max_retries:
                break
            time.sleep(2)  # Wait before retrying
    
    # Fallback if all retries fail
    print("🔄 Using fallback after Gemini failures...")
    fallback_posts = [
        {
            'image_text': "Rikimaru: The silent blade of Azuma.",
            'full_post': "Rikimaru's stoic demeanor and unmatched sword skills made him the perfect assassin for the Azuma clan. His loyalty to Lord Gohda was absolute, even when faced with impossible missions.\n\nWhich Rikimaru moment stands out most in your memory? Share your favorite assassination!\n\n#Tenchu #Rikimaru #StealthAssassin #AzumaClan #NinjaGames"
        },
        {
            'image_text': "Ayame's grace defines silent elimination.",
            'full_post': "Ayame brought speed and agility to the Azuma clan, complementing Rikimaru's strength. Her kodachi techniques were as beautiful as they were deadly, making her one of the most memorable female protagonists in gaming.\n\nWhat was your most impressive Ayame stealth kill? Describe it below! ⚔️\n\n#Tenchu #Ayame #FemaleProtagonist #StealthGame #ClassicGaming"
        },
        {
            'image_text': "Stealth kills: The heart of Tenchu.",
            'full_post': "The satisfaction of a perfect stealth kill never gets old. From environmental assassinations to creative use of tools, Tenchu perfected the art of silent elimination years before other stealth games.\n\nWhat's your personal record for stealth kills in a single mission? Let's compare techniques! 🎯\n\n#Tenchu #StealthKills #NinjaAssassin #GamingHistory #StealthGame"
        }
    ]
    
    # Filter out duplicates from fallback posts
    non_duplicate_posts = [
        p for p in fallback_posts 
        if not is_duplicate_tip(p['image_text'])
    ]
    
    if non_duplicate_posts:
        return random.choice(non_duplicate_posts)
    else:
        # If all fallbacks are duplicates, return a random one anyway
        print("⚠️ All fallback posts are duplicates, using random one")
        return random.choice(fallback_posts)

def get_tenchu_image():
    """Get a ninja/feudal Japan themed image from Pixabay API"""
    try:
        api_key = os.environ.get("PIXABAY_KEY")
        if not api_key:
            print("❌ PIXABAY_KEY not found in environment variables")
            return None
            
        # Ninja and feudal Japan themed categories
        categories = ["ninja", "samurai", "japan", "feudal", "temple", "castle", 
                     "bamboo", "night", "moon", "shadow", "stealth", "assassin",
                     "sword", "shuriken", "traditional", "ancient", "dojo"]
        category = random.choice(categories)
        
        print(f"🌄 Searching Pixabay for: {category}")
        
        url = "https://pixabay.com/api/"
        params = {
            "key": api_key,
            "q": category,
            "image_type": "photo",
            "orientation": "horizontal",
            "per_page": 20,
            "safesearch": "true"
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

def create_tenchu_image(image_text):
    """Create Tenchu-themed image with appropriate background and text overlay"""
    width, height = 1200, 1200
    
    # Try to get a ninja/Japan themed image first
    image_bytes = get_tenchu_image()
    
    if image_bytes:
        try:
            # Open and process the image
            background = Image.open(image_bytes)
            background = background.resize((width, height), Image.LANCZOS)
            
            # Apply a slight darkening filter for better text readability
            enhancer = ImageEnhance.Brightness(background)
            background = enhancer.enhance(0.7)  # Darken slightly
            
            print("✅ Using themed background image")
            
        except Exception as e:
            print(f"❌ Error processing image: {e}")
            # Fallback to dark, ninja-appropriate color background
            ninja_colors = [
                '#1a1a1a', '#2d2d2d', '#3a3a3a', '#4a4a4a', '#2d1a1a',
                '#1a2d2d', '#2d1a2d', '#1a2d1a', '#2d2d1a', '#1a1a2d'
            ]
            bg_color = random.choice(ninja_colors)
            background = Image.new('RGB', (width, height), color=bg_color)
            print("✅ Using fallback dark color background")
    else:
        # Fallback to dark, ninja-appropriate color background
        ninja_colors = [
            '#1a1a1a', '#2d2d2d', '#3a3a3a', '#4a4a4a', '#2d1a1a',
            '#1a2d2d', '#2d1a2d', '#1a2d1a', '#2d2d1a', '#1a1a2d'
        ]
        bg_color = random.choice(ninja_colors)
        background = Image.new('RGB', (width, height), color=bg_color)
        print("✅ Using fallback dark color background")
    
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
    
    # Wrap the main text
    max_chars_per_line = 22
    wrapped_tip = textwrap.fill(image_text, width=max_chars_per_line)
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), wrapped_tip, font=tip_font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Use red or white text for ninja theme with dark background
    text_color = (255, 50, 50) if random.choice([True, False]) else (255, 255, 255)
    
    # Add semi-transparent black background for better readability
    padding = 40
    draw.rectangle([
        x - padding, y - padding,
        x + text_width + padding, y + text_height + padding
    ], fill=(0, 0, 0, 180))
    
    # Draw main text
    draw.text((x, y), wrapped_tip, fill=text_color, font=tip_font, align='center')
    
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
        
        files = {'source': ('tenchu_content.jpg', image_data, 'image/jpeg')}
        data = {'message': caption, 'access_token': access_token}
        
        response = requests.post(url, files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            # Save to posted content history to prevent duplicates
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
    print("🚀 Starting Tenchu content generation and posting process...")
    print(f"📁 History file location: {POST_HISTORY_FILE}")
    
    # Check environment variables
    required_env_vars = ["GEMINI_API_KEY", "PIXABAY_KEY", "FB_PAGE_ID", "FB_PAGE_TOKEN"]
    missing_vars = [var for var in required_env_vars if not os.environ.get(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("💡 Please add missing variables to your GitHub Secrets")
        return
    
    # Load existing history to check functionality
    posted_content = load_posted_tips()
    print(f"📊 Existing content in history: {len(posted_content)}")
    
    # Generate a Tenchu post
    post_data = generate_tenchu_post()
    print("🎯 Generated Tenchu post")
    print(f"🖼️  Image Hook: {post_data['image_text']}")
    print(f"📝 Full Caption: {post_data['full_post']}")
    
    # Create image with the short, clean hook
    final_image = create_tenchu_image(post_data['image_text'])
    print("🎨 Tenchu image created")
    
    # Post to Facebook
    success = post_to_facebook(final_image, post_data)
    
    if success:
        print("✅ Process completed successfully! The Tenchu post has been shared.")
    else:
        print("❌ Process completed with errors")

if __name__ == "__main__":
    main()