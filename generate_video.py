import os
import subprocess
import json
from datetime import datetime
from moviepy.editor import ImageSequenceClip, AudioFileClip

import google.generativeai as genai

# ==============================
# CONFIGURATION
# ==============================
CONFIG = {
    "output_dir": "output",
    "fps": 1,  # 1 image per second, adjust if you want slower/faster transitions
}

# Make sure output dir exists
os.makedirs(CONFIG["output_dir"], exist_ok=True)

# ==============================
# GEMINI STORY GENERATION
# ==============================
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
client = genai

def generate_story_with_emotion(prompt="Generate a complete ~1-minute short story for kids"):
    """Generate story, scenes, and emotion with Gemini."""
    story_prompt = f"""
{prompt}.
Make it imaginative and divided into 6-8 short scenes.
At the end, return JSON like this ONLY:

{{
  "story": "Full story text for narration",
  "scenes": ["Scene 1 description", "Scene 2 description", "..."],
  "emotion": "cheerful"
}}

Choose emotion from this list:
["cheerful", "sad", "angry", "excited", "hopeful", "scary", "mysterious", "narration"]
"""
    try:
        response = client.GenerativeModel("gemini-1.5-flash").generate_content(story_prompt)
        story_data = json.loads(response.text)
        return story_data
    except Exception as e:
        print(f"Error generating story: {e}")
        return None

# ==============================
# IMAGE GENERATION
# ==============================
def generate_image(prompt, filename):
    """Generate an image using Gemini and save to file."""
    try:
        response = client.GenerativeModel("gemini-1.5-flash").generate_content([prompt], stream=True)
        response.resolve()
        img_data = response.candidates[0].content.parts[0].inline_data.data

        path = os.path.join(CONFIG["output_dir"], filename)
        with open(path, "wb") as f:
            f.write(img_data)
        print(f"Saved image: {path}")
        return path
    except Exception as e:
        print(f"Error generating image: {e}")
        return None

# ==============================
# EDGE TTS (NARRATION)
# ==============================
def generate_narration(text, emotion, output_file):
    """Generate narration using Edge TTS with emotional style."""
    try:
        voice = "en-US-AriaNeural"  # you can change to any Edge TTS voice

        cmd = [
            "edge-tts",
            "--voice", voice,
            "--text", text,
            "--style", emotion,
            "--write-media", output_file
        ]
        subprocess.run(cmd, check=True)
        print(f"Narration saved: {output_file}")
        return output_file
    except Exception as e:
        print(f"Error generating narration: {e}")
        return None

# ==============================
# VIDEO CREATION
# ==============================
def create_video(story_data, image_paths, narration_path, output_file):
    """Combine images + narration into a video."""
    try:
        clip = ImageSequenceClip(image_paths, fps=CONFIG["fps"])
        audio = AudioFileClip(narration_path)
        clip = clip.set_audio(audio)

        clip.write_videofile(output_file, codec="libx264", audio_codec="aac")
        print(f"✅ Final video saved: {output_file}")
        return output_file
    except Exception as e:
        print(f"Error creating video: {e}")
        return None

# ==============================
# MAIN PIPELINE
# ==============================
def main():
    # Step 1: Generate story
    story_data = generate_story_with_emotion()
    if not story_data:
        print("❌ Failed to generate story")
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Save JSON for reference
    story_path = os.path.join(CONFIG["output_dir"], f"story_{timestamp}.json")
    with open(story_path, "w") as f:
        json.dump(story_data, f, indent=2)
    print(f"Story JSON saved: {story_path}")

    # Step 2: Generate images
    image_paths = []
    for i, scene in enumerate(story_data["scenes"]):
        img_path = generate_image(scene, f"scene_{i}_{timestamp}.png")
        if img_path:
            image_paths.append(img_path)

    # Step 3: Generate narration with emotion
    narration_file = os.path.join(CONFIG["output_dir"], f"narration_{timestamp}.mp3")
    narration_path = generate_narration(story_data["story"], story_data["emotion"], narration_file)

    # Step 4: Create video
    output_video = os.path.join(CONFIG["output_dir"], f"final_video_{timestamp}.mp4")
    create_video(story_data, image_paths, narration_path, output_video)


if __name__ == "__main__":
    main()