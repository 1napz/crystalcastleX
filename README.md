
```markdown
# @snapzreview — AI Video Generator

**@snapzreview** คือเครื่องมือสร้างวิดีโอสินค้าด้วย AI  
อัปโหลดรูป → AI เขียน Prompt → สร้างวิดีโอ → พร้อมแชร์ลง TikTok/Shopee ทันที  
มีระบบ Slideshow ฟรีในตัว!

🌐 **Live Demo:** [crystalcastle-pi.vercel.app](https://crystalcastle-pi.vercel.app)

---

## 🆕 มีอะไรใหม่ในเวอร์ชันล่าสุด (v1.4+)

| ฟีเจอร์ | สถานะ | รายละเอียด |
|---------|--------|-------------|
| UI สำหรับมือถือ | ✅ เสร็จแล้ว | ออกแบบใหม่หมดด้วย Tailwind CSS รองรับจอเล็ก |
| AI สร้าง Prompt | ✅ พร้อมใช้งาน | Groq (Llama 3.3 70B) ตอบกลับภายใน 2-3 วินาที |
| AI สร้างแคปชั่น | ✅ พร้อมใช้งาน | แคปชั่นภาษาไทย + hashtag อัตโนมัติ |
| สร้างวิดีโอ | ✅ พร้อมใช้งาน | FAL Kling / Magic Hour |
| Groq Logs | ✅ ใหม่ | แสดง Log การเรียก AI แบบ real-time |
| Fallback AI | ✅ ใหม่ | หาก Groq ล่ม จะสลับไปใช้ Gemini โดยอัตโนมัติ |
| ระบบความปลอดภัย | ✅ ใหม่ | CSP Headers, X-Frame-Options, Rate Limiting |
| ปรับแบรนด์ทั่วทั้งแอป | ✅ | เปลี่ยนจาก Crystal Castle → @snapzreview |
| ลบ Popup ราคา/ส่วนลด | ✅ | ไม่มีการถามราคาในการสร้างวิดีโออีกต่อไป |

---

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend:** HTML5 + Tailwind CSS + Vanilla JS
- **Backend:** Next.js API Routes (Serverless Functions บน Vercel)
- **Database & Storage:** Supabase
- **AI:** Groq, Gemini (Fallback), FAL Kling, Magic Hour
- **Deployment:** Vercel (CI/CD จาก GitHub)

---

## 📦 การติดตั้งและรันในเครื่อง

### ความต้องการเบื้องต้น
- Node.js 18+
- บัญชี Supabase (Free Plan ใช้งานได้)
- API Keys จาก Groq, FAL, Magic Hour (ตามที่ต้องการ)

### ขั้นตอนการติดตั้ง

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle

# 2. ติดตั้ง dependencies
npm install

# 3. คัดลอก Environment Variables ตัวอย่าง
cp .env.example .env.local

# 4. แก้ไข .env.local ด้วยค่าจริงของคุณ
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY (หรือ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
#    - GROQ_API_KEY
#    - (Optional) GEMINI_API_KEY, FAL_KEY, MAGIC_HOUR_API_KEY

# 5. รัน Development Server
npm run dev
```

เปิด http://localhost:3000 ในเบราว์เซอร์

---

⚙️ การตั้งค่า Environment Variables

ดูรายละเอียดทั้งหมดได้ใน doc/environment-variables.md

ตัวแปรที่จำเป็น:

· NEXT_PUBLIC_SUPABASE_URL – URL โปรเจกต์ Supabase
· NEXT_PUBLIC_SUPABASE_ANON_KEY – Public key (เปิดเผยได้) ใช้ใน client-side
· GROQ_API_KEY – สำหรับ Groq AI

ตัวแปรเสริม (แนะนำให้เพิ่ม):

· SUPABASE_SERVICE_ROLE_KEY – สำหรับ API routes ที่ต้องข้าม Row Level Security (ห้ามใช้ใน client)
· GEMINI_API_KEY – สำหรับ Fallback AI เมื่อ Groq ล่ม

---

📂 โครงสร้างโปรเจกต์

```
crystalcastle/
├── api/                  # Next.js API Routes
│   ├── prompt.js         # Gen Prompt ด้วย Groq (พร้อม Fallback Gemini)
│   ├── video.js          # สร้างวิดีโอ FAL Kling
│   ├── magichour.js      # สร้างวิดีโอ Magic Hour
│   ├── post.js           # สร้างแคปชั่น
│   ├── upload.js         # อัปโหลดรูปไป Supabase Storage
│   ├── get-logs.js       # ดึง Groq Logs
│   └── artifacts.js      # GET/POST ผลงาน
├── public/               # ไฟล์ Static
├── doc/                  # เอกสารประกอบทั้งหมด
├── .github/              # GitHub Actions (CI/CD, Secret Scanning)
├── index.html            # หน้า Home
├── product.html          # หน้า Studio สร้างวิดีโอ
├── artifact.html         # หน้าผลงานแต่ละชิ้น
├── artifacts.html        # รายการผลงานทั้งหมด
├── login.html            # หน้าเข้าสู่ระบบ (อยู่ระหว่างพัฒนา)
├── supabase-client.js    # ตัวเชื่อม Supabase สำหรับ Client
├── product.js            # ฟังก์ชันหลักของ Studio
├── cta-generator.js      # ฟังก์ชันสร้าง CTA
├── vercel.json           # ตั้งค่า Vercel (Headers, Functions)
├── .vercelignore         # ไฟล์ที่ไม่ Deploy
├── .gitignore
└── README.md
```

---

🔒 ความปลอดภัย

· Environment Variables ทั้งหมดเก็บไว้บน Vercel ไม่มี Secret ใน Source Code
· Row Level Security (RLS) เปิดใช้งานบนทุกตารางใน Supabase
· Content Security Policy (CSP) และ X-Frame-Options ถูกตั้งค่าใน vercel.json
· GitHub Secret Scanning เปิดใช้งานเพื่อป้องกัน Key หลุด
· ห้ามใช้ process.env ใน Client-side – ให้ใช้ค่าคงที่ที่ปลอดภัย หรือ API Route เท่านั้น

---

🪲 การ Debug และปัญหาที่พบบ่อย

1. API Route Error 500

· สาเหตุอันดับ 1: Environment Variables ยังไม่ได้ตั้งค่าบน Vercel (โดยเฉพาะ NEXT_PUBLIC_SUPABASE_URL)
· วิธีตรวจสอบ: ดู Runtime Logs ใน Vercel Dashboard → Functions Tab
· วิธีแก้: เพิ่ม Env ใน Vercel → Redeploy

2. supabaseUrl is required

· เกิดจาก process.env.NEXT_PUBLIC_SUPABASE_URL เป็น undefined
· ตรวจสอบว่าได้ตั้งค่า Environment Variables บน Vercel ครบถ้วนหรือไม่

3. Groq Logs ไม่แสดง

· เช็กว่าได้สร้างตาราง groq_logs ใน Supabase แล้ว (ดูวิธีสร้างได้ใน doc/groq-logs-setup.md)
· ต้องมี RLS Policy สำหรับ SELECT และ INSERT

4. Popup ราคา/ส่วนลดยังโผล่

· เกิดจากใช้ product.js เวอร์ชันเก่า → ดึงโค้ดล่าสุดจาก main branch มาใช้

---

📚 เอกสารเพิ่มเติม

ดูรายละเอียดทั้งหมดได้ในโฟลเดอร์ doc/:

เอกสาร เนื้อหา
index.md สารบัญเอกสารทั้งหมด
supabase-guide.md คู่มือ Supabase ฉบับสมบูรณ์ (RLS, Storage, Policies)
free-ai-apis.md สรุป Free AI APIs ทั้งหมดที่ใช้ได้จริง
groq-logs-setup.md การตั้งค่าบันทึกและแสดง Groq API Logs
security-and-debug.md วิธีการ Debug และความปลอดภัย
vercel-config.md การตั้งค่า vercel.json และ API Routes
environment-variables.md รายละเอียด Environment Variables ทั้งหมด

---

🤝 การมีส่วนร่วม (Contributing)

ยินดีรับ Pull Request เสมอ!
ก่อนส่ง PR กรุณาตรวจสอบว่าไม่มี Secret หลุด และผ่านการ Format โค้ดแล้ว

---

📄 License

MIT License — ดูรายละเอียดใน LICENSE

---

💬 ติดต่อ

· GitHub: @1napz
· เว็บไซต์: crystalcastle-pi.vercel.app
· TikTok: @snapzreview

```
