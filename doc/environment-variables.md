# ⚙️ Environment Variables – Crystal Castle

เอกสารนี้อธิบายรายละเอียดของ environment variables ที่ใช้ในโปรเจกต์ Crystal Castle  
รวมถึงวิธีการขอ API key, ตัวอย่างค่า, และผลกระทบถ้าไม่ตั้งค่า

---

## 🔑 Supabase

- **NEXT_PUBLIC_SUPABASE_URL**  
  - URL ของ Supabase project (เช่น `https://xyzcompany.supabase.co`)  
  - ใช้สำหรับเชื่อมต่อฐานข้อมูลและ storage ฝั่ง client  
  - ❌ ถ้าไม่ตั้งค่า → แอปจะไม่สามารถเชื่อมต่อ Supabase ได้เลย

- **NEXT_PUBLIC_SUPABASE_ANON_KEY**  
  - Public anon key สำหรับ client  
  - ใช้ร่วมกับ URL เพื่อให้ผู้ใช้สามารถอัปโหลด/ดึงข้อมูลจาก Supabase  
  - ❌ ถ้าไม่ตั้งค่า → ฟีเจอร์ upload และ storage จะไม่ทำงาน

- **SUPABASE_SERVICE_ROLE_KEY**  
  - Service role key สำหรับ API routes ฝั่ง server เท่านั้น  
  - ห้าม commit ไป client หรือเผยแพร่สาธารณะ  
  - ใช้สำหรับการทำงานที่ต้องสิทธิ์สูง เช่น artifact management  
  - ❌ ถ้าไม่ตั้งค่า → API routes บางตัวจะล้มเหลว

---

## 🤖 AI Prompt/Caption Generation

- **GROQ_API_KEY**  
  - ใช้ Groq (Llama 3.3) สำหรับ AI prompt/caption generation  
  - ต้องสมัคร Groq API และนำ key มาใส่  
  - ❌ ถ้าไม่ตั้งค่า → ฟีเจอร์ AI caption/prompt จะไม่ทำงาน

- **GEMINI_API_KEY** *(optional fallback)*  
  - ใช้ Gemini เมื่อ Groq ล้มเหลว  
  - แนะนำให้ใส่เพื่อความเสถียร  
  - ❌ ถ้าไม่ตั้งค่า → ระบบจะไม่มี fallback เมื่อ Groq down

---

## 🎬 Video Engine Keys

ต้องมีอย่างน้อยหนึ่งค่าเพื่อให้ระบบสร้างวิดีโอได้จริง:

- **FAL_KEY** → ใช้ FAL Kling  
- **MAGIC_HOUR_API_KEY** → ใช้ Magic Hour  
- **RUNWAYML_API_SECRET** → ใช้ RunwayML  
- **PIKA_API_KEY** → ใช้ Pika  
- **NEXA_API_KEY** → ใช้ Nexa  
- **WAVESPEED_API_KEY** → ใช้ Wavespeed  

❌ ถ้าไม่ตั้งค่าเลย → ระบบจะไม่สามารถสร้างวิดีโอ AI ได้

---

## 🧪 Development / Mock Mode

- **NEXT_PUBLIC_USE_MOCK=true**  
  - เปิด mock mode เพื่อทดสอบโดยไม่ใช้เครดิตจริง  
  - ใช้ fake video files และ prompt templates แทน API จริง  
  - ✅ เหมาะสำหรับ local dev และ CI/CD test  
  - ⚠️ เมื่อเปิด mock mode จะมี badge “🔮 MOCK MODE” บน UI

---

## 📌 วิธีขอ API Keys

- **Supabase** → สมัครฟรีที่ [https://supabase.com](https://supabase.com)  
- **Groq** → สมัครที่ [https://groq.com](https://groq.com)  
- **Gemini** → สมัครที่ [https://ai.google.dev](https://ai.google.dev)  
- **FAL / Magic Hour / RunwayML / Pika / Nexa / Wavespeed** → สมัครตาม provider ที่เลือกใช้  

---

## 🛡️ Security Notes

- ห้าม commit `.env.local` หรือ key จริงลง GitHub  
- ใช้ Vercel Dashboard → Project Settings → Environment Variables  
- แยก key เป็น 2 กลุ่ม:  
  - `NEXT_PUBLIC_*` → ใช้ได้ใน client  
  - คีย์ที่ไม่มี prefix → ใช้เฉพาะ server  

---

## 📖 Reference

- [`setup-config/privacy.yml`](../setup-config/privacy.yml) – Privacy policy enforcement  
- [`docs/privacy.md`](./privacy.md) – Transparency document  
- [`Contribute.md`](../Contribute.md) – Contributor onboarding & governance