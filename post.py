import os
import json
import requests
import textwrap
from datetime import datetime

# --- Configuration (Use Environment Variables for API Keys!) ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PIXABAY_API_KEY = os.getenv("PIXABAY_API_KEY")
FACEBOOK_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")
FACEBOOK_ACCESS_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN") # Long-lived page access token

# --- Gemini API Setup ---
# You'll need to install the Google Generative AI library: pip install google-generativeai
# For simplicity, I'll use a direct requests call, but the official client is recommended.
# You'd typically use: import google.generativeai as genai; genai.configure(api_key=GEMINI_API_KEY)
# And then: model = genai.GenerativeModel('gemini-pro')

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

# --- Pixabay API Setup ---
PIXABAY_API_URL = "https://pixabay.com/api/"

# --- Paths ---
CHARACTER_FILE = "arthur_character.json" # Adjust path if in a subfolder, e.g., "data/arthur_character.json"
IMAGES_DIR = "temp_images" # Directory to save downloaded images temporarily

def load_character_data(file_path):
    """Loads Arthur's character data from a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Character file '{file_path}' not found.")
        exit(1)
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{file_path}'. Check file format.")
        exit(1)

def generate_gemini_post(character_data, prompt_type="general_tip"):
    """
    Generates a post using Gemini based on Arthur's character data and a prompt type.
    """
    arthur = character_data.get("character", {})
    
    # Construct a rich prompt using various aspects of Arthur's character
    base_prompt = f"You are Arthur 'Art' Peterson, a 62-year-old retired Forest Ranger from Prescott, Arizona. You are wise, patient, and resourceful, with a dry wit and deep love for nature. Your values include respect for nature, self-reliance, and preparation. You have decades of experience in backpacking, fly-fishing, and wilderness survival. You often use catchphrases like '{arthur['personality']['catchphrases'][0]}' or '{arthur['personality']['catchphrases'][2]}'.\n\n"
    
    if prompt_type == "general_tip":
        topic = "a general camping tip"
        example_experience = arthur['experiences'][0]['details'] if arthur['experiences'] else "a time you learned something important in the wilderness"
        prompt_suffix = f"Share a practical, actionable tip for beginner campers, perhaps drawing on an experience like '{example_experience}'. Make it encouraging and insightful, around 150-250 words. Include one of your skills, like '{arthur['skills'][0].lower()}'. End with a call to action to enjoy nature responsibly."
    elif prompt_type == "motivation":
        topic = "an encouraging message"
        example_value = arthur['personality']['values'][0]
        prompt_suffix = f"Write an encouraging post about overcoming challenges in the outdoors, relating it to the value of '{example_value}'. Mention your loyal dog Scout. Aim for 100-200 words. Conclude with a thought-provoking question."
    elif prompt_type == "how_to":
        topic = "a 'how-to' guide"
        skill_to_teach = arthur['skills'][4] # Example: Wilderness first aid
        prompt_suffix = f"Create a short 'how-to' guide on '{skill_to_teach}'. Break it down into 3-4 simple, crucial steps. Keep it practical and concise (150-250 words). Reference your experience as a SAR Coordinator if relevant."
    elif prompt_type == "anecdote":
        topic = "a personal anecdote"
        memory = arthur['experiences'][4]['details'] if len(arthur['experiences']) > 4 else arthur['experiences'][0]['details']
        prompt_suffix = f"Share a brief, heartwarming personal anecdote, perhaps like '{memory}', involving your family (e.g., grandchildren Lily and Ben). Connect it to the joy of sharing the outdoors. Keep it around 100-180 words, with a warm and reflective tone."
    else:
        topic = "a message"
        prompt_suffix = "Write a short, engaging post about the beauty of nature."

    full_prompt = base_prompt + f"Today, you want to share {topic}. {prompt_suffix}\n\nStrictly adhere to the word count mentioned. Do NOT exceed it."

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
        response = requests.post(GEMINI_API_URL, headers=headers, params=params, json=data, timeout=30)
        response.raise_for_status() # Raise an exception for HTTP errors
        
        response_json = response.json()
        if 'candidates' in response_json and response_json['candidates']:
            generated_text = response_json['candidates'][0]['content']['parts'][0]['text']
            # Clean up potential leading/trailing whitespace or markdown issues
            return generated_text.strip()
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
        "per_page": num_images * 2, # Request more to ensure enough high-quality hits
        "safesearch": True
    }

    try:
        response = requests.get(PIXABAY_API_URL, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        image_urls = []
        # Prioritize 'webformatURL' for general use, or 'largeImageURL' for higher res if needed
        # We'll take up to num_images, filtering for good quality.
        for hit in data.get("hits", []):
            if hit.get("webformatURL"): # Check for a usable URL
                image_urls.append(hit["webformatURL"])
                if len(image_urls) >= num_images:
                    break
        
        downloaded_paths = []
        for i, url in enumerate(image_urls):
            file_name = f"image_{datetime.now().strftime('%Y%m%d%H%M%S')}_{i}.jpg"
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
    MOCK FUNCTION: Posts a message and multiple images to a Facebook Page.
    This is a complex process involving multiple API calls.
    You'd need to:
    1. Upload each photo one by one to a user's photos (or page photos) to get a photo ID.
    2. Then create a page post with the message and attach the photo IDs.
    
    See Facebook Graph API documentation for details:
    - Photo upload: https://developers.facebook.com/docs/graph-api/reference/page/photos/#creating
    - Page posts with attached photos: https://developers.facebook.com/docs/graph-api/reference/page/feed/#creating
    
    This mock function will just print what it *would* do.
    """
    print("\n--- MOCK FACEBOOK POSTING ---")
    print(f"Attempting to post to Facebook Page ID: {page_id}")
    print(f"Message:\n{textwrap.fill(message, width=80)}") # Wrap text for readability
    print("Images to upload:")
    if image_paths:
        for path in image_paths:
            print(f"- {path}")
    else:
        print("- No images to upload.")

    # In a real scenario, this would involve:
    # 1. Loop through image_paths, upload each image to Facebook, get its ID.
    #    requests.post(f"https://graph.facebook.com/{page_id}/photos", files={'source': open(path, 'rb')}, data={'access_token': access_token})
    # 2. Construct post data with message and attached_media (using the image IDs).
    #    requests.post(f"https://graph.facebook.com/{page_id}/feed", data={'message': message, 'attached_media': [...], 'access_token': access_token})
    
    print("\nMOCK: Successfully prepared post data (not actually posted to Facebook).")
    print("-----------------------------\n")
    return True # Simulate success

def cleanup_images():
    """Removes downloaded images after use."""
    import shutil
    if os.path.exists(IMAGES_DIR):
        print(f"Cleaning up temporary image directory: {IMAGES_DIR}")
        shutil.rmtree(IMAGES_DIR)

if __name__ == "__main__":
    character_data = load_character_data(CHARACTER_FILE)
    
    # --- Determine Post Type and Image Query ---
    # You could add logic here to randomly select post types,
    # or make it configurable via an environment variable or argument.
    
    # Example: Daily rotation of post types
    current_day = datetime.now().day
    if current_day % 4 == 0:
        post_type = "general_tip"
        image_query = "forest camping landscape"
    elif current_day % 4 == 1:
        post_type = "motivation"
        image_query = "mountain view inspiring"
    elif current_day % 4 == 2:
        post_type = "how_to"
        image_query = "survival skills nature"
    else:
        post_type = "anecdote"
        image_query = "camp campfire family"
        
    print(f"Generating a '{post_type}' post for Arthur...")

    # 1. Generate Post Text
    post_text = generate_gemini_post(character_data, post_type)

    if post_text:
        print("\n--- Generated Post Text ---")
        print(post_text)
        print("---------------------------\n")

        # 2. Search and Download Images
        image_paths = search_and_download_pixabay_images(image_query, num_images=5)

        if image_paths:
            print(f"Found and downloaded {len(image_paths)} images.")
        else:
            print("No images found or downloaded.")

        # 3. Post to Facebook (MOCK)
        if FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN:
            post_to_facebook(FACEBOOK_PAGE_ID, FACEBOOK_ACCESS_TOKEN, post_text, image_paths)
        else:
            print("Facebook Page ID or Access Token not set. Skipping Facebook post.")
        
        # 4. Clean up
        cleanup_images()
    else:
        print("Failed to generate post text. Aborting.")

