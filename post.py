#!/usr/bin/env python3
"""
Career Wisdom: Generate job/career-themed inspirational content with Gemini AI,
create images with text overlay, and post to Facebook Page.
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

# File to store posted quotes for duplication check
POST_HISTORY_FILE = "posted_quotes.json"

def load_posted_quotes():
    """Load history of posted quotes to avoid duplicates"""
    if Path(POST_HISTORY_FILE).exists():
        with open(POST_HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []

def save_posted_quote(quote_data):
    """Save a posted quote to history"""
    posted_quotes = load_posted_quotes()
    
    # Create a unique hash of the quote to identify duplicates
    quote_hash = hashlib.md5(quote_data['quote'].encode()).hexdigest()
    
    # Add to history if not already there
    if quote_hash not in posted_quotes:
        posted_quotes.append(quote_hash)
        with open(POST_HISTORY_FILE, 'w') as f:
            json.dump(posted_quotes, f)
        return True
    return False

def is_duplicate_quote(quote_data):
    """Check if a quote has already been posted"""
    posted_quotes = load_posted_quotes()
    quote_hash = hashlib.md5(quote_data['quote'].encode()).hexdigest()
    return quote_hash in posted_quotes

def generate_career_quote():
    """Generate a job/career-themed inspirational quote using Gemini 2.0 Flash"""
    try:
        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        
        prompt = """
        Create a SHORT job search, career development, or professional growth tip. 
        Keep it under 15 words maximum. Make it practical, actionable, and motivational.
        Focus on topics like: resume tips, interview preparation, networking, skills development, or career advancement.
        
        Include 3-4 relevant hashtags at the end (e.g., #CareerTips #JobSearch #ProfessionalGrowth).
        
        Format the response exactly like this:
        
        QUOTE: [The career tip text here] #Hashtag1 #Hashtag2 #Hashtag3
        
        Examples:
        
        QUOTE: Tailor your resume for each job application to stand out. #ResumeTips #JobSearch #CareerAdvice
        QUOTE: Network before you need it - build genuine connections. #Networking #CareerGrowth #ProfessionalDevelopment
        QUOTE: Learn one new skill each month to stay relevant. #SkillsDevelopment #CareerTips #ContinuousLearning
        QUOTE: Prepare 3 questions to ask at every interview. #InterviewTips #JobSearch #CareerAdvice
        QUOTE: Your online presence is your digital resume - keep it professional. #PersonalBranding #CareerTips #JobSearch
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        
        response_text = response.text.strip()
        print(f"Gemini response:\n{response_text}")
        
        # Parse the response
        if 'QUOTE:' in response_text:
            quote_line = response_text.split('QUOTE:')[1].strip()
            quote_data = {
                'quote': quote_line,
                'hashtags': extract_hashtags(quote_line)
            }
            
            # Remove hashtags from the main quote text for image overlay
            clean_quote = quote_line
            for tag in quote_data['hashtags']:
                clean_quote = clean_quote.replace(tag, '')
            quote_data['clean_quote'] = clean_quote.strip()
            
            # Check if this is a duplicate before returning
            if is_duplicate_quote(quote_data):
                print("Generated quote is a duplicate, trying again...")
                return generate_career_quote()  # Recursively try again
            
            return quote_data
        else:
            raise Exception("Invalid response format from Gemini")
        
    except Exception as e:
        print(f"Error generating career quote: {e}")
        # Fallback career quotes
        fallback_quotes = [
            {
                'quote': 'Tailor your resume for each job application to stand out. #ResumeTips #JobSearch #CareerAdvice',
                'hashtags': ['#ResumeTips', '#JobSearch', '#CareerAdvice'],
                'clean_quote': 'Tailor your resume for each job application to stand out.'
            },
            {
                'quote': 'Network before you need it - build genuine connections. #Networking #CareerGrowth #ProfessionalDevelopment',
                'hashtags': ['#Networking', '#CareerGrowth', '#ProfessionalDevelopment'],
                'clean_quote': 'Network before you need it - build genuine connections.'
            },
            {
                'quote': 'Learn one new skill each month to stay relevant. #SkillsDevelopment #CareerTips #ContinuousLearning',
                'hashtags': ['#SkillsDevelopment', '#CareerTips', '#ContinuousLearning'],
                'clean_quote': 'Learn one new skill each month to stay relevant.'
            },
            {
                'quote': 'Prepare 3 questions to ask at every interview. #InterviewTips #JobSearch #CareerAdvice',
                'hashtags': ['#InterviewTips', '#JobSearch', '#CareerAdvice'],
                'clean_quote': 'Prepare 3 questions to ask at every interview.'
            },
            {
                'quote': 'Your online presence is your digital resume - keep it professional. #PersonalBranding #CareerTips #JobSearch',
                'hashtags': ['#PersonalBranding', '#CareerTips', '#JobSearch'],
                'clean_quote': 'Your online presence is your digital resume - keep it professional.'
            }
        ]
        
        # Filter out duplicates from fallback quotes
        non_duplicate_quotes = [
            q for q in fallback_quotes 
            if not is_duplicate_quote(q)
        ]
        
        if non_duplicate_quotes:
            return random.choice(non_duplicate_quotes)
        else:
            # If all fallbacks are duplicates, return a random one anyway
            return random.choice(fallback_quotes)

def extract_hashtags(text):
    """Extract hashtags from text"""
    import re
    return re.findall(r'#\w+', text)

def create_career_image(quote_data):
    """Create career-themed image with text overlay"""
    width, height = 1200, 1200
    
    # Professional color palette (blues, greens, grays)
    professional_colors = [
        '#1a4b8c', '#2c5aa0', '#3d69b4', '#4f78c8', '#6187dc',  # Blues
        '#2d6a4f', '#3e7c61', '#4f8e73', '#60a085', '#71b297',  # Greens
        '#495057', '#5c636a', '#6f777e', '#828a91', '#959da4'   # Grays
    ]
    
    bg_color = random.choice(professional_colors)
    image = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(image)
    
    # Add subtle professional pattern
    for i in range(20):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(5, 15)
        draw.rectangle([x, y, x+size, y+size], 
                      fill=(255, 255, 255, 30),  # Semi-transparent white
                      outline=None)
    
    # Try to load font (using DejaVu which is available on GitHub Actions)
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        quote_font = ImageFont.truetype(font_path, 60)
    except (IOError, OSError):
        try:
            quote_font = ImageFont.truetype("arial.ttf", 60)
        except (IOError, OSError):
            quote_font = ImageFont.load_default()
    
    # Wrap the quote text
    max_chars_per_line = 25
    wrapped_quote = textwrap.fill(quote_data['clean_quote'], width=max_chars_per_line)
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), wrapped_quote, font=quote_font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Add semi-transparent background for better readability
    padding = 30
    draw.rectangle([
        x - padding, y - padding,
        x + text_width + padding, y + text_height + padding
    ], fill=(0, 0, 0, 100))  # Semi-transparent black
    
    # Draw quote text
    draw.text((x, y), wrapped_quote, fill=(255, 255, 255), font=quote_font, align='center')
    
    # Convert to bytes
    output_buffer = BytesIO()
    image.save(output_buffer, format="JPEG", quality=95)
    return output_buffer.getvalue()

def post_to_facebook(image_data, quote_data):
    """Post the image to Facebook Page with career-themed caption"""
    try:
        page_id = os.environ["FB_PAGE_ID"]
        access_token = os.environ["FB_PAGE_TOKEN"]
        
        # Upload image to Facebook
        url = f"https://graph.facebook.com/v19.0/{page_id}/photos"
        
        # Create engaging caption with hashtags
        caption = f"{quote_data['quote']}"
        
        files = {'source': ('career_tip.jpg', image_data, 'image/jpeg')}
        data = {'message': caption, 'access_token': access_token}
        
        response = requests.post(url, files=files, data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            # Save to posted quotes history to prevent duplicates
            save_posted_quote(quote_data)
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
    print("Starting career wisdom generation and posting process...")
    
    # Generate quote content
    quote_data = generate_career_quote()
    print(f"Career Tip: {quote_data['quote']}")
    
    # Create image with text overlay
    final_image = create_career_image(quote_data)
    print("Career image with text overlay created")
    
    # Post to Facebook
    success = post_to_facebook(final_image, quote_data)
    
    if success:
        print("Process completed successfully! The career tip has been shared.")
    else:
        print("Process completed with errors")

if __name__ == "__main__":
    main()