# 🗄️ Legacy API Archive (Bilingual)

## 📌 Purpose / วัตถุประสงค์
**English:**  
This document records deprecated or legacy APIs that must not be used in CrystalCastle. Contributors must migrate to modern, secure endpoints before merging PRs.  

**ไทย:**  
เอกสารนี้ใช้บันทึก API ที่ถูก deprecate หรือเลิกใช้แล้ว ซึ่งห้ามใช้ใน CrystalCastle โดย contributor ต้องย้ายไปใช้ endpoint ที่ทันสมัยและปลอดภัยก่อน merge PR  

---

## ❌ Deprecated APIs / API ที่เลิกใช้แล้ว

### Fal API
- `api.fal.ai/v1/kling/generation` → ❌ Deprecated  
- **Migration:** Use `fal.run/fal-ai/kling-video/v2/master/image-to-video`  

### Magic Hour
- Synchronous flow → ❌ Deprecated  
- **Migration:** Use async job flow  

### Supabase
- `auth/v1` legacy auth → ❌ Deprecated  
- **Migration:** Use `auth/v2` with JWT + RLS  

### Gemini/Groq
- Old endpoints without authentication → ❌ Deprecated  
- **Migration:** Use `gemini-1.5-pro` with secure API key  

### Video Engine
- Synchronous endpoints → ❌ Deprecated  
- **Migration:** Use async job endpoints with polling/callback  

---

## ⚠️ Governance Rules / กฎการบังคับใช้
**English:**  
- Contributors must update this file whenever an API is deprecated.  
- Reviewers must reject PRs that reference legacy APIs.  
- Environment variables for new APIs must be documented in `docs/environment-variables.md`.  

**ไทย:**  
- Contributor ต้องอัปเดตไฟล์นี้ทุกครั้งที่มี API ถูก deprecate  
- Reviewer ต้อง reject PR ที่ยังอ้างอิง API เก่า  
- Environment variables สำหรับ API ใหม่ต้องถูกบันทึกใน `docs/environment-variables.md`  

---

## ✅ Summary / สรุป
**English:**  
This archive enforces API governance by documenting deprecated endpoints and guiding contributors to secure replacements.  

**ไทย:**  
เอกสารนี้ช่วยบังคับใช้ governance ของ API โดยบันทึก endpoint ที่เลิกใช้และแนะนำให้ contributor ย้ายไปใช้ endpoint ที่ปลอดภัย
