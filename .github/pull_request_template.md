# 📌 CrystalCastle Pull Request Template / เทมเพลต Pull Request ของ CrystalCastle

## 📝 Description / รายละเอียด
Please describe the changes introduced in this PR.  
โปรดอธิบายการเปลี่ยนแปลงที่นำมาใน PR นี้

---

## ✅ Checklist for Contributors / เช็คลิสต์สำหรับผู้ส่ง PR
- [ ] I have read the [Onboarding Guide](./instructions/Onboarding.md)  
  ฉันได้อ่าน [คู่มือการเริ่มต้นใช้งาน](./instructions/Onboarding.md) แล้ว
- [ ] `.vercelignore` exists and excludes unnecessary files  
  มีไฟล์ `.vercelignore` และตัดไฟล์ที่ไม่จำเป็นออกแล้ว
- [ ] Copilot CLI installed and verified (`copilot --version`)  
  ติดตั้ง Copilot CLI และตรวจสอบแล้ว (`copilot --version`)
- [ ] Authentication completed (`copilot /login`)  
  ยืนยันตัวตนเรียบร้อยแล้ว (`copilot /login`)
- [ ] Mock mode tested (`npm run dev:mock`)  
  ทดสอบโหมด Mock แล้ว (`npm run dev:mock`)
- [ ] API routes lightweight, shared logic in `/lib/`  
  เส้นทาง API เบา และ logic ที่ใช้ร่วมกันอยู่ใน `/lib/`
- [ ] Supabase RLS policies + `groq_logs` table verified  
  ตรวจสอบนโยบาย RLS ของ Supabase และตาราง `groq_logs` แล้ว
- [ ] Vercel plan quota checked (Hobby vs Pro)  
  ตรวจสอบโควต้า Vercel แล้ว (Hobby vs Pro)

---

## 🔎 Checklist for Governance / เช็คลิสต์ด้าน Governance
- [ ] `.env.local` มี `FAL_KEY` และ `MAGIC_HOUR_API_KEY`  
- [ ] FAL endpoint และ payload ถูกต้อง (`duration` เป็น string, `aspect_ratio = "9:16"`)  
- [ ] Magic Hour workflow ใช้ async (Upload → Job → Polling → Download)  
- [ ] Docstring coverage ≥ 80% และ bilingual  
- [ ] `README.md` มี Quick Start bilingual block  
- [ ] `CHANGELOG.md` มี entry ล่าสุด  
- [ ] `RELEASE_NOTES.md` bilingual + Reviewer Impact  
- [ ] `.coderabbit.yaml` ใช้ schema v2 และ validate ผ่าน  
- [ ] Branch naming rules ถูกต้อง (`feature/*`, `fix/*`, `docs/*`, `chore/*`)  
- [ ] Auto-comment bilingual reminders ทำงาน  
- [ ] CI/CD workflows ครบถ้วน (lint/test/build/deploy + security scan + governance enforcement)

---

## 👥 Reviewer Enforcement / การบังคับใช้สำหรับ Reviewer
Reviewers must confirm the following before approval:  
ผู้ตรวจสอบต้องยืนยันสิ่งต่อไปนี้ก่อนอนุมัติ:

- [ ] Contributor checklist completed  
  เช็คลิสต์ของผู้ส่ง PR ทำครบแล้ว
- [ ] Governance checklist completed  
  เช็คลิสต์ด้าน Governance ทำครบแล้ว
- [ ] Governance flow followed (see [ReviewerChecklist.md](./workflows/ReviewerChecklist.md))  
  ปฏิบัติตาม Flow ของ Governance (ดู [ReviewerChecklist.md](./workflows/ReviewerChecklist.md))

---

## 🚀 Notes / หมายเหตุ
Please include any additional context, screenshots, or references.  
โปรดใส่บริบทเพิ่มเติม, ภาพหน้าจอ, หรือแหล่งอ้างอิง

---

## ✅ Final Decision / การตัดสินใจสุดท้าย
- ถ้าทุกข้อผ่าน → ✅ Merge ได้  
- ถ้ามีข้อไม่ผ่าน → ⚠️ ต้องแก้ไขก่อน Merge