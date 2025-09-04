#!/usr/bin/env python3
"""
Anime Story Video Generator
- Generates a short anime-style story with Gemini
- Downloads images from Pollinations
- Narrates with Coqui TTS (multi-speaker fallback to single-speaker)
- Creates a video with FFmpeg
"""

import os
import argparse
import requests
import subprocess
import textwrap
import random
from pathlib import Path
from TTS.api import TTS
import google.generativeai as genai

# -------------------------
# Gemini: Generate Story
# -------------------------
def generate_story(api_key):
    print("🔮 Generating story...")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = (
        "Write a short emotional anime-style scene (about 200-300 words). "
        "End the text. Then give 5 short descriptive prompts for images "
        "that could illustrate the scene, in JSON list format."
    )

    response = model.generate_content(prompt)
    text = response.text

    # Split story and prompts
    if "--- PROMPTS ---" in text:
        story, prompts = text.split("--- PROMPTS ---", 1)
    else:
        story, prompts = text, "[]"

    return story.strip(), eval(prompts.strip())

# -------------------------
# Pollinations: Get Image
# -------------------------
def fetch_image(prompt, out_path):
    print(f"🖼 Downloading image for: {prompt}")
    url = f"https://image.pollinations.ai/prompt/{requests.utils.quote(prompt)}"
    r = requests.get(url)
    if r.status_code == 200:
        with open(out_path, "wb") as f:
            f.write(r.content)
    else:
        raise RuntimeError(f"Image download failed: {r.status_code}")

# -------------------------
# Coqui TTS with fallback
# -------------------------
def narrate(text, out_path):
    print("🎙 Generating narration...")
    try:
        # First try multi-speaker
        model_name = "tts_models/en/vctk/vits"
        speaker = "p225"  # female, neutral tone
        print(f" → Trying multi-speaker voice: {speaker}")
        tts = TTS(model_name)
        tts.tts_to_file(text=text, speaker=speaker, file_path=out_path)

    except Exception as e:
        print(f"⚠️ Multi-speaker failed: {e}")
        print(" → Falling back to single-speaker model...")
        model_name = "tts_models/en/ljspeech/tacotron2-DDC"
        tts = TTS(model_name)
        tts.tts_to_file(text=text, file_path=out_path)

# -------------------------
# Video Assembly
# -------------------------
def make_video(images, audio, out_path):
    print("🎬 Creating video...")

    # Get audio duration
    duration_cmd = [
        "ffprobe", "-i", audio,
        "-show_entries", "format=duration",
        "-v", "quiet", "-of", "csv=p=0"
    ]
    duration = float(subprocess.check_output(duration_cmd).decode().strip())

    # Calculate time per image
    time_per_img = duration / len(images)

    # Create temporary ffmpeg input file
    with open("images.txt", "w") as f:
        for img in images:
            f.write(f"file '{img}'\n")
            f.write(f"duration {time_per_img}\n")

    # Ensure last image stays until end
    f.write(f"file '{images[-1]}'\n")

    # Build video
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", "images.txt",
        "-i", audio,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-shortest",
        out_path
    ]
    subprocess.run(cmd, check=True)

# -------------------------
# Main
# -------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--gemini-key", required=True)
    args = parser.parse_args()

    out_dir = Path("generated_videos")
    out_dir.mkdir(exist_ok=True)

    # 1. Generate story + prompts
    story, prompts = generate_story(args.gemini_key)

    print("\n--- STORY ---\n")
    print(story)
    print("\n--- PROMPTS ---\n")
    print(prompts)

    # 2. Narration
    narration_file = out_dir / "narration.wav"
    narrate(story, narration_file)

    # 3. Download images
    images = []
    for i, prompt in enumerate(prompts):
        img_file = out_dir / f"img_{i}.jpg"
        fetch_image(prompt, img_file)
        images.append(str(img_file))

    # 4. Make video
    video_file = out_dir / "anime_story.mp4"
    make_video(images, str(narration_file), str(video_file))

    print(f"✅ Video created: {video_file}")

if __name__ == "__main__":
    main()