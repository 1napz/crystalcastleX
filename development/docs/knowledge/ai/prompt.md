ได้ครับ ถ้าคุณต้องการเก็บไว้ใน docs/knowledge/ai/ สำหรับใช้กับ Claude, Codex, Gemini หรือ AI Agent อื่น ๆ ผมแนะนำรูปแบบนี้

AI Video Prompt Reverse Engineering Guide

Version: 1.0
Purpose: วิเคราะห์และถอดโครงสร้าง Prompt จากวิดีโอ AI เพื่อสร้าง Asset ที่มีคุณภาพใกล้เคียงต้นฉบับ

---

Overview

Prompt Reverse Engineering คือกระบวนการวิเคราะห์วิดีโอหรือภาพที่สร้างจาก AI แล้วถอดองค์ประกอบสำคัญออกมาเป็น Prompt Structure ที่สามารถนำไปสร้างงานลักษณะเดียวกันได้

ข้อควรทราบ:

- ไม่สามารถทราบ Prompt ต้นฉบับได้ 100%
- สามารถวิเคราะห์โครงสร้างและเทคนิคที่น่าจะถูกใช้
- ใช้เพื่อสร้าง Prompt Template สำหรับงานในอนาคต

---

Analysis Framework

วิเคราะห์จาก 8 องค์ประกอบหลัก

1. Subject

สิ่งที่เป็นหัวข้อหลักของภาพหรือวิดีโอ

ตัวอย่าง:

- Bento Box
- Leather Bag
- Streetwear Outfit
- Coffee Cup
- Smart Watch

---

2. Action

สิ่งที่เกิดขึ้นในฉาก

ตัวอย่าง:

- Opening
- Walking
- Pouring
- Unboxing
- Picking up
- Rotating

ตัวอย่าง:

"A woman's hand slowly opens a wooden bento box"

---

3. Camera Movement

ประเภทการเคลื่อนกล้อง

Push In

กล้องค่อย ๆ เคลื่อนเข้า

Pull Out

กล้องถอยออก

Tracking

กล้องติดตามวัตถุ

Orbit

กล้องหมุนรอบวัตถุ

Static

กล้องนิ่ง

---

4. Lens Style

ประเภทเลนส์ที่จำลอง

Macro

เน้นรายละเอียดใกล้มาก

Portrait

เน้นตัวแบบ

Wide

เห็นสภาพแวดล้อมมากขึ้น

Telephoto

ฉากหลังละลายมาก

---

5. Lighting

รูปแบบแสง

Golden Hour

แสงอุ่น

Soft Studio Light

แสงนุ่ม

Natural Window Light

แสงธรรมชาติ

Cinematic Lighting

แสงแบบภาพยนตร์

---

6. Environment

สภาพแวดล้อม

ตัวอย่าง:

- Modern Kitchen
- Luxury Cafe
- Minimal Workspace
- Japanese Restaurant
- Urban Street

---

7. Commercial Style

ประเภทงานโฆษณา

Food Commercial

โฆษณาอาหาร

Fashion Commercial

โฆษณาแฟชั่น

Luxury Product Ad

โฆษณาสินค้าพรีเมียม

Lifestyle Commercial

โฆษณาไลฟ์สไตล์

---

8. Rendering Quality

ระดับคุณภาพ

ตัวอย่าง:

- Photorealistic
- HDR
- 4K
- Ultra Detailed
- Realistic Texture
- Volumetric Lighting

---

Example Reverse Engineering

Source Video

Japanese Bento Food Advertisement

Observations

Subject:

- Wooden Bento Box

Action:

- Hand opens lid

Camera:

- Slow Push In

Lens:

- Macro

Lighting:

- Warm Cinematic

Environment:

- Cozy Kitchen

Style:

- Food Commercial

Quality:

- Photorealistic 4K

---

Reconstructed Prompt

Ultra realistic Japanese bento box on a wooden kitchen counter.

A woman's hand slowly lifts the wooden lid, revealing freshly cooked teriyaki chicken, steamed white rice, edamame beans and sliced radishes.

Hot steam rises naturally from the meal.

Warm cinematic kitchen lighting, golden hour atmosphere, soft bokeh background, shallow depth of field, macro food photography.

Commercial food advertisement, luxury restaurant quality, highly detailed textures, realistic reflections.

Camera slowly pushes forward toward the food.

Photorealistic, volumetric lighting, HDR, 4K, vertical 9:16.

---

Camera Prompt Template

Slow push-in camera movement.

Macro lens.

Focus transition from foreground to subject.

Natural handheld micro movement.

Commercial advertisement style.

---

Negative Prompt Template

cartoon

anime

cgi

low quality

deformed hands

extra fingers

blurry

oversaturated

plastic texture

watermark

logo

text overlay

distorted objects

unrealistic lighting

---

Universal Prompt Formula

[SUBJECT]

+ 

[ACTION]

+ 

[CAMERA MOVEMENT]

+ 

[LENS STYLE]

+ 

[LIGHTING]

+ 

[ENVIRONMENT]

+ 

[COMMERCIAL STYLE]

+ 

[QUALITY]

---

Examples

Fashion

Premium streetwear jacket.

A male model walks through a modern city street.

Slow tracking shot.

Golden hour lighting.

Luxury fashion commercial.

Photorealistic 4K.

---

Coffee

Freshly brewed coffee being poured into a ceramic cup.

Macro shot.

Warm cafe lighting.

Lifestyle advertisement.

Ultra realistic.

---

Menswear Affiliate

Premium leather messenger bag on a wooden cafe table.

A man places the bag beside a laptop.

Slow cinematic push-in.

Luxury coffee shop environment.

High-end menswear advertisement.

Photorealistic HDR 4K.

---

Best Practices

1. Keep prompts focused on one primary action.
2. Specify camera movement separately.
3. Always define lighting.
4. Use realistic environments.
5. Add commercial style keywords.
6. Add quality keywords at the end.
7. Use a dedicated negative prompt.
8. Maintain consistent aspect ratio requirements.

---

Recommended Repository Structure

docs/
└── knowledge/
└── ai/
├── prompt-reverse-engineering.md
├── video-prompt-library.md
├── camera-motion-library.md
├── lighting-library.md
├── negative-prompt-library.md
└── affiliate-video-framework.mdสำหรับ repo อย่าง CrystalCastle หรือ Zyntro AI Studio ผมแนะนำเพิ่มอีก 3 เอกสารคือ:

video-prompt-library.md (รวม Prompt ที่ผ่านการทดสอบแล้ว)

camera-motion-library.md (รวม Camera Movements ของ Kling/Veo/Runway)

affiliate-video-framework.md (Framework ทำวิดีโอขายสินค้า Shopee, TikTok Shop, Menswear, Streetwear)


ชุดนี้จะกลายเป็น Knowledge Base ที่ AI Agent สามารถอ้างอิงเพื่อสร้างวิดีโอการตลาดได้อย่างสม่ำเสมอมากขึ้นครับ।