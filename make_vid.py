#!/usr/bin/env python3
"""
Anime Story Video Generator with Gemini + Coqui TTS
- Generates anime story with Gemini
- Narrates with Coqui TTS (with auto fallback voices)
- Fetches scene images from Pollinations
- Creates slideshow video matching narration length
"""

import os
import subprocess
import requests
from pathlib import Path
import google.generativeai as genai
from TTS.api import TTS
import argparse

# ---------------------------
# Config
# ---------------------------
OUTPUT_DIR = Path("generated_videos")
OUTPUT_DIR.mkdir(exist_ok=True)

# Preferred Coqui voice models in fallback order
VOICE_MODELS = [
    "tts_models/multilingual/multi-dataset/xtts_v2",   # most natural
    "tts_models/en/ljspeech/tacotron2-DDC",            # stable male voice
    "tts_models/en/ljspeech/glow-tts"                  # backup
]

# ---------------------------
# Gemini story generation
# ---------------------------
def generate_story(gemini_key: str) -> str:
    genai.configure(api_key=gemini_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = (
        "Write a complete anime-style short story narrated from the storyteller’s point of view. "
        "Make it engaging, emotional, and suitable for teenagers. Include vivid descriptions and a clear moral lesson. "
        "Length: about 4–5 paragraphs (around 300–400 words)."
    )
    response = model.generate_content(prompt)
    return response.text.strip()

# ---------------------------
# Pollinations images
# ---------------------------
def fetch_images(story: str, num_images: int = 12):
    """Fetch images for each story paragraph from Pollinations"""
    images = []
    paragraphs = [p for p in story.split("\n") if p.strip()]
    for i, para in enumerate(paragraphs[:num_images]):
        query = para.strip().replace(" ", "%20")
        url = f"https://image.pollinations.ai/prompt/{query}"
        img_path = OUTPUT_DIR / f"image_{i}.jpg"
        try:
            r = requests.get(url, timeout=30)
            with open(img_path, "wb") as f:
                f.write(r.content)
            images.append(str(img_path))
            print(f"✅ Image {i+1} saved.")
        except Exception as e:
            print(f"❌ Failed to fetch image {i+1}: {e}")
    return images

# ---------------------------
# Coqui TTS with fallback
# ---------------------------
def generate_audio(text: str) -> str:
    audio_path = OUTPUT_DIR / "narration.wav"

    for model in VOICE_MODELS:
        try:
            print(f"🎙️ Trying voice model: {model}")
            tts = TTS(model_name=model, progress_bar=False, gpu=False)
            tts.tts_to_file(text=text, file_path=str(audio_path))
            print(f"✅ Narration generated with {model}")
            return str(audio_path)
        except Exception as e:
            print(f"❌ Failed with {model}: {e}")

    raise RuntimeError("All TTS models failed. Cannot generate narration.")

def get_audio_duration(audio_file: str) -> float:
    """Get audio length in seconds using ffprobe"""
    cmd = [
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration", "-of",
        "default=noprint_wrappers=1:nokey=1", audio_file
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return float(result.stdout.strip())

# ---------------------------
# Video creation
# ---------------------------
def create_video(images, audio_file, output_file):
    duration = get_audio_duration(audio_file)
    num_images = len(images)
    per_image = duration / num_images

    # Build ffmpeg concat input file
    list_file = OUTPUT_DIR / "images.txt"
    with open(list_file, "w") as f:
        for img in images:
            f.write(f"file '{img}'\n")
            f.write(f"duration {per_image}\n")
        # repeat last image to prevent cutoff
        f.write(f"file '{images[-1]}'\n")

    # Create slideshow
    temp_video = OUTPUT_DIR / "slideshow.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_file), "-vsync", "vfr", "-pix_fmt", "yuv420p",
        str(temp_video)
    ], check=True)

    # Combine with narration
    subprocess.run([
        "ffmpeg", "-y", "-i", str(temp_video), "-i", audio_file,
        "-c:v", "copy", "-c:a", "aac", "-shortest", str(output_file)
    ], check=True)

# ---------------------------
# Main
# ---------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--gemini-key", required=True, help="Gemini API Key")
    args = parser.parse_args()

    # 1. Generate story
    story = generate_story(args.gemini_key)
    print("\n===== Generated Story =====\n", story, "\n===========================\n")

    # 2. Fetch images
    images = fetch_images(story, num_images=12)
    if not images:
        print("❌ No images fetched. Exiting.")
        return

    # 3. Generate narration
    audio_file = generate_audio(story)

    # 4. Create video
    output_file = OUTPUT_DIR / "anime_story.mp4"
    create_video(images, audio_file, output_file)

    print("✅ Final video generated:", output_file)

if __name__ == "__main__":
    main()