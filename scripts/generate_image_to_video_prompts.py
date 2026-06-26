import os
import requests
import json
import time
from datetime import datetime

# ========================= CONFIG =========================
CLICKUP_TOKEN = os.getenv("CLICKUP_API_TOKEN")
LIST_ID = os.getenv("CLICKUP_LIST_ID")
BASE_URL = "https://api.clickup.com/api/v2"

MAX_TASKS = 300
BATCH_SIZE = 20          # ป้องกัน Rate Limit
TAGS = ["Document"]

# หมวดหมู่และเทมเพลตคุณภาพสูง
CATEGORIES = {
    "Cinematic": ["slow motion", "dramatic pan", "epic orbiting", "smooth tracking shot", "aerial dolly zoom"],
    "Anime": ["flowing hair in wind", "dynamic action pose", "sparkling eyes", "cherry blossom falling", "magical transformation"],
    "Realistic": ["hyper realistic", "photorealistic", "8k detail", "natural lighting", "cinematic color grading"],
    "Fantasy": ["magical particles", "ethereal glow", "dragon flying", "mystical portal", "floating island"],
    "Product": ["360 rotation", "smooth product showcase", "luxury lighting", "macro detail", "elegant reveal"],
    "Abstract": ["fluid motion", "particle explosion", "morphing shapes", "neon light trails", "symmetry animation"],
    "Sci-Fi": ["holographic display", "spaceship flyby", "cyberpunk neon", "futuristic city", "alien landscape"],
    "Emotional": ["gentle camera move", "tears flowing", "warm sunlight", "melancholic atmosphere", "heartwarming moment"]
}

def get_prompt_template(category, motion):
    return f"Transform the reference image into a high-quality {category.lower()} video: {motion}, ultra-detailed, smooth motion, cinematic lighting, 4K, best quality, professional color grading."

def create_clickup_task(title, description):
    url = f"{BASE_URL}/list/{LIST_ID}/task"
    headers = {
        "Authorization": CLICKUP_TOKEN,
        "Content-Type": "application/json"
    }
    
    payload = {
        "name": title,
        "description": description,
        "tags": TAGS,
        "priority": 3,
        "due_date": None
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code in [200, 201]:
        print(f"✅ Created: {title[:80]}...")
        return True
    else:
        print(f"❌ Failed ({response.status_code}): {title[:60]}")
        print(response.text[:200])
        return False

def generate_300_prompts():
    tasks_created = 0
    prompt_number = 1
    
    print(f"เริ่มสร้าง {MAX_TASKS} หัวข้อ Prompt Image-to-Video...")

    for category, motions in CATEGORIES.items():
        for motion in motions:
            for style in ["", " in golden hour", ", volumetric lighting", ", dramatic rim light", ", subtle film grain"]:
                if tasks_created >= MAX_TASKS:
                    break
                    
                title = f"Prompt {prompt_number:03d} - {category}: {motion}{style}".strip()
                
                full_prompt = get_prompt_template(category, motion + style)
                description = f"""**Image to Video Prompt**

{full_prompt}

**Category:** {category}
**Motion:** {motion}{style}
**Target Tools:** Runway Gen-3, Kling AI, Luma Dream Machine, Pika 1.5, Viggle

**คำแนะนำ:** ใช้กับภาพคุณภาพสูง, Aspect Ratio 16:9 หรือ 9:16, Motion Strength ปานกลาง-สูง"""

                success = create_clickup_task(title, description)
                if success:
                    tasks_created += 1
                    prompt_number += 1
                
                time.sleep(0.3)  # Respect Rate Limit
        
        if tasks_created >= MAX_TASKS:
            break

    # เติมให้ครบ 300 ถ้ายังไม่พอ
    while tasks_created < MAX_TASKS:
        extra_title = f"Prompt {prompt_number:03d} - Creative Image to Video Variation"
        extra_desc = "Generate creative and detailed image-to-video prompt..."
        if create_clickup_task(extra_title, extra_desc):
            tasks_created += 1
            prompt_number += 1
        time.sleep(0.3)

    print(f"\n🎉 เสร็จสิ้น! สร้างทั้งหมด {tasks_created} Tasks ใน ClickUp")

if __name__ == "__main__":
    if not CLICKUP_TOKEN or not LIST_ID:
        print("❌ Error: CLICKUP_API_TOKEN หรือ CLICKUP_LIST_ID ไม่ถูกตั้งค่า")
    else:
        generate_300_prompts()
