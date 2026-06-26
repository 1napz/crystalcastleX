📄 README.md ฉบับเต็ม (ก็อปปี้ทั้งหมด)

```markdown
## 💎 Crystal Castle Lite v1.4

**Crystal Castle** — AI Video Generator สำหรับสร้างวิดีโอสินค้า อัปโหลดรูป → AI เขียน Prompt → สร้างวิดีโอ → ได้แคปชันอัตโนมัติ พร้อมระบบสไลด์โชว์ฟรี!

🔗 **Live Demo:** [crystalcastle-pi.vercel.app](https://crystalcastle-pi.vercel.app)

---

## 🚀 มีอะไรใหม่ (v1.4)

| ฟีเจอร์ | สถานะ | รายละเอียด |
|--------|--------|-------------|
| UI มือถือ | ✅ | textarea ไม่บังปุ่ม |
| AI สร้าง Prompt | ✅ | Groq (Llama 3.3 70B) – 2-3 วินาที |
| AI สร้างแคปชัน | ✅ | ภาษาไทย + hashtag อัตโนมัติ |
| สร้างวิดีโอ | ✅ | FAL Kling / Magic Hour |
| **สไลด์โชว์ฟรี** | ✅ **ใหม่** | สร้างวิดีโอจากรูปสินค้า ไม่ใช้ AI |
| **Admin Logs** | ✅ **ใหม่** | ดูประวัติการสร้างวิดีโอ |
| ตั้งชื่อไฟล์อัตโนมัติ | ✅ | `YYYYMMDD-Category-Brand` |
| Supabase v2 | ✅ | Realtime + Publishable Key |

---

## 📖 วิธีใช้ (สำหรับผู้ใช้ทั่วไป)

1. **อัปโหลดรูปสินค้า** (รองรับ JPG, PNG สูงสุด 10 รูป)
2. **กรอกข้อมูลสินค้า** (แบรนด์, หมวดหมู่)
3. **กด "✨ AI ช่วยคิด"** → ระบบจะสร้าง Prompt ให้อัตโนมัติ
4. **เลือกเครื่องมือสร้างวิดีโอ:**
   - 🎬 **FAL Kling** (คุณภาพสูง ต้องมี API Key)
   - ✨ **Magic Hour** (ฟรี 400 เครดิต/วัน)
   - 🎞️ **สไลด์โชว์** (ฟรี ไม่ใช้ AI)
5. **กด "🎥 สร้างวิดีโอเลย"** → รอสักครู่ ได้ลิงก์วิดีโอ
6. **กด "✍️ สร้างแคปชั่น"** → ได้แคปชันพร้อม hashtag

---

## ⚙️ การติดตั้งสำหรับนักพัฒนา

### 1. Clone โปรเจกต์
```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
```

2. Environment Variables (API Keys)

โปรเจกต์ต้องการตัวแปรสภาพแวดล้อมดังนี้:

Variable จำเป็น ใช้ทำอะไร
GROQ_API_KEY ⚠️ (optional) AI สร้าง Prompt
FAL_KEY ⚠️ (optional) FAL Kling วิดีโอ
MAGIC_HOUR_API_KEY ⚠️ (optional) Magic Hour วิดีโอ
NEXT_PUBLIC_SUPABASE_URL ✅ จำเป็น Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY ✅ จำเป็น Supabase Public Key
TELEGRAM_BOT ⚠️ (optional) แจ้งเตือน Telegram
TELEGRAM_CHAT_ID ⚠️ (optional) แจ้งเตือน Telegram

Hint: ถ้าไม่ใส่ API Keys ระบบจะใช้ fallback (sample video / demo image) ฟีเจอร์พื้นฐานยังใช้งานได้ปกติ

3. ตั้งค่า Environment Variables

ตัวเลือก A: GitHub Codespaces (แนะนำสำหรับทดสอบ)

1. ไปที่ https://github.com/1napz/crystalcastle/settings/secrets/codespaces
2. กด New repository secret
3. เพิ่ม Secrets ตามชื่อในตารางด้านบน

ตัวเลือก B: Vercel (Production)

1. Vercel Dashboard → Project crystalcastle → Settings → Environment Variables
2. เพิ่มตัวแปรทั้งหมด

ตัวเลือก C: Local Development (vercel dev)

สร้างไฟล์ .env ใน root (ห้าม commit ขึ้น GitHub):

```bash
cat > .env << EOF
GROQ_API_KEY=your_key_here
FAL_KEY=your_key_here
MAGIC_HOUR_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=https://wqkreaoqkunjhlzzdimd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EOF
```

4. รัน Local Server

```bash
# ติดตั้ง Vercel CLI (ครั้งแรก)
npm i -g vercel

# รัน Local Server
vercel dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

---

🗄️ Supabase (Backend)

โปรเจกต์ใช้ Supabase สำหรับ:

· Authentication (Login ด้วย Email Magic Link)
· Storage (เก็บรูปสินค้าและวิดีโอ - 1GB ฟรี)
· Database (เก็บ Logs การสร้างวิดีโอ)

ตารางที่ต้องสร้างใน Supabase

```sql
-- ตารางเก็บ Logs วิดีโอ
CREATE TABLE video_logs (
  id SERIAL PRIMARY KEY,
  user_email TEXT,
  engine TEXT,
  prompt TEXT,
  image_url TEXT,
  video_url TEXT,
  status TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- เปิด RLS (Row Level Security)
ALTER TABLE video_logs ENABLE ROW LEVEL SECURITY;

-- Policy: ให้ผู้ใช้เข้าสู่ระบบสามารถ insert ได้
CREATE POLICY "Users can insert logs" ON video_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Policy: ให้ Admin (คุณ) สามารถดู logs ได้
CREATE POLICY "Admin can view logs" ON video_logs
  FOR SELECT TO authenticated
  USING (auth.email() = 'nobizzmaru@gmail.com');
```

---

📁 โครงสร้างโปรเจกต์

```
crystalcastle/
├── index.html              # หน้าแรก
├── product.html            # หน้าสร้างวิดีโอหลัก
├── product.js              # Logic หลัก (อัปโหลด, AI, Slideshow)
├── login.html              # หน้าเข้าสู่ระบบ
├── auth.js                 # ระบบ Authentication
├── admin-logs.html         # หน้าแสดง Logs (Admin)
├── api/
│   ├── upload.js           # อัปโหลดรูป
│   ├── video.js            # สร้างวิดีโอ FAL Kling
│   ├── magichour.js        # สร้างวิดีโอ Magic Hour
│   ├── prompt.js           # AI สร้าง Prompt
│   ├── post.js             # AI สร้างแคปชั่น
│   ├── get-logs.js         # ดึง Logs จาก Supabase
│   └── save-artifact.js    # บันทึกผลงาน
└── .devcontainer/          # การตั้งค่า GitHub Codespaces
    ├── devcontainer.json
    └── setup.sh
```

---

🛠️ สร้างสไลด์โชว์ฟรี (ไม่ต้องใช้ API)

หน้า product.html มีปุ่ม "🎞️ สไลด์โชว์" ที่ใช้ Canvas API สร้างวิดีโอจากรูปสินค้าโดยตรง:

· ไม่ต้องมี API Key
· ไม่กินเครดิต
· เหมาะสำหรับทำคลิปสั้น ๆ ลง TikTok/Shopee

---

📡 การแจ้งเตือน (Telegram)

Webhook /api/webhook/github → ส่งข้อความไปที่ Telegram Bot

· ตั้งค่า TELEGRAM_BOT และ TELEGRAM_CHAT_ID ใน Environment Variables
· ใช้สำหรับแจ้งเตือนเมื่อมีคนใช้งานหรือเกิด error

---

🔒 ความปลอดภัย

· ห้าม commit .env หรือ config.js ขึ้น GitHub
· ใช้ Publishable Key ของ Supabase เท่านั้น (key เก่า revoke แล้ว)
· RLS (Row Level Security) เปิดอยู่ทุกตาราง
· Admin Bypass ใช้สำหรับทดสอบ (เฉพาะอีเมลที่กำหนด)

---

📞 ติดต่อ / สนับสนุน

· GitHub Issues: เปิด Issue ได้ที่นี่
· Telegram Alert: @crystalcastle_alert_bot

---

📜 License

Private Project — © 2026 Crystal Castle AI Factory

---

Crystal Castle AI Factory · v1.4 | อัปเดตล่าสุด: 23 เม.ย. 2026

```

## 🚀 วิธีอัปเดต

1. **เปิด `README.md` ใน GitHub** (https://github.com/1napz/crystalcastle/blob/main/README.md)
2. **กด Edit (ดินสอ)**
3. **ลบของเดิมทิ้งทั้งหมด**
4. **ก็อปปี้โค้ดด้านบนทั้งหมด** → วาง
5. **กด "Commit changes"**

## ✅ สรุปสิ่งที่ได้

| หัวข้อ | รายละเอียด |
|--------|-------------|
| มีอะไรใหม่ | ✅ อัปเดตฟีเจอร์ล่าสุด (สไลด์โชว์, Admin Logs) |
| วิธีใช้ | ✅ สำหรับผู้ใช้ทั่วไป (ไม่ต้องอ่านโค้ด) |
| ติดตั้ง | ✅ ครบถ้วน (Clone, Env, Local Run) |
| Supabase | ✅ คำสั่ง SQL สำหรับสร้างตาราง |
| โครงสร้างโปรเจกต์ | ✅ อธิบายไฟล์สำคัญ |
| ความปลอดภัย | ✅ คำเตือนและแนวทางปฏิบัติ |

**README นี้จะช่วยให้คนที่ fork โปรเจกต์ไป ตั้งค่าและรันได้ทันที และช่วยคุณเองเวลาลืมขั้นตอนด้วยครับ!** 📚