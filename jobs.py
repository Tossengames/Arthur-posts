#!/usr/bin/env python3
"""
Career Coach: Generate practical job search and career advice with Gemini AI,
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
    
    # Create a unique hash of the tip to identify duplicates
    tip_hash = hashlib.md5(tip_data['tip'].encode()).hexdigest()
    
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
    tip_hash = hashlib.md5(tip_data['tip'].encode()).hexdigest()
    return tip_hash in posted_tips

def generate_career_tip():
    """Generate a practical job search/career advice tip using Gemini 2.0 Flash"""
    try:
        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        
        prompt = """
        Create a SHORT, practical, actionable job search or career development tip. 
        Keep it under 15 words maximum. Make it specific and useful.
        
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
        
        Include 3-4 relevant hashtags at the end.
        
        Format the response exactly like this:
        
        TIP: [The practical career tip text here] #Hashtag1 #Hashtag2 #Hashtag3
        
        Examples:
        
        TIP: Use action verbs and metrics in your resume bullet points. #ResumeTips #JobSearch #CareerAdvice
        TIP: Research company culture before interviews to ask better questions. #InterviewPrep #CareerTips #JobSearch
        TIP: Customize your LinkedIn headline with keywords from target jobs. #LinkedInTips #JobSearch #CareerDevelopment
        TIP: Send follow-up emails within 24 hours after interviews. #InterviewTips #Networking #CareerAdvice
        TIP: Practice answering common interview questions out loud. #InterviewPrep #JobSearch #CareerTips
        TIP: Use the STAR method for behavioral interview questions. #InterviewTips #CareerAdvice #JobSearch
        TIP: Optimize your resume with keywords from the job description. #ResumeTips #ATS #JobSearch
        TIP: Connect with hiring managers on LinkedIn before applying. #Networking #LinkedInTips #JobSearch
        TIP: Prepare 3-5 questions to ask interviewers about the role. #InterviewPrep #CareerTips #JobSearch
        TIP: Use a professional email address on job applications. #JobSearchTips #CareerAdvice #Resume
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        
        response_text = response.text.strip()
        print(f"Gemini response:\n{response_text}")
        
        # Parse the response
        if 'TIP:' in response_text:
            tip_line = response_text.split('TIP:')[1].strip()
            tip_data = {
                'tip': tip_line,
                'hashtags': extract_hashtags(tip_line)
            }
            
            # Remove hashtags from the main tip text for image overlay
            clean_tip = tip_line
            for tag in tip_data['hashtags']:
                clean_tip = clean_tip.replace(tag, '')
            tip_data['clean_tip'] = clean_tip.strip()
            
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
                'tip': 'Use action verbs and metrics in your resume bullet points. #ResumeTips #JobSearch #CareerAdvice',
                'hashtags': ['#ResumeTips', '#JobSearch', '#CareerAdvice'],
                'clean_tip': 'Use action verbs and metrics in your resume bullet points.'
            },
            {
                'tip': 'Research company culture before interviews to ask better questions. #InterviewPrep #CareerTips #JobSearch',
                'hashtags': ['#InterviewPrep', '#CareerTips', '#JobSearch'],
                'clean_tip': 'Research company culture before interviews to ask better questions.'
            },
            {
                'tip': 'Customize your LinkedIn headline with keywords from target jobs. #LinkedInTips #JobSearch #CareerDevelopment',
                'hashtags': ['#LinkedInTips', '#JobSearch', '#CareerDevelopment'],
                'clean_tip': 'Customize your LinkedIn headline with keywords from target jobs.'
            },
            {
                'tip': 'Send follow-up emails within 24 hours after interviews. #InterviewTips #Networking #CareerAdvice',
                'hashtags': ['#InterviewTips', '#Networking', '#CareerAdvice'],
                'clean_tip': 'Send follow-up emails within 24 hours after interviews.'
            },
            {
                'tip': 'Practice answering common interview questions out loud. #InterviewPrep #JobSearch #CareerTips',
                'hashtags': ['#InterviewPrep', '#JobSearch', '#CareerTips'],
                'clean_tip': 'Practice answering common interview questions out loud.'
            },
            {
                'tip': 'Use the STAR method for behavioral interview questions. #InterviewTips #CareerAdvice #JobSearch',
                'hashtags': ['#InterviewTips', '#CareerAdvice', '#JobSearch'],
                'clean_tip': 'Use the STAR method for behavioral interview questions.'
            },
            {
                'tip': 'Optimize your resume with keywords from the job description. #ResumeTips #ATS #JobSearch',
                'hashtags': ['#ResumeTips', '#ATS', '#JobSearch'],
                'clean_tip': 'Optimize your resume with keywords from the job description.'
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

def extract_hashtags(text):
    """Extract hashtags from text"""
    import re
    return re.findall(r'#\w+', text)

def create_career_image(tip_data):
    """Create career-themed image with practical advice text overlay"""
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
    
    # Add subtle professional pattern (document-like elements)
    for i in range(15):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(10, 25)
        # Create document/page-like rectangles
        draw.rectangle([x, y, x+size, y+size], 
                      fill=(255, 255, 255, 40),  # Semi-transparent white
                      outline=(255, 255, 255, 60))
    
    # Try to load font
    try:
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        tip_font = ImageFont.truetype(font_path, 58)
    except (IOError, OSError):
        try:
            tip_font = ImageFont.truetype("arial.ttf", 58)
        except (IOError, OSError):
            tip_font = ImageFont.load_default()
    
    # Wrap the tip text
    max_chars_per_line = 25
    wrapped_tip = textwrap.fill(tip_data['clean_tip'], width=max_chars_per_line)
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), wrapped_tip, font=tip_font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Add semi-transparent background for better readability
    padding = 40
    draw.rectangle([
        x - padding, y - padding,
        x + text_width + padding, y + text_height + padding
    ], fill=(0, 0, 0, 120))  # Semi-transparent black
    
    # Draw tip text
    draw.text((x, y), wrapped_tip, fill=(255, 255, 255), font=tip_font, align='center')
    
    # Add a "Career Coach Tip" header
    try:
        header_font = ImageFont.truetype(font_path, 36)
    except (IOError, OSError):
        header_font = tip_font
    
    header_text = "Career Coach Tip:"
    header_bbox = draw.textbbox((0, 0), header_text, font=header_font)
    header_x = (width - (header_bbox[2] - header_bbox[0])) // 2
    header_y = y - 70
    
    draw.text((header_x, header_y), header_text, fill=(255, 255, 255), font=header_font)
    
    # Convert to bytes
    output_buffer = BytesIO()
    image.save(output_buffer, format="JPEG", quality=95)
    return output_buffer.getvalue()

def post_to_facebook(image_data, tip_data):
    """Post the image to Facebook Page with practical career advice caption"""
    try:
        page_id = os.environ["FB_PAGE_ID"]
        access_token = os.environ["FB_PAGE_TOKEN"]
        
        # Upload image to Facebook
        url = f"https://graph.facebook.com/v19.0/{page_id}/photos"
        
        # Create engaging caption with hashtags
        caption = f"{tip_data['tip']}\n\n💼 Practical career advice to help you in your job search! What's your best job search tip? Share in the comments! 👇"
        
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
    print(f"Career Tip: {tip_data['tip']}")
    
    # Create image with text overlay
    final_image = create_career_image(tip_data)
    print("Career advice image created")
    
    # Post to Facebook
    success = post_to_facebook(final_image, tip_data)
    
    if success:
        print("Process completed successfully! The career tip has been shared.")
    else:
        print("Process completed with errors")

if __name__ == "__main__":
    main()