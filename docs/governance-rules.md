# 🛡️ Governance Rules (CrystalCastle)

## Purpose / วัตถุประสงค์
**English:**  
This document defines governance rules for contributors and reviewers to maintain repo hygiene, enforce security, and ensure compliance.  
**ไทย:**  
เอกสารนี้กำหนดกฎ governance สำหรับ contributor และ reviewer เพื่อรักษา repo hygiene, บังคับใช้ security และให้เป็นไปตามมาตรฐาน  

---

## 🔹 Branch Protection / การป้องกัน Branch
- **English:** All PRs must target `main` via feature/fix/docs branches.  
- **ไทย:** ทุก PR ต้อง merge เข้าสู่ `main` ผ่าน branch `feature/`, `fix/`, หรือ `docs/`  

- **English:** Direct commits to `main` are prohibited.  
- **ไทย:** ห้าม commit โดยตรงไปที่ `main`  

---

## 🔹 Workflow Enforcement / การบังคับใช้ Workflow
- **English:** Use updated workflows in `.github/workflows/`.  
- **ไทย:** ต้องใช้ workflows ที่อัปเดตแล้วใน `.github/workflows/`  

- **English:** Archived workflows (`archive/old-workflows.md`) must not be reintroduced.  
- **ไทย:** ห้ามนำ workflows ที่ถูก archive (`archive/old-workflows.md`) กลับมาใช้อีก  

---

## 🔹 Security & Privacy / ความปลอดภัยและความเป็นส่วนตัว
- **English:** Secrets must be stored in `.env.local` and never committed.  
- **ไทย:** Secrets ต้องเก็บไว้ใน `.env.local` และห้าม commit  

- **English:** Security scans (CodeQL, Microsoft Defender) must pass before merge.  
- **ไทย:** Security scans (CodeQL, Microsoft Defender) ต้องผ่านก่อน merge  

---

## 🔹 Documentation / เอกสาร
- **English:** Contributors must update `docs/workflows.md` when workflows change.  
- **ไทย:** Contributor ต้องอัปเดต `docs/workflows.md` เมื่อ workflows มีการเปลี่ยนแปลง  

- **English:** Deprecated APIs must be recorded in `archive/legacy-api.md`.  
- **ไทย:** API ที่เลิกใช้แล้วต้องบันทึกไว้ใน `archive/legacy-api.md`  

---

## 🔹 Reviewer Responsibilities / หน้าที่ของ Reviewer
- **English:** Reviewers must enforce governance rules consistently.  
- **ไทย:** Reviewer ต้องบังคับใช้ governance rules อย่างสม่ำเสมอ  

- **English:** PRs failing governance checks must request changes.  
- **ไทย:** PR ที่ไม่ผ่าน governance checks ต้องถูกขอแก้ไข  

---

## ✅ Final Note / หมายเหตุสุดท้าย
**English:**  
Governance rules ensure repo hygiene, reduce PR backlog, and improve collaboration.  
**ไทย:**  
กฎ governance ช่วยรักษา repo hygiene, ลด PR backlog และปรับปรุงการทำงานร่วมกัน