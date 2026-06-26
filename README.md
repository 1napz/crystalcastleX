```markdown
# 📹 AI Video Generator - Crystal Castle

> เครื่องมือสร้างวิดีโอสินค้าด้วย AI อัปโหลดรูป → AI เขียน Prompt → สร้างวิดีโอ → พร้อมแชร์ลง TikTok/Shopee ทันที  
> **มีระบบ Slideshow ฟรีในตัว!**


---

## ✨ ฟีเจอร์หลัก

| ฟีเจอร์ | สถานะ | รายละเอียด |
|--------|--------|-------------|
| 🖼️ อัปโหลดรูปสินค้า | ✅ เสร็จ | รองรับสูงสุด 10 รูป, ไฟล์ไม่เกิน 6MB |
| 🤖 AI สร้าง Prompt | ✅ พร้อม | Groq (Llama 3.3 70B) + Gemini fallback |
| 📝 AI สร้างแคปชั่น | ✅ พร้อม | แคปชั่นภาษาไทย + hashtag อัตโนมัติ |
| 🎬 สร้างวิดีโอ | ✅ พร้อม | FAL Kling / Magic Hour |
| 🎞️ สไลด์โชว์ฟรี | ✅ พร้อม | ไม่ใช้ AI, ทำได้ทันที |
| 📱 รองรับมือถือ | ✅ เสร็จ | UI ปรับใหม่ด้วย Tailwind CSS |
| 📊 Groq Logs | ✅ ใหม่ | แสดง Log การเรียก AI แบบ real-time |
| 🔄 Fallback AI | ✅ ใหม่ | Groq ล่ม → ใช้ Gemini อัตโนมัติ |
| 🔒 ความปลอดภัย | ✅ เสร็จ | CSP Headers, RLS, Rate Limiting |
| 🏷️ แบรนด์ | ✅ | @snapzreview ทั่วทั้งแอป |

---

## 🛠️ เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|------|-----------|
| **Frontend** | HTML5 + Tailwind CSS + Vanilla JS |
| **Backend** | Next.js API Routes (Serverless บน Vercel) |
| **Database & Storage** | Supabase (PostgreSQL + Storage) |
| **AI Models** | Groq (Llama 3.3), Gemini (fallback), FAL Kling, Magic Hour |
| **Deployment** | Vercel (CI/CD จาก GitHub) |

---

## 📦 การติดตั้งและรันในเครื่อง

### ความต้องการเบื้องต้น
- Node.js 18+ 
- บัญชี Supabase (ฟรี)
- API Keys: Groq (จำเป็น), FAL/Magic Hour (สำหรับสร้างวิดีโอ)

### ขั้นตอนการติดตั้ง

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle

# 2. ติดตั้ง dependencies
npm install

# 3. คัดลอก Environment Variables ตัวอย่าง
cp .env.example .env.local

# 4. แก้ไข .env.local ด้วยค่าจริงของคุณ (ดูรายละเอียดด้านล่าง)

# 5. รัน Development Server
npm run dev
```

เปิด http://localhost:3000 ในเบราว์เซอร์

---

⚙️ การตั้งค่า Environment Variables

ตัวแปรที่จำเป็น (ต้องมี)

```bash
# Supabase (จำเป็น)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Groq AI (จำเป็น)
GROQ_API_KEY=gsk_your_groq_api_key_here
```

ตัวแปรเสริม (แนะนำให้เพิ่ม)

```bash
# Fallback AI (เมื่อ Groq ล่ม)
GEMINI_API_KEY=AIzaSy...

# สำหรับสร้างวิดีโอ (เลือกอย่างน้อย 1 ตัว)
FAL_KEY=fal_your_key_here
MAGIC_HOUR_API_KEY=mh_your_key_here

# Supabase Admin (ใช้ใน API routes เท่านั้น)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# โหมดพัฒนา (ใช้เฉพาะ local)
NEXT_PUBLIC_USE_MOCK=true   # เปิดใช้งาน Mock Mode
```

📘 ดูรายละเอียดทั้งหมดได้ใน doc/environment-variables.md

---

🧪 Mock Mode (ทดสอบแบบไม่เสียเครดิต)

สำหรับการทดสอบบนเครื่อง local โดยไม่ต้องใช้ API จริง:

```bash
# รันด้วย Mock Mode
npm run dev:mock

# หรือตั้งค่าใน .env.local
NEXT_PUBLIC_USE_MOCK=true
```

เมื่อเปิด Mock Mode:

· ✅ ใช้วิดีโอตัวอย่างแทนการสร้างจริง
· ✅ ใช้ Prompt Template แทนการเรียก Groq
· ✅ ไม่เสียเครดิต FAL/Magic Hour
· ⚠️ มี Badge 🔮 MOCK MODE แสดงที่มุมจอ

---

📂 โครงสร้างโปรเจกต์

```
crystalcastle/
├── api/                    # Next.js API Routes
│   ├── prompt.js          # Groq + Gemini fallback
│   ├── video.js           # FAL Kling
│   ├── magichour.js       # Magic Hour
│   ├── post.js            # สร้างแคปชั่น
│   ├── upload.js          # อัปโหลดรูปไป Supabase
│   ├── get-logs.js        # ดึง Groq Logs
│   └── artifacts.js       # GET/POST ผลงาน
├── public/                # ไฟล์ Static (CSS, รูป, Mock)
├── doc/                   # เอกสารทั้งหมด
├── .github/               # GitHub Actions
├── src/
│   ├── config/            # Environment config
│   ├── mocks/             # Mock API responses
│   ├── services/          # Video service (auto switch mock/real)
│   └── utils/             # Helper functions
├── lib/supabase/          # Supabase client (browser + server)
├── index.html             # หน้า Home
├── product.html           # หน้า Studio
├── product.js             # ฟังก์ชันหลัก (อัปเดตล่าสุด)
├── supabase-client.js     # Supabase connector
├── middleware.ts          # Auth + route protection
├── vercel.json            # Vercel config (CSP, Headers)
├── .env.example           # Template environment
└── README.md
```

---

🔒 ความปลอดภัย

มาตรการ รายละเอียด
Environment Variables เก็บบน Vercel ไม่มี Secret ในโค้ด
Supabase RLS เปิดใช้งานทุกตาราง
CSP Headers ตั้งค่าใน vercel.json
X-Frame-Options ป้องกัน Clickjacking
GitHub Secret Scanning ตรวจจับ Key รั่วไหลอัตโนมัติ
Rate Limiting จำกัดจำนวน Request ต่อ IP
No Client Env ห้ามใช้ process.env ในฝั่ง client

---

🐛 การแก้ไขปัญหาที่พบบ่อย

1. API Route Error 500

· สาเหตุ: Environment Variables ไม่ครบ หรือตั้งค่าผิด
· แก้ไข: ตรวจสอบ Vercel Dashboard → Functions Tab → ดู Logs

2. supabaseUrl is required

· สาเหตุ: NEXT_PUBLIC_SUPABASE_URL ไม่ถูกตั้งค่า
· แก้ไข: เพิ่ม Environment Variable ใน Vercel และ Redeploy

3. Groq Logs ไม่แสดง

· สาเหตุ: ตาราง groq_logs ไม่มี หรือ RLS Policy ไม่ถูกต้อง
· แก้ไข: ดูวิธีสร้างใน doc/groq-logs-setup.md

4. Popup ราคายังโผล่

· สาเหตุ: ใช้ product.js เวอร์ชันเก่า
· แก้ไข: ดึงโค้ดล่าสุดจาก main branch

5. CORS Error (Cross-Origin)

· สาเหตุ: เรียก API ข้ามโดเมน
· แก้ไข: ใช้ relative path /api/... หรือตั้ง CORS ใน vercel.json

---

📚 เอกสารเพิ่มเติม

ดูรายละเอียดทั้งหมดได้ในโฟลเดอร์ doc/ :

เอกสาร เนื้อหา
index.md สารบัญเอกสารทั้งหมด
supabase-guide.md คู่มือ Supabase (RLS, Storage, Policies)
free-ai-apis.md สรุป Free AI APIs ที่ใช้ได้จริง
groq-logs-setup.md การตั้งค่า Groq API Logs
security-and-debug.md ความปลอดภัยและวิธีการ Debug
vercel-config.md การตั้งค่า vercel.json
environment-variables.md รายละเอียด Environment Variables

---

🚀 Deploy บน Vercel

https://vercel.com/button

ขั้นตอนการ Deploy

1. Fork หรือ Clone โปรเจกต์นี้
2. เข้าไปที่ Vercel Dashboard
3. Import GitHub Repository
4. ตั้งค่า Environment Variables (ตามหัวข้อด้านบน)
5. กด Deploy

---

🤝 การมีส่วนร่วม (Contributing)

ยินดีรับ Pull Request เสมอ!

ก่อนส่ง PR:

· ✅ ตรวจสอบว่าไม่มี Secret (API Key) หลุด
· ✅ Format โค้ดให้เรียบร้อย
· ✅ ทดสอบกับ Mock Mode ก่อน
· ✅ อัปเดตเอกสารถ้าจำเป็น

---

📄 License

MIT License — ดูรายละเอียดใน LICENSE

---

💬 ติดต่อ

· GitHub Issues: สร้าง Issue ใหม่
· อีเมล: nobizzmaru@gmail.com

---

<div align="center">
  Made with ❤️ by @snapzreview
</div>
```

---