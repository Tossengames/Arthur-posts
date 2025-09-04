#!/usr/bin/env python3
"""
Anime Short Story Video Generator
Uses Gemini AI, Pollinations.ai, Coqui TTS, and FFmpeg
"""

import os
import json
import requests
import subprocess
import random
import re
from datetime import datetime
from pathlib import Path
from TTS.api import TTS  # Coqui TTS

# ---------------- CONFIG ---------------- #
CONFIG = {
    "video_duration": 60,
    "output_dir": "generated_videos",
    "gemini_model": "gemini-2.0-flash",
    "tts_model": "tts_models/en/ljspeech/tacotron2-DDC",  # Coqui TTS model
    "anime_style": "anime style, vibrant colors, detailed background",
    "max_scenes": 3
}

ANIME_INSPIRATIONS = [
    "Naruto", "One Piece", "Attack on Titan", "My Hero Academia",
    "Demon Slayer", "Jujutsu Kaisen", "Fullmetal Alchemist",
    "Tokyo Ghoul", "Death Note", "Bleach"
]

# ---------------- HELPERS ---------------- #

def extract_json_from_text(text):
    """Extract JSON block from Gemini response"""
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
    except Exception as e:
        print(f"Error parsing JSON: {e}")
    return {}

# ---------------- STORY GENERATION ---------------- #

def generate_story():
    """Generate a unique anime story (narrator POV) using Gemini AI"""
    selected_anime = random.choice(ANIME_INSPIRATIONS)

    prompt = f"""
    Write a complete, short story (around {CONFIG["video_duration"]} seconds when narrated)
    from the **narrator's point of view**, inspired by {selected_anime}.
    
    Requirements:
    - Story must be fun, engaging, and easy to follow for teenagers
    - Narrator should guide the story clearly, with occasional character dialogue
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

    # 🔹 Replace this with your Gemini API call
    print("⚠️ Gemini API call not implemented here, using placeholder story...")
    story_json = {
        "title": "The Ninja’s Lesson",
        "anime_inspiration": selected_anime,
        "narration": f"Inspired by {selected_anime}, I, the narrator, tell you the tale of a young warrior who faced doubt, but discovered courage within...",
        "moral_lesson": "Believe in yourself, even when the path is unclear."
    }

    # Save story
    Path(CONFIG["output_dir"]).mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    story_file = f"{CONFIG['output_dir']}/story_{timestamp}.json"
    with open(story_file, 'w') as f:
        json.dump(story_json, f, indent=2)

    return story_json

# ---------------- VOICEOVER (COQUI) ---------------- #

def generate_voiceover(story_data):
    """Generate voiceover using Coqui TTS"""
    narration_text = story_data.get("narration", "")
    if not narration_text:
        print("No narration text found.")
        return None

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    audio_dir = Path(CONFIG["output_dir"]) / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)
    audio_path = audio_dir / f"voiceover_{timestamp}.wav"

    print("🎤 Generating voiceover with Coqui TTS...")
    try:
        tts = TTS(model_name=CONFIG["tts_model"], progress_bar=False, gpu=False)
        tts.tts_to_file(text=narration_text, file_path=str(audio_path))
        print(f"✅ Voiceover saved at {audio_path}")
        return str(audio_path)
    except Exception as e:
        print(f"❌ Error generating voiceover: {e}")
        return None

# ---------------- IMAGE GENERATION ---------------- #

def generate_image(prompt, out_path):
    """Generate image using Pollinations API"""
    try:
        url = f"https://image.pollinations.ai/prompt/{prompt}"
        response = requests.get(url)
        if response.status_code == 200:
            with open(out_path, "wb") as f:
                f.write(response.content)
            print(f"🖼️ Image saved at {out_path}")
            return out_path
        else:
            print("❌ Failed to generate image")
            return None
    except Exception as e:
        print(f"❌ Error fetching image: {e}")
        return None

# ---------------- VIDEO CREATION ---------------- #

def create_video(story_data, audio_path):
    """Combine images + narration into video"""
    video_dir = Path(CONFIG["output_dir"]) / "videos"
    video_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = video_dir / f"story_{timestamp}.mp4"

    # Generate 1-3 images
    img_paths = []
    for i in range(CONFIG["max_scenes"]):
        scene_prompt = f"{story_data['anime_inspiration']} scene, {CONFIG['anime_style']}"
        img_path = Path(CONFIG["output_dir"]) / f"scene_{i}_{timestamp}.jpg"
        if generate_image(scene_prompt, img_path):
            img_paths.append(str(img_path))

    if not img_paths or not audio_path:
        print("❌ Missing images or audio. Cannot create video.")
        return None

    # Make FFmpeg slideshow with audio
    img_list_file = Path(CONFIG["output_dir"]) / "img_list.txt"
    with open(img_list_file, "w") as f:
        for img in img_paths:
            f.write(f"file '{img}'\n")
            f.write(f"duration {CONFIG['video_duration'] / len(img_paths)}\n")

    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(img_list_file),
        "-i", audio_path, "-c:v", "libx264", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "192k", "-shortest", str(output_path)
    ]

    try:
        subprocess.run(cmd, check=True)
        print(f"✅ Video created at {output_path}")
        return str(output_path)
    except Exception as e:
        print(f"❌ Error creating video: {e}")
        return None

# ---------------- MAIN ---------------- #

def main():
    story_data = generate_story()
    audio_path = generate_voiceover(story_data)
    if audio_path:
        create_video(story_data, audio_path)

if __name__ == "__main__":
    main()