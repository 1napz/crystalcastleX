
---

## 📄 4. `doc/environment-variables.md`

```markdown
# Environment Variables สำหรับ Crystal Castle

## บน Vercel (Production + Preview)

ต้องตั้งค่าตัวแปรเหล่านี้ใน Vercel Dashboard → Project → Settings → Environment Variables

| ชื่อตัวแปร | ค่า | จำเป็น | หมายเหตุ |
|-----------|-----|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL ของ Supabase project | ✅ | ใช้ใน `supabase-client.js` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key จาก Supabase | ✅ | Public key |
| `GROQ_API_KEY` | API Key จาก Groq | ⚠️ | ถ้าไม่มี → Prompt จะใช้ fallback |
| `FAL_KEY` | API Key จาก fal.ai | ⚠️ | ถ้าไม่มี → วิดีโอ Kling เป็น sample |
| `MAGIC_HOUR_API_KEY` | API Key จาก Magic Hour | ⚠️ | ถ้าไม่มี → วิดีโอ Magic Hour เป็น sample |
| `TELEGRAM_BOT` | Bot Token | optional | สำหรับ webhook |
| `TELEGRAM_CHAT_ID` | Chat ID | optional | สำหรับ webhook |

**การกำหนดขอบเขต (Environments):**
- ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` จะถูกเปิดเผยทั้ง client และ server → ใช้เฉพาะ anon key เท่านั้น
- ตัวแปรอื่น (เช่น `FAL_KEY`) ให้เลือกเฉพาะ **Production** หรือ **Preview** ตามต้องการ

## บน GitHub (Secrets สำหรับ Actions)

ไปที่ repo → Settings → Secrets and variables → Actions → New repository secret

| ชื่อ Secret | ค่า |
|-------------|-----|
| `VERCEL_TOKEN` | Personal Access Token จาก Vercel (สร้างที่ Account Settings → Tokens) |
| `VERCEL_ORG_ID` | ดูได้จากไฟล์ `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | ดูได้จากไฟล์ `.vercel/project.json` |

## สำหรับ Local Development (`.env.local`)

สร้างไฟล์ `.env.local` ที่ root (ห้าม commit ขึ้น GitHub) ใช้สำหรับ `vercel dev`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GROQ_API_KEY=your_groq_key
FAL_KEY=your_fal_key
MAGIC_HOUR_API_KEY=your_magic_hour_key