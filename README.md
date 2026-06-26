## 💎 Crystal Castle Lite v1.4

**เครื่องเจียระไน Lite** — อัปโหลดรูปสินค้า → AI เขียน Prompt → สร้างวิดีโอ → ได้แคปชันอัตโนมัติ

Live: https://crystalcastle-pi.vercel.app/index.html  
Mission Control: https://5-1napzs-projects.vercel.app

## 🚀 มีอะไรใหม่
- ✅ UI มือถือแก้แล้ว – textarea ไม่บังปุ่ม
- ✅ Gen Prompt ด้วย Groq (Llama 3.3 70B) – 2–3 วินาที
- ✅ Generate Post อัตโนมัติ – แคปชันไทย + hashtag
- ✅ 2 Engines: FAL Kling / Magic Hour
- ✅ ตั้งชื่อไฟล์อัตโนมัติ `YYYYMMDD-Category-Brand`
- 🆕 ย้ายไป Supabase v2 – Realtime + Publishable Key

## 📖 วิธีใช้
1. เตรียมรูป: `YYYYMMDD-Category-Brand.jpg`
2. อัปโหลด → กด "✨ Gen Prompt"
3. เลือก Engine → Generate → ได้วิดีโอ 5วิ + แคปชัน

## ⚙️ ติดตั้ง
```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
```
**Env (Vercel):** `GROQ_API_KEY`, `FAL_KEY`, `MAGIC_HOUR_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `TELEGRAM_BOT`, `TELEGRAM_CHAT_ID`

## 🗄️ Supabase
ใช้เก็บ log และรูป (PostgreSQL + Storage) – ตั้งค่าใน Supabase แล้วใส่ URL/Key ใน Vercel

## 📡 แจ้งเตือน
Webhook `/api/webhook/github` → Telegram @crystalcastle_alert_bot

## 🔒 ความปลอดภัย
- ห้าม commit `.env` หรือ `config.js`
- ใช้ Publishable Key เท่านั้น (key เก่า revoke แล้ว)

---
**Crystal Castle AI Factory · v1.4** | อัปเดต 22 เม.ย. 2026
