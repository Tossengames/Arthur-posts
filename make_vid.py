#!/usr/bin/env python3
"""
Anime Short Story Video Generator
Uses Gemini AI for story + prompts, Coqui TTS for narration,
and FFmpeg for video assembly.
"""

import os
import re
import json
import requests
import subprocess
import argparse
from pathlib import Path
from PIL import Image
from TTS.api import TTS

# ---------------- CONFIG ----------------
OUTPUT_DIR = Path("generated_videos")
FALLBACK_IMAGE = "fallback.jpg"  # put a simple bg image in repo
NUM_IMAGES = 8  # default if prompts fail
# ----------------------------------------

def ask_gemini(api_key, prompt):
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(prompt)
    return response.text

def parse_prompts(output: str):
    """Extract scene prompts JSON from Gemini output."""
    try:
        start = output.index("[")
        end = output.rindex("]") + 1
        json_str = output[start:end]
        prompts = json.loads(json_str)
        if isinstance(prompts, list) and prompts:
            return prompts
        else:
            print("⚠️ No valid prompts found, using fallback.")
            return [{"description": "A calm anime sky background",
                     "style": "anime, scenic"}]
    except Exception as e:
        print(f"⚠️ Failed to parse prompts: {e}")
        return [{"description": "A calm anime sky background",
                 "style": "anime, scenic"}]

def generate_image(prompt, idx):
    """Generate an image using Pollinations API."""
    safe_prompt = requests.utils.quote(f"{prompt['description']}, {prompt['style']}")
    url = f"https://image.pollinations.ai/prompt/{safe_prompt}?nologo=true&size=1024x576"
    out_file = OUTPUT_DIR / f"scene_{idx:03d}.jpg"

    if out_file.exists():
        print(f"✅ Using cached {out_file}")
        return str(out_file)

    r = requests.get(url, timeout=60)
    if r.status_code == 200:
        with open(out_file, "wb") as f:
            f.write(r.content)
        return str(out_file)
    else:
        print(f"⚠️ Failed image {idx}, using fallback.")
        return FALLBACK_IMAGE

def generate_narration(text, out_file):
    """Generate narration with fallback TTS models."""
    try:
        print("🎙 Trying multi-speaker (p225)")
        tts = TTS("tts_models/en/vctk/vits", progress_bar=False, gpu=False)
        tts.tts_to_file(text=text, file_path=out_file, speaker="p225")
    except Exception as e:
        print(f"⚠️ Multi-speaker failed ({e}), using single-speaker.")
        tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)
        tts.tts_to_file(text=text, file_path=out_file)

def get_audio_duration(file_path):
    """Get audio duration in seconds via ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration", "-of", "default=noprint_wrappers=1:nokey=1",
         str(file_path)],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT
    )
    return float(result.stdout)

def make_video(images, narration_file, out_file):
    """Combine images + narration into a video with timing."""
    if not images:
        print("⚠️ No images, using fallback.")
        images = [FALLBACK_IMAGE] * NUM_IMAGES

    duration = get_audio_duration(narration_file)
    time_per_img = duration / max(1, len(images))
    print(f"🎬 Video length {duration:.1f}s, {time_per_img:.2f}s per image")

    list_file = OUTPUT_DIR / "frames.txt"
    with open(list_file, "w") as f:
        for img in images:
            f.write(f"file '{img}'\n")
            f.write(f"duration {time_per_img}\n")
        f.write(f"file '{images[-1]}'\n")

    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(list_file),
        "-i", str(narration_file),
        "-c:v", "libx264", "-c:a", "aac",
        "-shortest",
        str(out_file)
    ]
    subprocess.run(cmd, check=True)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--gemini-key", required=True, help="Gemini API key")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Step 1: Ask Gemini
    print("🔮 Generating story...")
    story_prompt = """
    Write a short, emotional anime-style scene and also provide
    5-8 scene descriptions in JSON format like:
    [
      {"description": "...", "style": "..."},
      {"description": "...", "style": "..."}
    ]
    """
    response = ask_gemini(args.gemini_key, story_prompt)

    # Split story and prompts
    parts = response.split("--- PROMPTS ---")
    story_text = parts[0].strip()
    prompts_block = parts[1] if len(parts) > 1 else "[]"

    print("\n--- STORY ---\n")
    print(story_text)

    prompts = parse_prompts(prompts_block)

    # Step 2: Generate images
    print("\n🖼 Generating images...")
    images = []
    for i, p in enumerate(prompts, 1):
        images.append(generate_image(p, i))

    # Step 3: Generate narration
    narration_file = OUTPUT_DIR / "narration.wav"
    print("\n🎙 Generating narration...")
    generate_narration(story_text, str(narration_file))

    # Step 4: Assemble video
    video_file = OUTPUT_DIR / "anime_story.mp4"
    print("\n🎬 Creating video...")
    make_video(images, narration_file, video_file)

    print(f"\n✅ Done! Video saved at {video_file}")

if __name__ == "__main__":
    main()