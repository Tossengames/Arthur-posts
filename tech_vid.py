#!/usr/bin/env python3
"""
Tech News Video Generator
Uses RSS feeds, Gemini AI, Pollinations.ai, Coqui-TTS, and FFmpeg
"""

import os
import json
import requests
import subprocess
import re
import argparse
import feedparser
from datetime import datetime
from pathlib import Path
import google.generativeai as genai
import torch
from TTS.api import TTS
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

# Configuration
CONFIG = {
    "video_duration": 90,  # 90 seconds video
    "output_dir": "tech_news_videos",
    "gemini_model": "gemini-2.0-flash",
    "coqui_model": "tts_models/en/ljspeech/tacotron2-DDC",  # Coqui TTS model
    "coqui_vocoder": "vocoder_models/en/ljspeech/hifigan_v2",  # Coqui vocoder
    "max_scenes": 4,
    "rss_feeds": [
        "https://techcrunch.com/feed",
        "https://www.wired.com/feed/rss",
        "https://feeds.feedburner.com/venturebeat",
        "https://arstechnica.com/feed"
    ],
    "pollinations_style": "tech news, digital art, futuristic, clean background"
}

def setup_directories():
    """Create necessary directories for the project"""
    Path(CONFIG["output_dir"]).mkdir(exist_ok=True)
    Path(f"{CONFIG['output_dir']}/images").mkdir(exist_ok=True)
    Path(f"{CONFIG['output_dir']}/audio").mkdir(exist_ok=True)
    Path(f"{CONFIG['output_dir']}/cache").mkdir(exist_ok=True)

def init_gemini(api_key):
    """Initialize the Gemini AI client"""
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(CONFIG["gemini_model"])

def init_coqui_tts():
    """Initialize Coqui TTS"""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tts = TTS(CONFIG["coqui_model"]).to(device)
    return tts

def fetch_tech_news(rss_url):
    """Fetch latest tech news from RSS feed"""
    try:
        feed = feedparser.parse(rss_url)
        if not feed.entries:
            return None
            
        # Get the latest news entry
        latest_entry = feed.entries[0]
        
        news_data = {
            "title": latest_entry.get('title', 'Tech News Update'),
            "summary": latest_entry.get('summary', ''),
            "content": latest_entry.get('content', [{}])[0].get('value', '') if latest_entry.get('content') else '',
            "published": latest_entry.get('published', ''),
            "link": latest_entry.get('link', ''),
            "image_url": extract_image_from_entry(latest_entry)
        }
        
        return news_data
    except Exception as e:
        print(f"Error fetching RSS feed: {e}")
        return None

def extract_image_from_entry(entry):
    """Extract image URL from RSS entry using multiple methods"""
    # Method 1: Check for media content
    if hasattr(entry, 'media_content'):
        for media in entry.media_content:
            if media.get('type', '').startswith('image'):
                return media['url']
    
    # Method 2: Check for enclosures
    if hasattr(entry, 'enclosures'):
        for enclosure in entry.enclosures:
            if enclosure.get('type', '').startswith('image'):
                return enclosure['href']
    
    # Method 3: Parse HTML content for images [citation:3][citation:8]
    content = entry.get('content', [{}])[0].get('value', '') if entry.get('content') else entry.get('summary', '')
    
    # Regex pattern to find image URLs
    img_patterns = [
        r'src="([^"]+\.(jpg|jpeg|png|gif))"',
        r'src=\'([^\']+\.(jpg|jpeg|png|gif))\'',
        r'url="([^"]+\.(jpg|jpeg|png|gif))"',
        r'url\(([^)]+\.(jpg|jpeg|png|gif))\)'
    ]
    
    for pattern in img_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            return matches[0][0]
    
    return None

def rewrite_news_with_ai(gemini_model, news_data):
    """Rewrite news content using Gemini AI"""
    prompt = f"""
    Rewrite this tech news article in an engaging, conversational style suitable for a 90-second video narration.
    
    Original Title: {news_data['title']}
    Original Content: {news_data.get('content', news_data.get('summary', ''))}
    
    Requirements:
    - Keep it concise (around 150-200 words)
    - Make it engaging and easy to understand
    - Add a catchy introduction and conclusion
    - Maintain factual accuracy
    - Use a conversational tone
    - Structure it for smooth audio narration
    
    Format the output as JSON with this structure:
    {{
        "title": "Rewritten title",
        "narration": "Full rewritten content for narration",
        "key_points": ["point1", "point2", "point3"]
    }}
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        rewritten_json = extract_json_from_text(response.text)
        
        # Save the rewritten news
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        news_file = f"{CONFIG['output_dir']}/news_{timestamp}.json"
        
        with open(news_file, 'w') as f:
            json.dump({
                "original": news_data,
                "rewritten": rewritten_json
            }, f, indent=2)
            
        return rewritten_json
    except Exception as e:
        print(f"Error rewriting news: {e}")
        return None

def extract_json_from_text(text):
    """Extract JSON from Gemini response text"""
    try:
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except:
        pass
    
    # Fallback
    return {
        "title": "Tech News Update",
        "narration": (
            "Welcome to today's tech news update. In the world of technology, "
            "there are always exciting developments happening. Today's news "
            "brings us interesting insights about the latest advancements. "
            "Stay tuned to learn more about what's shaping our digital future."
        ),
        "key_points": ["Latest tech developments", "Industry insights", "Future trends"]
    }

def download_or_generate_images(news_data, rewritten_data):
    """Download images from RSS or generate fallback images"""
    image_paths = []
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Try to download image from RSS
    if news_data.get('image_url'):
        try:
            response = requests.get(news_data['image_url'], timeout=30)
            if response.status_code == 200:
                image_path = f"{CONFIG['output_dir']}/images/news_image_{timestamp}.jpg"
                with open(image_path, 'wb') as f:
                    f.write(response.content)
                image_paths.append(image_path)
                print("Downloaded news image from RSS")
        except Exception as e:
            print(f"Error downloading RSS image: {e}")
    
    # Generate additional images based on content
    if len(image_paths) < CONFIG["max_scenes"]:
        scenes_needed = CONFIG["max_scenes"] - len(image_paths)
        
        for i in range(scenes_needed):
            # Create prompt based on news content
            scene_prompt = f"tech news {rewritten_data['title']} {CONFIG['pollinations_style']}"
            scene_url = f"https://image.pollinations.ai/prompt/{scene_prompt}?width=1024&height=576&nologo=true"
            
            try:
                response = requests.get(scene_url, timeout=30)
                scene_path = f"{CONFIG['output_dir']}/images/generated_scene_{timestamp}_{i+1}.png"
                
                with open(scene_path, 'wb') as f:
                    f.write(response.content)
                
                image_paths.append(scene_path)
                print(f"Generated image {i+1}")
            except Exception as e:
                print(f"Error generating image {i+1}: {e}")
                scene_path = create_fallback_image(rewritten_data['title'], timestamp, i+1)
                image_paths.append(scene_path)
    
    return image_paths

def create_fallback_image(title, timestamp, index):
    """Create a simple fallback image"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        img = Image.new('RGB', (1024, 576), color=(41, 128, 185))
        d = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("Arial", 30)
        except:
            font = ImageFont.load_default()
        
        d.text((100, 100), f"Tech News: {title[:50]}", fill=(255, 255, 255), font=font)
        d.text((100, 150), f"Scene {index}", fill=(255, 255, 255), font=font)
        
        scene_path = f"{CONFIG['output_dir']}/images/fallback_scene_{timestamp}_{index}.png"
        img.save(scene_path)
        return scene_path
    except:
        return f"{CONFIG['output_dir']}/images/fallback.png"

def generate_voiceover(coqui_tts, narration_text):
    """Generate voiceover using Coqui TTS"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    audio_path = f"{CONFIG['output_dir']}/audio/voiceover_{timestamp}.wav"
    
    try:
        # Generate speech using Coqui TTS [citation:1][citation:5]
        coqui_tts.tts_to_file(
            text=narration_text,
            file_path=audio_path
        )
        print("Generated voiceover with Coqui TTS")
        return audio_path
    except Exception as e:
        print(f"Error generating voiceover with Coqui TTS: {e}")
        return None

def create_video(news_data, image_paths, audio_path):
    """Create the final video using FFmpeg"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"{CONFIG['output_dir']}/tech_news_{timestamp}.mp4"
    
    if not image_paths or not audio_path:
        print("Missing images or audio for video creation")
        return None
    
    try:
        # Get audio duration to calculate scene timing
        result = subprocess.run([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", audio_path
        ], capture_output=True, text=True, timeout=30)
        
        audio_duration = float(result.stdout.strip())
        scene_duration = audio_duration / len(image_paths)
        
        # Create FFmpeg command
        inputs = []
        filter_complex = ""
        
        for i, image_path in enumerate(image_paths):
            inputs.extend(["-loop", "1", "-t", str(scene_duration), "-i", image_path])
            filter_complex += f"[{i}:v]scale=1024:576,setsar=1,format=yuv420p[v{i}];"
        
        filter_complex += "".join([f"[v{i}]" for i in range(len(image_paths))])
        filter_complex += f"concat=n={len(image_paths)}:v=1:a=0[outv]"
        
        # Create video with images
        cmd = [
            "ffmpeg", "-y",
            *inputs,
            "-filter_complex", filter_complex,
            "-map", "[outv]",
            "-c:v", "libx264", "-r", "30", "-preset", "fast",
            "-t", str(audio_duration),  # Match audio duration
            f"{CONFIG['output_dir']}/temp_video.mp4"
        ]
        
        subprocess.run(cmd, check=True, timeout=300)
        
        # Add audio to video
        subprocess.run([
            "ffmpeg", "-y",
            "-i", f"{CONFIG['output_dir']}/temp_video.mp4",
            "-i", audio_path,
            "-c:v", "copy", "-c:a", "aac", "-shortest",
            "-movflags", "+faststart",
            output_path
        ], check=True, timeout=300)
        
        # Clean up temp file
        os.remove(f"{CONFIG['output_dir']}/temp_video.mp4")
        
        print(f"Created video: {output_path}")
        return output_path
        
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e}")
        return None
    except Exception as e:
        print(f"Error creating video: {e}")
        return None

def add_subtitles(video_path, narration_text):
    """Add subtitles to the video"""
    try:
        # Split narration into manageable chunks for subtitles
        words = narration_text.split()
        chunks = [' '.join(words[i:i+5]) for i in range(0, len(words), 5)]
        
        # Create SRT file
        srt_path = f"{CONFIG['output_dir']}/temp_subtitles.srt"
        with open(srt_path, 'w') as f:
            for i, chunk in enumerate(chunks):
                start_time = i * 3  # 3 seconds per chunk
                end_time = start_time + 3
                f.write(f"{i+1}\n")
                f.write(f"00:00:{start_time:02d},000 --> 00:00:{end_time:02d},000\n")
                f.write(f"{chunk}\n\n")
        
        # Burn subtitles into video
        output_with_subs = video_path.replace('.mp4', '_subtitled.mp4')
        
        subprocess.run([
            "ffmpeg", "-y",
            "-i", video_path,
            "-vf", f"subtitles={srt_path}:force_style='Fontsize=24,PrimaryColour=&HFFFFFF&'",
            "-c:a", "copy",
            output_with_subs
        ], check=True, timeout=300)
        
        os.remove(srt_path)
        os.remove(video_path)
        
        print(f"Added subtitles to video: {output_with_subs}")
        return output_with_subs
        
    except Exception as e:
        print(f"Error adding subtitles: {e}")
        return video_path

async def main():
    parser = argparse.ArgumentParser(description="Generate tech news videos from RSS feeds")
    parser.add_argument("--gemini-key", required=True, help="Google Gemini API key")
    args = parser.parse_args()
    
    setup_directories()
    
    # Initialize AI services
    gemini_model = init_gemini(args.gemini_key)
    coqui_tts = init_coqui_tts()
    
    # Fetch tech news from RSS feeds
    news_data = None
    for rss_url in CONFIG["rss_feeds"]:
        news_data = fetch_tech_news(rss_url)
        if news_data:
            print(f"Fetched news from {rss_url}: {news_data['title']}")
            break
    
    if not news_data:
        print("Failed to fetch news from any RSS feed")
        return
    
    # Rewrite news with AI
    rewritten_data = rewrite_news_with_ai(gemini_model, news_data)
    if not rewritten_data:
        print("Failed to rewrite news")
        return
    
    print(f"Rewritten news: {rewritten_data['title']}")
    
    # Get or generate images
    image_paths = download_or_generate_images(news_data, rewritten_data)
    print(f"Prepared {len(image_paths)} images")
    
    # Generate voiceover
    audio_path = generate_voiceover(coqui_tts, rewritten_data['narration'])
    if not audio_path:
        print("Failed to generate voiceover")
        return
    
    # Create video
    video_path = create_video(news_data, image_paths, audio_path)
    if not video_path:
        print("Failed to create video")
        return
    
    # Add subtitles
    final_video_path = add_subtitles(video_path, rewritten_data['narration'])
    
    print(f"Final video created: {final_video_path}")
    print("Tech news video generation completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())