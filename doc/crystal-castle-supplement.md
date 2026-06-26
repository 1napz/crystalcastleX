# Crystal Castle – เอกสารเพิ่มเติม (Supplement)

ไฟล์นี้รวบรวมเนื้อหาดิบของส่วนที่เหลือของโปรเจกต์ Crystal Castle
ซึ่งยังไม่ได้จัดทำในโฟลเดอร์ `doc/` เพื่อให้สามารถคัดลอกไปสร้างเอกสารฉบับเต็มได้สะดวก

เนื้อหาประกอบด้วยหัวข้อต่อไปนี้ (ค้นหาได้ด้วย `##` ตามด้วยชื่อหัวข้อ)
1. ภาพรวมสถาปัตยกรรมและ Data Flow
2. API Routes ฉบับสมบูรณ์
3. Frontend Guide
4. User Guide
5. Developer & Debug Guide
6. GitHub Codespaces & DevContainer
7. แนวทางความปลอดภัย

---

## 1. ภาพรวมสถาปัตยกรรมและ Data Flow

### โครงสร้างหลัก
- **Frontend** : Static HTML + Tailwind CSS + Vanilla JS (รันบนเบราว์เซอร์, เสิร์ฟโดย Vercel)
- **API Layer** : Next.js API Routes (Serverless Functions บน Vercel)
- **Backend Services** :
  - Supabase (Database, Storage, Auth)
  - Groq API (LLM สร้าง prompt)
  - FAL Kling / Magic Hour (สร้างวิดีโอ)
  - OpenRouter (ทางเลือก LLM)
- **Admin** : หน้า admin-logs.html สำหรับดู Logs ทั้งระบบ
- **Deployment** : Vercel เชื่อม GitHub main branch

### Data Flow (วงจรการสร้างวิดีโอ)
1. ผู้ใช้เข้า `product.html` → กรอก category, brand, ตั้งชื่อไฟล์
2. อัปโหลดรูป → เรียก `api/upload.js` → เก็บไฟล์ใน Supabase Storage bucket `videos`
3. ได้ URL รูปมา → เรียก `api/prompt.js` เพื่อ generate prompt ผ่าน Groq
4. ผู้ใช้แก้ไข/ปรับ prompt → กดสร้างวิดีโอ → เรียก `api/video.js` หรือ `api/magichour.js`
5. API Route เรียก FAL Kling หรือ Magic Hour API → ได้ video URL
6. เรียก `api/artifacts.js` (POST) เพื่อบันทึกผลงานลง Supabase
7. ผู้ใช้ดูผลงานที่ `artifact.html` หรือ `artifacts.html`
8. Admin ดู Logs ทั้งหมดที่ `admin-logs.html`

---

## 2. API Routes ฉบับสมบูรณ์

### 2.1 `api/upload.js`
- **Method**: POST
- **Input**: FormData (`file`)
- **Output**: `{ url: "https://....supabase.co/.../uploads/xxx.jpg" }`

### 2.2 `api/prompt.js`
- **Method**: POST
- **Input**: `{ user_prompt, category? }`
- **Output**: `{ result: "✨ generated prompt text..." }`

### 2.3 `api/video.js`
- **Method**: POST
- **Input**: `{ image_url, prompt }`
- **Output**: `{ video_url: "https://...mp4" }`

### 2.4 `api/magichour.js`
- **Method**: POST
- **Input**: `{ image_url, prompt }`
- **Output**: `{ video_url: "https://...mp4" }`

### 2.5 `api/post.js`
- **Method**: POST
- **Input**: `{ prompt, brand, category }`
- **Output**: `{ caption: "..." }`

### 2.6 `api/get-logs.js`
- **Method**: GET
- **Input**: ไม่มี (query params `/api/get-logs?limit=50`)
- **Output**: `{ logs: [...] }`

### 2.7 `api/artifacts.js`
- **Method**: GET, POST
- **Input** (POST): `{ video_url, prompt, filename?, category?, brand?, image_url?, engine? }`
- **Output**: `{ success: true }`

---

## 3. Frontend Guide

### `product.html`
- หน้า Studio หลัก
- อัปโหลดภาพ → เลือกเครื่องมือ (Kling/Magic/CTA/Slideshow/Intro)
- ใช้ `supabase-client.js` สำหรับอัปโหลด
- ใช้ `cta-generator.js` สำหรับสร้าง CTA วิดีโอ
- Dynamic filename: `YYYYMMDD-Category-Brand` อัตโนมัติ

### `index.html`
- หน้า Landing Page
- แสดงสถานะ API, Groq Logs, วิธีใช้งาน
- ปุ่มลัดไป `/product.html`, `/artifact.html`

### `artifact.html`
- ดูผลงานที่สร้างแล้ว
- แสดงวิดีโอ + prompt ที่ใช้
- ปุ่มคัดลอก prompt

### `artifacts.html`
- รายการผลงานทั้งหมด (grid)
- ดึงข้อมูลจาก `api/artifacts.js`

### `api-check.html`
- หน้า debug ตรวจสอบแต่ละ API Route

---

## 4. User Guide

### วิธีใช้งานทีละขั้น
1. เข้าเว็บไซต์ `https://crystalcastle.vercel.app`
2. คลิก "เปิด Studio" หรือไปที่ `/product.html`
3. ตั้งชื่อไฟล์ตามรูปแบบ: `YYYYMMDD-Category-Brand`
4. อัปโหลดรูป (JPG/PNG)
5. เลือกเครื่องมือ:
   - **AI Video (Kling)** — สร้างวิดีโอภาพเคลื่อนไหวจากรูป
   - **Magic Hour** — เอฟเฟกต์วิดีโอเฉพาะทาง
   - **CTA** — สร้างคลิป Call to Action
   - **Slideshow** — สร้างสไลด์โชว์
   - **Intro** — สร้างคลิปเปิด
6. รอระบบ Generate Prompt (Groq AI) → แก้ไขได้
7. กดสร้างวิดีโอ → รอประมวลผล → ดาวน์โหลด
8. ดูผลงานย้อนหลังที่ `/artifact.html`

---

## 5. Developer & Debug Guide

### การ Run Local
```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
npm install
npm run dev