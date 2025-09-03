#!/usr/bin/env python3
"""
Career Coach: Generate practical job search and career advice with Gemini AI,
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
from google import genai
from io import BytesIO

# File to store posted tips for duplication check
POST_HISTORY_FILE = "posted_tips.json"

def load_posted_tips():
    """Load history of posted tips to avoid duplicates"""
    if Path(POST_HISTORY_FILE).exists():
        with open(POST_HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []

def save_posted_tip(tip_data):
    """Save a posted tip to history"""
    posted_tips = load_posted_tips()
    
    # Create a unique hash of the main tip to identify duplicates
    tip_hash = hashlib.md5(tip_data['main_tip'].encode()).hexdigest()
    
    # Add to history if not already there
    if tip_hash not in posted_tips:
        posted_tips.append(tip_hash)
        with open(POST_HISTORY_FILE, 'w') as f:
            json.dump(posted_tips, f)
        return True
    return False

def is_duplicate_tip(tip_data):
    """Check if a tip has already been posted"""
    posted_tips = load_posted_tips()
    tip_hash = hashlib.md5(tip_data['main_tip'].encode()).hexdigest()
    return tip_hash in posted_tips

def generate_career_tip():
    """Generate a practical job search/career advice tip using Gemini 2.0 Flash"""
    try:
        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        
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

        Format the response exactly like this:

        MAIN_TIP: Use action verbs and metrics in your resume bullet points.
        EXPLANATION: This makes your accomplishments more impactful and helps your resume stand out to both ATS systems and hiring managers.
        HASHTAGS: #ResumeTips #JobSearch #CareerAdvice #ATS

        Return only ONE post in this exact format.
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        
        response_text = response.text.strip()
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
                print("Generated tip is a duplicate, trying again...")
                return generate_career_tip()  # Recursively try again
            
            return tip_data
        else:
            raise Exception("Invalid response format from Gemini")
        
    except Exception as e:
        print(f"Error generating career tip: {e}")
        # Fallback practical career tips
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
            return random.choice(fallback_tips)

def get_pixabay_image():
    """Get a random landscape image from Pixabay API"""
    try:
        api_key = os.environ["PIXABAY_API_KEY"]
        categories = ["sky", "mountains", "landscape", "flowers", "nature"]
        category = random.choice(categories)
        
        url = f"https://pixabay.com/api/"
        params = {
            'key': api_key,
            'q': category,
            'image_type': 'photo',
            'orientation': 'horizontal',
            'category': 'nature',
            'per_page': 50,
            'safesearch': 'true'
        }
        
        response = requests.get(url, params=params, timeout=30)
        data = response.json()
        
        if data['hits']:
            # Select a random image from the results
            image_data = random.choice(data['hits'])
            image_url = image_data['largeImageURL']
            
            # Download the image
            img_response = requests.get(image_url, timeout=30)
            return BytesIO(img_response.content)
        else:
            print(f"No images found for category: {category}")
            return None
            
    except Exception as e:
        print(f"Error fetching image from Pixabay: {e}")
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
            
        except Exception as e:
            print(f"Error processing Pixabay image: {e}")
            # Fallback to solid color background
            professional_colors = [
                '#1a4b8c', '#2c5aa0', '#3d69b4', '#4f78c8', '#6187dc',
                '#2d6a4f', '#3e7c61', '#4f8e73', '#60a085', '#71b297',
                '#495057', '#5c636a', '#6f777e', '#828a91', '#959da4'
            ]
            bg_color = random.choice(professional_colors)
            background = Image.new('RGB', (width, height), color=bg_color)
    else:
        # Fallback to solid color background
        professional_colors = [
            '#1a4b8c', '#2c5aa0', '#3d69b4', '#4f78c8', '#6187dc',
            '#2d6a4f', '#3e7c61', '#4f8e73', '#60a085', '#71b297',
            '#495057', '#5c636a', '#6f777e', '#828a91', '#959da4'
        ]
        bg_color = random.choice(professional_colors)
        background = Image.new('RGB', (width, height), color=bg_color)
    
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
    
    # Generate random background color for text box [citation:1][citation:7]
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
    """Create Facebook caption with career advice"""
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
    
    caption = f"""{header}:

{tip_data['main_tip']}

💡 {tip_data['explanation']}

Share your thoughts in the comments!

{tip_data['hashtags']}

#CareerTips #JobSearch #ProfessionalAdvice"""
    
    return caption

def post_to_facebook(image_data, tip_data):
    """Post the image to Facebook Page with career advice caption"""
    try:
        page_id = os.environ["FB_PAGE_ID"]
        access_token = os.environ["FB_PAGE_TOKEN"]
        
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
            save_posted_tip(tip_data)
            print(f"Successfully posted to Facebook! Post ID: {result.get('id')}")
            return True
        else:
            print(f"Facebook API error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error posting to Facebook: {e}")
        return False

def main():
    """Main function to run the entire process"""
    print("Starting career coach tip generation and posting process...")
    
    # Generate practical career tip
    tip_data = generate_career_tip()
    print(f"Main Tip: {tip_data['main_tip']}")
    print(f"Explanation: {tip_data['explanation']}")
    print(f"Hashtags: {tip_data['hashtags']}")
    
    # Create image with main tip text only
    final_image = create_career_image(tip_data)
    print("Career advice image created with Pixabay background")
    
    # Post to Facebook
    success = post_to_facebook(final_image, tip_data)
    
    if success:
        print("Process completed successfully! The career tip has been shared.")
    else:
        print("Process completed with errors")

if __name__ == "__main__":
    main()