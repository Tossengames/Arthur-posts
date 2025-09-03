import os
import random
import textwrap
from datetime import datetime
from google import genai
from PIL import Image, ImageDraw, ImageFont
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.facebookpage import FacebookPage
from facebook_business.adobjects.post import Post

# Initialize APIs
def initialize_apis():
    # Initialize Gemini Client
    gemini_client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
    
    # Initialize Facebook API
    FacebookAdsApi.init(
        access_token=os.getenv('FB_PAGE_TOKEN')
    )
    
    return gemini_client

# Generate post content using Gemini
def generate_post_content(client):
    prompt = """
    Create an informative and engaging social media post about career development, job search tips, or professional growth. 
    The post should be under 200 characters, include a clear main point, and be relevant to a professional audience. 
    Avoid duplicating previous posts and ensure the content is positive and actionable. 
    Include 3-4 relevant hashtags (e.g., #CareerTips #JobSearch #ProfessionalGrowth).
    """
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            thinking_config=genai.types.ThinkingConfig(thinking_budget=0)
        )
    )
    return response.text

# Create image with text overlay
def create_image_with_text(text, width=800, height=400):
    # Create a random pastel background color
    bg_color = (
        random.randint(200, 255),
        random.randint(200, 255),
        random.randint(200, 255)
    )
    image = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(image)
    
    # Load font (adjust path if needed)
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()
    
    # Wrap text
    wrapped_text = textwrap.fill(text, width=30)
    bbox = draw.textbbox((0, 0), wrapped_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) / 2
    y = (height - text_height) / 2
    
    # Draw text with contrasting color
    text_color = (0, 0, 0)  # Black
    draw.text((x, y), wrapped_text, font=font, fill=text_color)
    
    image_path = "post_image.png"
    image.save(image_path)
    return image_path

# Post to Facebook
def post_to_facebook(image_path, text):
    page = FacebookPage(os.getenv('FB_PAGE_ID'))
    with open(image_path, 'rb') as image_file:
        page.api_call(
            'photos',
            params={
                'message': text,
                'published': True
            },
            files={'source': image_file}
        )

# Main execution
if __name__ == "__main__":
    client = initialize_apis()
    post_text = generate_post_content(client)
    image_path = create_image_with_text(post_text)
    post_to_facebook(image_path, post_text)
    print("Post created and uploaded successfully!")