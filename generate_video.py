#!/usr/bin/env python3
"""
Simplified Anime Short Story Video Generator
Uses Gemini AI, Pollinations.ai, Edge-TTS, and FFmpeg
"""

import os
import json
import requests
import subprocess
import random
import re
import argparse
from datetime import datetime
from pathlib import Path
import google.generativeai as genai
import edge_tts
import asyncio

# Configuration
CONFIG = {
    "video_duration": 60,  # ~1 minute video
    "output_dir": "generated_videos",
    "gemini_model": "gemini-2.0-flash",
    "tts_voice": "en-US-GuyNeural",  # Male voice for narration
    "anime_style": "anime style, vibrant colors, detailed background",
    "max_scenes": 3
}

# Anime inspirations list
ANIME_INSPIRATIONS = [
    "Naruto", "One Piece", "Attack on Titan", "My Hero Academia", 
    "Demon Slayer", "Fullmetal Alchemist: Brotherhood", "Sailor Moon",
    "Dragon Ball Z", "Spirited Away", "Your Name", "Hunter x Hunter",
    "Jujutsu Kaisen", "Haikyuu", "Pokemon", "Studio Ghibli films"
]

def setup_directories():
    """Create necessary directories for the project"""
    Path(CONFIG["output_dir"]).mkdir(exist_ok=True)
    Path(f"{CONFIG['output_dir']}/images").mkdir(exist_ok=True)
    Path(f"{CONFIG['output_dir']}/audio").mkdir(exist_ok=True)

def init_gemini(api_key):
    """Initialize the Gemini AI client"""
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(CONFIG["gemini_model"])

def generate_story(gemini_model):
    """Generate a complete anime story using Gemini AI"""
    selected_anime = random.choice(ANIME_INSPIRATIONS)
    
    prompt = f"""
    Write a complete, short story (around {CONFIG["video_duration"]} seconds when narrated)
    from the **narrator's point of view**, inspired by {selected_anime}.
    
    Requirements:
    - Story must be fun, engaging, and easy to follow for teenagers
    - Narrator should guide the story clearly, with occasional character dialogue in quotes
    - Include emotional depth appropriate to the anime inspiration
    - End with a clear moral lesson teenagers can learn from
    - The story should naturally flow as one piece of narration
    
    Format the output as JSON with this structure:
    {{
        "title": "Story title",
        "anime_inspiration": "{selected_anime}",
        "narration": "Full story narration text from narrator POV, including any dialogue in quotes",
        "moral_lesson": "The moral lesson of the story"
    }}
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        story_json = extract_json_from_text(response.text)
        
        # Save the story
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        story_file = f"{CONFIG['output_dir']}/story_{timestamp}.json"
        
        with open(story_file, 'w') as f:
            json.dump(story_json, f, indent=2)
            
        return story_json
    except Exception as e:
        print(f"Error generating story: {e}")
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
        "title": "The Determined Hero",
        "anime_inspiration": "Naruto",
        "narration": (
            "In a quiet forest, I watched a young hero train tirelessly. "
            "Every strike and every breath carried his determination. "
            "He whispered to himself, 'I will never give up!' "
            "Day after day, his spirit only grew stronger. "
            "Through hardship, he learned that true strength is born from persistence."
        ),
        "moral_lesson": "Hard work and determination lead to growth"
    }

def generate_images(story_data):
    """Generate background images using Pollinations.ai"""
    image_paths = []
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for i in range(CONFIG["max_scenes"]):
        scene_prompt = f"{story_data['anime_inspiration']} inspired scene, {CONFIG['anime_style']}, high quality, cinematic"
        scene_url = f"https://image.pollinations.ai/prompt/{scene_prompt}?width=1024&height=576&nologo=true"
        
        try:
            response = requests.get(scene_url, timeout=30)
            scene_path = f"{CONFIG['output_dir']}/images/scene_{timestamp}_{i+1}.png"
            
            with open(scene_path, 'wb') as f:
                f.write(response.content)
            
            image_paths.append(scene_path)
            print(f"Generated image {i+1}")
        except Exception as e:
            print(f"Error generating image {i+1}: {e}")
            scene_path = create_fallback_image(story_data['anime_inspiration'], timestamp, i+1)
            image_paths.append(scene_path)
    
    return image_paths

def create_fallback_image(inspiration, timestamp, index):
    """Create a simple fallback image using PIL"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        img = Image.new('RGB', (1024, 576), color=(73, 109, 137))
        d = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("Arial", 30)
        except:
            font = ImageFont.load_default()
        
        d.text((100, 100), f"Scene {index}", fill=(255, 255, 255), font=font)
        d.text((100, 150), f"Inspired by: {inspiration}", fill=(255, 255, 255), font=font)
        
        scene_path = f"{CONFIG['output_dir']}/images/fallback_scene_{timestamp}_{index}.png"
        img.save(scene_path)
        return scene_path
    except:
        return f"{CONFIG['output_dir']}/images/fallback.png"

async def generate_voiceover(story_data):
    """Generate voiceover using Edge-TTS"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    audio_files = []
    
    full_script = story_data.get("narration", "")
    
    try:
        communicate = edge_tts.Communicate(
            full_script,
            CONFIG["tts_voice"],
            rate="+0%"  # Keep pacing natural
        )
        
        audio_path = f"{CONFIG['output_dir']}/audio/voiceover_{timestamp}.mp3"
        await communicate.save(audio_path)
        audio_files.append(audio_path)
        print("Generated voiceover")
    except Exception as e:
        print(f"Error generating voiceover: {e}")
    
    return audio_files

def create_video(story_data, image_paths, audio_files):
    """Create the final video using FFmpeg"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"{CONFIG['output_dir']}/video_{timestamp}.mp4"
    
    scene_duration = CONFIG["video_duration"] / len(image_paths)
    
    try:
        inputs = []
        filter_complex = ""
        for i, image_path in enumerate(image_paths):
            inputs.extend(["-loop", "1", "-t", str(scene_duration), "-i", image_path])
            filter_complex += f"[{i}:v]scale=1024:576,setsar=1[v{i}];"
        
        filter_complex += "".join([f"[v{i}]" for i in range(len(image_paths))])
        filter_complex += f"concat=n={len(image_paths)}:v=1:a=0[outv]"
        
        cmd = [
            "ffmpeg", "-y",
            *inputs,
            "-filter_complex", filter_complex,
            "-map", "[outv]",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
            output_path
        ]
        
        subprocess.run(cmd, check=True, timeout=300)
        
        if audio_files:
            temp_video = output_path
            final_output = output_path.replace(".mp4", "_with_audio.mp4")
            
            subprocess.run([
                "ffmpeg", "-y", "-i", temp_video,
                "-i", audio_files[0],
                "-c:v", "copy", "-c:a", "aac", "-shortest",
                final_output
            ], check=True, timeout=300)
            
            os.remove(temp_video)
            output_path = final_output
        
        print(f"Created video: {output_path}")
        return output_path
    
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error (exit code {e.returncode}): {e.stderr.decode() if e.stderr else 'No error details'}")
        return None
    except Exception as e:
        print(f"Error creating video: {e}")
        return None

async def main():
    parser = argparse.ArgumentParser(description="Generate anime story videos")
    parser.add_argument("--gemini-key", required=True, help="Google Gemini API key")
    args = parser.parse_args()
    
    setup_directories()
    
    gemini_model = init_gemini(args.gemini_key)
    
    story_data = generate_story(gemini_model)
    if not story_data:
        print("Failed to generate story")
        return
    
    print(f"Generated story: {story_data['title']}")
    print(f"Inspired by: {story_data['anime_inspiration']}")
    print(f"Moral: {story_data['moral_lesson']}")
    
    image_paths = generate_images(story_data)
    print(f"Generated {len(image_paths)} images")
    
    audio_files = await generate_voiceover(story_data)
    print(f"Generated {len(audio_files)} audio files")
    
    video_path = create_video(story_data, image_paths, audio_files)
    if not video_path:
        print("Failed to create video")
        return
    
    print(f"Created video: {video_path}")
    print("Video generation completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())