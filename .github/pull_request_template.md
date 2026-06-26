# 🏰 CrystalCastle Pull Request Template

## 📌 Description / รายละเอียด
**English:**  
Please describe the purpose of this PR and the APIs updated.  
**ไทย:**  
กรุณาอธิบายวัตถุประสงค์ของ PR และ API ที่อัปเดต  

---

## 🔄 Changes / การเปลี่ยนแปลง
- [ ] API endpoints updated  
- [ ] Documentation updated (`docs/repo-overview.md`, `archive/legacy-api.md`)  
- [ ] Environment variables updated (`.env.example`, `docs/environment-variables.md`)  

---

## ✅ Reviewer Checklist – API Integration PRs

### English
- [ ] No usage of **Fal API v1** (`api.fal.ai/v1/kling/generation`)  
- [ ] Uses **Fal API v2** (`fal.run/fal-ai/kling-video/v2/master/image-to-video`)  
- [ ] No usage of **Magic Hour synchronous flow**  
- [ ] Uses **Magic Hour async job flow**  
- [ ] No usage of **Supabase legacy auth (`auth/v1`)**  
- [ ] Uses **Supabase `auth/v2`** with JWT + RLS  
- [ ] No usage of **Gemini/Groq old endpoints** without authentication  
- [ ] Uses **latest Gemini model (`gemini-1.5-pro`)** with secure API key  
- [ ] No usage of **Video Engine synchronous endpoints**  
- [ ] Uses **async job endpoints** with polling/callback  
- [ ] Contributor updated **`archive/legacy-api.md`** if any API was deprecated  
- [ ] Contributor updated **`docs/environment-variables.md`** if new API keys are required  

### ภาษาไทย
- [ ] ไม่มีการเรียกใช้ **Fal API v1** (`api.fal.ai/v1/kling/generation`)  
- [ ] ใช้ **Fal API v2** (`fal.run/fal-ai/kling-video/v2/master/image-to-video`)  
- [ ] ไม่ใช้ **Magic Hour synchronous flow**  
- [ ] ใช้ **Magic Hour async job flow**  
- [ ] ไม่เรียก **Supabase legacy auth (`auth/v1`)**  
- [ ] ใช้ **Supabase `auth/v2`** พร้อม JWT + RLS  
- [ ] ไม่ใช้ **Gemini/Groq endpoints เก่า** ที่ไม่มีการ auth  
- [ ] ใช้ **Gemini รุ่นล่าสุด (`gemini-1.5-pro`)** พร้อม API key ที่ปลอดภัย  
- [ ] ไม่ใช้ **Video Engine synchronous endpoints**  
- [ ] ใช้ **async job endpoints** ที่รองรับ polling/callback  
- [ ] Contributor อัปเดต **`archive/legacy-api.md`** หากมี API ถูก deprecate  
- [ ] Contributor อัปเดต **`docs/environment-variables.md`** หากต้องเพิ่ม API keys ใหม่