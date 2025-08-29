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
    "video_duration": 60,  # increased from 10 to 60 seconds
    "output_dir": "generated_videos",
    "gemini_model": "gemini-2.0-flash",
    "tts_voice": "en-US-AriaNeural",
    "anime_style": "anime style, vibrant colors, detailed background",
    "max_scenes": 3  # Reduced for 10-second video
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
    """Generate a unique anime story using Gemini AI"""
    selected_anime = random.choice(ANIME_INSPIRATIONS)
    
    prompt = f"""
    Create a very short 10-second story inspired by {selected_anime} that has value and lesson for teenagers.
    The story should include:
    1. A clear moral lesson or value
    2. Emotional depth appropriate for the source material
    3. Only {CONFIG['max_scenes']} distinct scenes with descriptions
    4. 1-2 main characters
    5. Brief dialogue and narration
    
    Format the output as JSON with the following structure:
    {{
        "title": "Story title",
        "anime_inspiration": "{selected_anime}",
        "scenes": [
            {{
                "scene_number": 1,
                "description": "Scene description including setting, characters and action",
                "image_prompt": "Detailed prompt for complete scene image with characters",
                "dialogue": [
                    {{
                        "character": "Character name",
                        "emotion": "Emotion for this line",
                        "text": "Very brief dialogue text"
                    }}
                ],
                "narration": {{
                    "text": "Very brief narration text",
                    "emotion": "Narration emotion"
                }}
            }}
        ],
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
    
    return {
        "title": "The Determined Hero",
        "anime_inspiration": "Naruto",
        "scenes": [
            {
                "scene_number": 1,
                "description": "A young hero trains in a forest, determined to become stronger",
                "image_prompt": "Anime hero training in a beautiful forest, determined expression, dynamic pose, vibrant colors",
                "dialogue": [
                    {
                        "character": "Hero",
                        "emotion": "determined",
                        "text": "I will never give up!"
                    }
                ],
                "narration": {
                    "text": "The hero trained every day to become stronger",
                    "emotion": "inspiring"
                }
            }
        ],
        "moral_lesson": "Hard work and determination lead to growth"
    }

def generate_images(story_data):
    """Generate complete scene images using Pollinations.ai"""
    image_paths = []
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for scene in story_data["scenes"]:
        scene_prompt = f"{scene['image_prompt']}, {CONFIG['anime_style']}, high quality, complete scene"
        scene_url = f"https://image.pollinations.ai/prompt/{scene_prompt}?width=1024&height=576&nologo=true"
        
        try:
            response = requests.get(scene_url, timeout=30)
            scene_path = f"{CONFIG['output_dir']}/images/scene_{timestamp}_{scene['scene_number']}.png"
            
            with open(scene_path, 'wb') as f:
                f.write(response.content)
            
            image_paths.append(scene_path)
            print(f"Generated image for scene {scene['scene_number']}")
        except Exception as e:
            print(f"Error generating image for scene {scene['scene_number']}: {e}")
            scene_path = create_fallback_image(scene, timestamp)
            image_paths.append(scene_path)
    
    return image_paths

def create_fallback_image(scene, timestamp):
    """Create a simple fallback image using PIL"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        img = Image.new('RGB', (1024, 576), color=(73, 109, 137))
        d = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("Arial", 30)
        except:
            font = ImageFont.load_default()
        
        d.text((100, 100), f"Scene: {scene['description'][:50]}...", fill=(255, 255, 255), font=font)
        d.text((100, 150), f"Inspired by: {CONFIG['anime_style']}", fill=(255, 255, 255), font=font)
        
        scene_path = f"{CONFIG['output_dir']}/images/fallback_scene_{timestamp}_{scene['scene_number']}.png"
        img.save(scene_path)
        return scene_path
    except:
        return f"{CONFIG['output_dir']}/images/fallback.png"

async def generate_voiceover(story_data):
    """Generate voiceover using Edge-TTS"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    audio_files = []
    
    all_text = []
    for scene in story_data["scenes"]:
        all_text.append(scene["narration"]["text"])
        for dialogue in scene["dialogue"]:
            all_text.append(dialogue["text"])
    
    full_script = " ".join(all_text)
    
    try:
        communicate = edge_tts.Communicate(
            full_script,
            CONFIG["tts_voice"],
            rate="+0%"
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
    
    scene_duration = CONFIG["video_duration"] / len(story_data["scenes"])
    
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