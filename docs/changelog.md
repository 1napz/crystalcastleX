# 📜 CrystalCastle CHANGELOG (Bilingual)

## 📌 Purpose / วัตถุประสงค์
**English:**  
This changelog documents all notable changes to CrystalCastle, including features, fixes, and governance updates.  

**ไทย:**  
CHANGELOG นี้บันทึกการเปลี่ยนแปลงที่สำคัญทั้งหมดของ CrystalCastle รวมถึงฟีเจอร์ใหม่, การแก้ไข และการอัปเดตด้าน governance  

---

## 🗂 Format / รูปแบบ
**English:**  
- Version number (e.g., `v1.2.0`)  
- Release date  
- Categories: Added, Changed, Fixed, Security, Governance  
- Reviewer impact notes  

**ไทย:**  
- หมายเลขเวอร์ชัน (เช่น `v1.2.0`)  
- วันที่ release  
- หมวดหมู่: Added, Changed, Fixed, Security, Governance  
- หมายเหตุผลกระทบต่อ Reviewer  

---

## 📊 Example Entry / ตัวอย่างการบันทึก
**English:**  
### v1.2.0 — 2026-05-06  
**Added:**  
- New Supabase integration for video logging.  
- Bilingual onboarding guide (`docs/onboarding.md`).  

**Changed:**  
- Updated CI/CD workflow to include quota monitoring.  

**Fixed:**  
- Resolved lint errors in `src/utils/helpers.ts`.  

**Security:**  
- Secrets migrated to GitHub Actions.  

**Governance:**  
- Reviewer checklist updated with bilingual enforcement.  

**Reviewer Impact:**  
- Reviewers must reject PRs missing bilingual docs.  
- CI/CD logs now include quota alerts.  

---

**ไทย:**  
### v1.2.0 — 2026-05-06  
**Added:**  
- เพิ่ม Supabase integration สำหรับ video logging  
- เพิ่มคู่มือ onboarding สองภาษา (`docs/onboarding.md`)  

**Changed:**  
- อัปเดต CI/CD workflow ให้ตรวจสอบ quota  

**Fixed:**  
- แก้ lint errors ใน `src/utils/helpers.ts`  

**Security:**  
- ย้าย secrets ไปเก็บใน GitHub Actions  

**Governance:**  
- อัปเดต reviewer checklist ให้บังคับใช้เอกสารสองภาษา  

**Reviewer Impact:**  
- Reviewer ต้อง reject PR ที่ไม่มีเอกสารสองภาษา  
- CI/CD logs ตอนนี้มี quota alerts
