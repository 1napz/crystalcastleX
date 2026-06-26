# CrystalCastle Secrets Management Guide

## 🔒 หลักการสำคัญ (Key Principles)
- **ห้าม commit secrets** เช่น API keys, tokens, หรือ `.env.local` ลง GitHub
- ใช้ `.env.example` เป็น template สำหรับ contributor
- เก็บ secrets ใน **GitHub Actions secrets** หรือ **Vercel Dashboard**
- Reviewer ต้องตรวจสอบทุก PR ว่าไม่มี secrets จริงหลุดเข้ามา

---

## 🛠️ GitHub Actions Secrets

### วิธีตั้งค่า (How to set up)
1. ไปที่ **Repository → Settings → Secrets and variables → Actions**
2. กด **New repository secret**
3. เพิ่มค่า เช่น:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`

### ตัวอย่างการใช้ใน workflow
```yaml
env:
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
