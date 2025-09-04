#!/usr/bin/env python3
"""
Anime Story Video Generator
Uses Gemini AI for story + image prompts,
Pollinations for images,
Coqui TTS for narration,
and FFmpeg to assemble video.
"""

import os
import subprocess
import requests
import textwrap
from pathlib import Path
import google.generativeai as genai
from TTS.api import TTS

# ========================
# CONFIG
# ========================
OUTPUT_DIR = Path("generated_videos")
IMAGES_DIR = OUTPUT_DIR / "images"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Choose Coqui TTS model
# "tts_models/en/ljspeech/tacotron2-DDC" (clear female)
# "tts_models/en/vctk/vits" (multi-speaker, realistic)
TTS_MODEL = "tts_models/en/vctk/vits"

# ========================
# GEMINI SETUP
# ========================
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")

# ========================
# FUNCTIONS
# ========================
def generate_story():
    prompt = (
        "Write a short anime-style story (2–3 paragraphs). "
        "It should be vivid, emotional, and suitable for narration. "
        "Also include 5 short descriptive scene prompts (one per line, starting with 'Scene:')."
    )
    resp = model.generate_content(prompt)
    text = resp.text.strip()

    story_lines = []
    prompts = []
    for line in text.splitlines():
        if line.lower().startswith("scene:"):
            prompts.append(line.replace("Scene:", "").strip())
        else:
            story_lines.append(line)

    story = "\n".join(story_lines)
    if not prompts:
        prompts = ["anime night city", "forest with fireflies", "hero walking", "battle stance", "sunrise over mountains"]

    return story, prompts


def download_image(prompt, idx):
    url = f"https://image.pollinations.ai/prompt/{requests.utils.quote(prompt)}"
    out_path = IMAGES_DIR / f"image_{idx}.jpg"
    if not out_path.exists():
        r = requests.get(url, timeout=60)
        with open(out_path, "wb") as f:
            f.write(r.content)
    return out_path


def narrate(text, out_path="narration.wav"):
    # Cache model inside repo so it doesn’t redownload each run
    model_cache = Path("~/.local/share/tts").expanduser()
    os.environ["COQUI_TOS_AGREED"] = "1"  # avoid license prompt

    tts = TTS(TTS_MODEL, progress_bar=False, gpu=False)
    tts.tts_to_file(text=text, file_path=out_path)
    return Path(out_path)


def get_audio_duration(audio_file):
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(audio_file)
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return float(result.stdout.strip())


def create_video(image_files, audio_file, output_file, duration):
    if not image_files:
        raise RuntimeError("No images available for video.")

    per_image_duration = duration / len(image_files)

    list_file = OUTPUT_DIR / "images.txt"
    with open(list_file, "w") as f:
        for img in image_files:
            f.write(f"file '{os.path.abspath(img)}'\n")
            f.write(f"duration {per_image_duration}\n")
        f.write(f"file '{os.path.abspath(image_files[-1])}'\n")  # hold last frame

    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-i", str(audio_file),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
        "-shortest", str(output_file)
    ]
    subprocess.run(cmd, check=True)


# ========================
# MAIN PIPELINE
# ========================
def main():
    print("🔮 Generating story...")
    story, prompts = generate_story()
    print("\n--- STORY ---\n")
    print(story)
    print("\n--- PROMPTS ---\n")
    print(prompts)

    print("\n🖼 Downloading images...")
    image_files = [download_image(p, i) for i, p in enumerate(prompts)]

    print("\n🎙 Generating narration...")
    narration_file = OUTPUT_DIR / "narration.wav"
    narrate(story, narration_file)

    print("\n⏱ Checking audio length...")
    duration = get_audio_duration(narration_file)
    print(f"Audio length: {duration:.2f} sec")

    print("\n🎬 Creating video...")
    output_file = OUTPUT_DIR / "anime_story.mp4"
    create_video(image_files, narration_file, output_file, duration)

    print(f"\n✅ Done! Video saved at: {output_file}")


if __name__ == "__main__":
    main()