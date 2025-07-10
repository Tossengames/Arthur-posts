import os
import json
import requests
import textwrap
import re # Import regex for cleaning text
from datetime import datetime
import random # For selecting diverse post types

# --- Configuration (Use Environment Variables for API Keys!) ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PIXABAY_API_KEY = os.getenv("PIXABAY_KEY") # This should now correctly pick up PIXABAY_KEY
FACEBOOK_PAGE_ID = os.getenv("FB_PAGE_ID")
FACEBOOK_ACCESS_TOKEN = os.getenv("FB_PAGE_TOKEN")

# --- Gemini API Setup ---
# IMPORTANT: Ensure this model name matches the Gemini 1.5 model you are using!
# For Gemini 1.5 Flash:
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
# If you are using Gemini 1.5 Pro, change it to:
# GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

# --- Pixabay API Setup ---
PIXABAY_API_URL = "https://pixabay.com/api/"

# --- Paths ---
CHARACTER_FILE = "arthur_character.json" 
IMAGES_DIR = "temp_images"

def load_character_data(file_path):
    """Loads Arthur's character data from a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Character file '{file_path}' not found. Make sure it's in the same directory.")
        exit(1)
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{file_path}'. Check file format.")
        exit(1)

def clean_markdown_bold(text):
    """Removes Markdown bold formatting (**) from a string."""
    return re.sub(r'\*\*(.*?)\*\*', r'\1', text) # Replaces **text** with text

def generate_gemini_post(character_data, prompt_type):
    """
    Generates a post using Gemini based on Arthur's character data and a prompt type.
    """
    arthur = character_data.get("character", {})
    
    # Base persona for Arthur
    # Emphasize consistent age and ranger tenure here.
    base_persona = (
        f"You are Arthur 'Art' Peterson, a 62-year-old retired Forest Ranger from Prescott, Arizona. "
        f"You spent forty years as a Forest Ranger. Your experience as a Wilderness First Responder since '88 "
        f"and SAR Coordinator is extensive. "
        f"You are wise, patient, and resourceful, with a dry wit and deep love for nature. "
        f"Your values include respect for nature, self-reliance, and preparation. "
        f"You have decades of experience in backpacking, fly-fishing, and wilderness survival. "
        f"You often use catchphrases like '{arthur['personality']['catchphrases'][0]}' or '{arthur['personality']['catchphrases'][2]}'.\n"
        f"DO NOT vary your age (62) or years of ranger service (40 years). "
        f"Start your posts in a natural, varied way. Do not always use the same opening phrase."
    )

    full_prompt = base_persona + "\n\n"
    word_count_range = "150-250 words" # Default range, can be overridden per type

    if prompt_type == "general_camping_tip":
        example_experience = random.choice(arthur['experiences'])['details'] if arthur['experiences'] else "a time you learned something important in the wilderness"
        skill_example = random.choice(arthur['skills']).lower()
        full_prompt += (
            f"Share a practical, actionable tip for beginner campers, perhaps drawing on an experience like '{example_experience}'. "
            f"Make it encouraging and insightful, focusing on a skill like '{skill_example}'. "
            f"End with a call to action to enjoy nature responsibly. Aim for {word_count_range}."
        )
    elif prompt_type == "motivation_outdoors":
        example_value = random.choice(arthur['personality']['values'])
        full_prompt += (
            f"Write an encouraging post about overcoming challenges in the outdoors, relating it to the value of '{example_value}'. "
            f"Mention your loyal dog Scout. Aim for 100-200 words. Conclude with a thought-provoking question."
        )
    elif prompt_type == "how_to_wilderness_skill":
        skill_to_teach = random.choice([
            "knot tying", "fire starting in damp conditions", "basic map and compass navigation",
            "wilderness first aid for minor cuts", "identifying safe water sources"
        ])
        full_prompt += (
            f"Create a short 'how-to' guide on '{skill_to_teach}'. Break it down into 3-4 simple, crucial steps. "
            f"Keep it practical and concise ({word_count_range}). "
            f"Reference your experience as a SAR Coordinator if relevant. "
            f"End with a reminder about preparedness."
        )
    elif prompt_type == "personal_anecdote":
        memory = random.choice(arthur['experiences'])['details']
        full_prompt += (
            f"Share a brief, heartwarming personal anecdote, perhaps like '{memory}', involving your family (e.g., grandchildren Lily and Ben) or your dog Scout. "
            f"Connect it to the joy of sharing the outdoors or a lesson learned from nature. "
            f"Keep it around 100-180 words, with a warm and reflective tone."
        )
    elif prompt_type == "advice_for_youth":
        topic = random.choice(["resilience", "patience", "observing the world", "finding your path"])
        full_prompt += (
            f"Offer a piece of life advice for young people, drawing from your decades of experience as a ranger. "
            f"Focus on the value of '{topic}' and how the outdoors taught you about it. "
            f"Around 150-220 words. End with an encouraging thought."
        )
    elif prompt_type == "nature_facts":
        topic = random.choice(["local flora of Arizona", "common desert animals and their adaptations", "reading animal tracks", "the importance of native plants"])
        full_prompt += (
            f"Share some interesting information or facts about '{topic}'. "
            f"Make it informative but accessible, as if you're talking to a new camper. "
            f"Keep it around 160-240 words. Encourage people to observe their surroundings."
        )
    elif prompt_type == "what_to_do_situation":
        situation = random.choice([
            "getting lost on a trail", "encountering a venomous snake", "dealing with a minor injury far from help",
            "unexpected change in weather (e.g., sudden storm)", "how to properly store food to avoid attracting wildlife"
        ])
        full_prompt += (
            f"Write a practical guide on 'what to do if {situation}'. "
            f"Break it down into key steps and essential mindset. Emphasize calm and resourcefulness. "
            f"Aim for {word_count_range}. Conclude with a safety reminder."
        )
    elif prompt_type == "gear_essentials":
        gear_item = random.choice(["a good multi-tool", "reliable hiking boots", "a quality first-aid kit", "a map and compass"])
        full_prompt += (
            f"Discuss the importance of a '{gear_item}' for any outdoor enthusiast. "
            f"Explain why it's essential and share a brief example of when it's proven its worth. "
            f"Focus on practical advice. Around 120-200 words."
        )
    elif prompt_type == "philosophical_reflection":
        concept = random.choice(["solitude in nature", "the balance of ecosystems", "the healing power of the wilderness", "finding peace outdoors"])
        full_prompt += (
            f"Share a short reflection on the concept of '{concept}' from your perspective as a long-time ranger. "
            f"What does it mean to you? How has nature shaped your understanding of it? "
            f"Aim for 100-180 words, with a thoughtful and gentle tone."
        )
    else: # Fallback
        full_prompt += "Write a short, engaging post about the general beauty of nature and responsible enjoyment."
        word_count_range = "100-150 words"

    full_prompt += f"\n\nStrictly adhere to the word count mentioned, which is {word_count_range}. Do NOT exceed it."

    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "contents": [
            {
                "parts": [
                    {"text": full_prompt}
                ]
            }
        ]
    }
    params = {"key": GEMINI_API_KEY}

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, params=params, json=data, timeout=45) # Increased timeout
        response.raise_for_status()
        
        response_json = response.json()
        if 'candidates' in response_json and response_json['candidates']:
            generated_text = response_json['candidates'][0]['content']['parts'][0]['text']
            return clean_markdown_bold(generated_text.strip()) # Clean bold formatting here
        else:
            print(f"Gemini API response did not contain expected 'candidates': {response_json}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return None

def search_and_download_pixabay_images(query, num_images=5, orientation="horizontal", min_width=1920):
    """
    Searches Pixabay for images and downloads them to a temporary directory.
    """
    if not PIXABAY_API_KEY:
        print("Pixabay API key not set. Skipping image download.")
        return []

    os.makedirs(IMAGES_DIR, exist_ok=True)
    
    params = {
        "key": PIXABAY_API_KEY,
        "q": query,
        "image_type": "photo",
        "orientation": orientation,
        "min_width": min_width,
        "per_page": num_images * 4, # Request more to get more variety (e.g., 20 instead of 10)
        "safesearch": True
    }

    try:
        print(f"DEBUG: Pixabay API Key (from os.getenv): {'(set)' if PIXABAY_API_KEY else '(NOT SET)'}") # Debug line
        response = requests.get(PIXABAY_API_URL, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        # Shuffle hits to pick more randomly, not just the top ones
        hits = data.get("hits", [])
        random.shuffle(hits) # Shuffle the results before picking
        
        image_urls = []
        for hit in hits: # Iterate through shuffled hits
            if hit.get("webformatURL"):
                image_urls.append(hit["webformatURL"])
                if len(image_urls) >= num_images:
                    break
        
        downloaded_paths = []
        for i, url in enumerate(image_urls):
            file_name = f"image_{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{i}.jpg" # Added %f for microseconds for more uniqueness
            file_path = os.path.join(IMAGES_DIR, file_name)
            try:
                img_data = requests.get(url, stream=True, timeout=10)
                img_data.raise_for_status()
                with open(file_path, 'wb') as f:
                    for chunk in img_data.iter_content(chunk_size=8192):
                        f.write(chunk)
                downloaded_paths.append(file_path)
                print(f"Downloaded: {file_path}")
            except requests.exceptions.RequestException as e:
                print(f"Error downloading image from {url}: {e}")
        return downloaded_paths

    except requests.exceptions.RequestException as e:
        print(f"Error calling Pixabay API for query '{query}': {e}")
        return []

def post_to_facebook(page_id, access_token, message, image_paths):
    """
    Posts a message and multiple images to a Facebook Page using the Graph API.
    """
    if not page_id or not access_token:
        print("Facebook Page ID or Access Token not set. Cannot post to Facebook.")
        return False

    uploaded_photo_ids = []
    
    # 1. Upload each photo individually
    for img_path in image_paths:
        try:
            print(f"Attempting to upload image: {img_path}")
            upload_url = f"https://graph.facebook.com/{page_id}/photos"
            
            with open(img_path, 'rb') as img_file:
                files = {'source': img_file}
                # 'published': 'false' means upload to page album but don't create separate post
                data = {'access_token': access_token, 'published': 'false'} 
                
                response = requests.post(upload_url, files=files, data=data, timeout=30)
                response.raise_for_status()
                
                photo_data = response.json()
                photo_id = photo_data.get('id')
                
                if photo_id:
                    uploaded_photo_ids.append(photo_id)
                    print(f"Successfully uploaded {img_path}. Photo ID: {photo_id}")
                else:
                    print(f"Error: Photo upload response did not contain ID: {photo_data}")
                    # Continue to try other images even if one fails
        except requests.exceptions.RequestException as e:
            print(f"Error uploading image {img_path} to Facebook: {e}")
        except FileNotFoundError:
            print(f"Error: Image file not found at {img_path}. Skipping upload.")

    if not uploaded_photo_ids:
        print("No images were successfully uploaded. Proceeding with text-only post if possible.")

    # 2. Create the post with attached media (or as a text-only post if no images)
    post_url = f"https://graph.facebook.com/{page_id}/feed"
    
    post_data = {
        'message': message,
        'access_token': access_token
    }

    if uploaded_photo_ids:
        attached_media = [{'media_fbid': photo_id} for photo_id in uploaded_photo_ids]
        post_data['attached_media'] = json.dumps(attached_media)
    
    try:
        print("\nAttempting to publish Facebook post...")
        response = requests.post(post_url, data=post_data, timeout=30)
        response.raise_for_status()
        
        post_response = response.json()
        if 'id' in post_response:
            print(f"Successfully posted to Facebook! Post ID: {post_response['id']}")
            print(f"View post: https://www.facebook.com/{post_response['id'].replace('_', '/posts/')}")
            return True
        else:
            print(f"Error: Post creation response did not contain ID: {post_response}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Error publishing post to Facebook: {e}")
        # Print the full error response from Facebook if available
        if hasattr(e, 'response') and e.response is not None:
            print(f"Facebook API Error Details: {e.response.text}")
        return False

def cleanup_images():
    """Removes downloaded images after use."""
    import shutil
    if os.path.exists(IMAGES_DIR):
        print(f"Cleaning up temporary image directory: {IMAGES_DIR}")
        shutil.rmtree(IMAGES_DIR)

if __name__ == "__main__":
    character_data = load_character_data(CHARACTER_FILE)
    
    # Define all possible post types
    post_types = [
        "general_camping_tip",
        "motivation_outdoors",
        "how_to_wilderness_skill",
        "personal_anecdote",
        "advice_for_youth",
        "nature_facts",
        "what_to_do_situation",
        "gear_essentials",
        "philosophical_reflection"
    ]
    
    # Randomly select a post type for this run
    selected_post_type = random.choice(post_types)
    
    # Common image query for nature/wilderness themes
    # Added more general outdoor terms for variety
    image_query = "forest, mountains, landscape, wilderness, nature, outdoors, hiking, trails, camping"
        
    print(f"Generating a '{selected_post_type}' post for Arthur...")

    # 1. Generate Post Text using Gemini
    post_text = generate_gemini_post(character_data, selected_post_type)

    if post_text:
        print("\n--- Generated Post Text ---")
        print(post_text)
        print("---------------------------\n")

        # 2. Search and Download Images from Pixabay
        image_paths = search_and_download_pixabay_images(image_query, num_images=5)

        if image_paths:
            print(f"Found and downloaded {len(image_paths)} images.")
        else:
            print("No images found or downloaded from Pixabay.")

        # 3. Post to Facebook
        if FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN:
            post_to_facebook(FACEBOOK_PAGE_ID, FACEBOOK_ACCESS_TOKEN, post_text, image_paths)
        else:
            print("Facebook Page ID or Access Token not set. Skipping real Facebook post.")
        
        # 4. Clean up downloaded images
        cleanup_images()
    else:
        print("Failed to generate post text. Aborting.")
