import os
import sys
import time
from simple_image_download import simple_image_download as simp
from pathlib import Path

def main():
    # Get input from environment variables
    keywords_str = os.getenv('KEYWORDS', '')
    image_count_str = os.getenv('IMAGE_COUNT', '5')
    
    # Validate and parse inputs
    if not keywords_str.strip():
        print("ERROR: No keywords provided. Please provide comma-separated keywords.")
        sys.exit(1)
    
    try:
        image_count = int(image_count_str)
        if image_count <= 0:
            print("ERROR: Image count must be a positive integer.")
            sys.exit(1)
    except ValueError:
        print(f"ERROR: Invalid image count '{image_count_str}'. Must be an integer.")
        sys.exit(1)
    
    keywords = [keyword.strip() for keyword in keywords_str.split(',') if keyword.strip()]
    
    # Create output directory if it doesn't exist
    output_folder = "downloaded_images"
    Path(output_folder).mkdir(parents=True, exist_ok=True)
    
    # Initialize downloader
    downloader = simp.simple_image_download()
    
    # Download images for each keyword
    for keyword in keywords:
        print(f"Downloading {image_count} images for keyword: '{keyword}'")
        try:
            downloader.download(keyword, image_count, output_dir=output_folder)
            print(f"Completed downloading images for '{keyword}'")
            
            # Add a small delay between keywords to avoid rate limiting
            if len(keywords) > 1:
                time.sleep(2)
                
        except Exception as e:
            print(f"ERROR: Failed to download images for '{keyword}': {str(e)}")
            continue
    
    print("All image downloads completed!")
    
    # Show summary of downloaded files
    total_files = 0
    for keyword in keywords:
        keyword_folder = os.path.join(output_folder, keyword)
        if os.path.exists(keyword_folder):
            files = os.listdir(keyword_folder)
            print(f"Downloaded {len(files)} images for '{keyword}'")
            total_files += len(files)
    
    print(f"Total images downloaded: {total_files}")

if __name__ == "__main__":
    main()