`markdown

🔑 Environment Variables Guide (Bilingual)

📌 Purpose / วัตถุประสงค์
English:  
This document explains required environment variables for CrystalCastle deployments. Contributors must configure these variables locally and reviewers must validate them in PRs.  

ไทย:  
เอกสารนี้อธิบาย environment variables ที่จำเป็นสำหรับการ deploy CrystalCastle โดย contributor ต้องตั้งค่าในเครื่อง และ reviewer ต้องตรวจสอบใน PR  

---

🗂 Required Variables / ตัวแปรที่จำเป็น

🔐 Vercel Deployment
- VERCEL_TOKEN → Authentication token for Vercel  
- VERCELORGID → Organization ID for Vercel project  
- VERCELPROJECTID → Project ID for CrystalCastle deployment  

🛡 Supabase
- SUPABASE_URL → Supabase project URL  
- SUPABASE_KEY → Supabase service key (use JWT + RLS)  

📡 APIs
- FALAPIKEY → Key for Fal API v2 (fal.run/fal-ai/kling-video/v2/master/image-to-video)  
- MAGICHOURKEY → Key for Magic Hour async job flow  
- GEMINIAPIKEY → Key for Gemini 1.5 Pro secure endpoint  
- VIDEOENGINEKEY → Key for async video engine jobs  

📲 Alerts
- TELEGRAMBOTTOKEN → Token for Telegram workflow alerts  
- TELEGRAMCHATID → Chat ID for sending notifications  

---

⚠️ Governance Rules / กฎการบังคับใช้
English:  
- Legacy API keys must be moved to archive/legacy-api.md  
- New variables must be documented here before merging PRs  
- Secrets must be added in GitHub → Settings → Secrets → Actions  

ไทย:  
- API keys เก่าต้องย้ายไปที่ archive/legacy-api.md  
- ตัวแปรใหม่ต้องถูกบันทึกไว้ที่นี่ก่อน merge PR  
- Secrets ต้องถูกเพิ่มใน GitHub → Settings → Secrets → Actions  

---
