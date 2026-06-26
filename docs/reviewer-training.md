# 👩‍💻 Reviewer Training Guide (CrystalCastle)

## Purpose / วัตถุประสงค์
**English:**  
This guide provides training for new reviewers to ensure consistent governance, security, and repo hygiene across all PRs.  
**ไทย:**  
คู่มือนี้ใช้สำหรับ reviewer ใหม่ เพื่อให้การตรวจสอบ PR มีมาตรฐานเดียวกันด้าน governance, security และ repo hygiene  

---

## 🔹 Review Workflow / ขั้นตอนการตรวจสอบ
1. **English:** Read PR description and confirm clarity.  
   **ไทย:** อ่านรายละเอียด PR และตรวจสอบว่าชัดเจน  
2. **English:** Verify CI/CD checks (lint, tests, coverage) passed.  
   **ไทย:** ตรวจสอบว่า CI/CD checks (lint, tests, coverage) ผ่านครบ  
3. **English:** Check security scans (Microsoft Defender, CodeQL).  
   **ไทย:** ตรวจสอบผล security scans (Microsoft Defender, CodeQL)  
4. **English:** Ensure no archived workflows or legacy APIs are reintroduced.  
   **ไทย:** ตรวจสอบว่าไม่มีการนำ workflows หรือ API ที่ถูก archive กลับมาใช้อีก  
5. **English:** Confirm documentation updates (`docs/workflows.md`, `archive/old-workflows.md`).  
   **ไทย:** ยืนยันว่ามีการอัปเดตเอกสาร (`docs/workflows.md`, `archive/old-workflows.md`)  

---

## 🔹 Reviewer Checklist / รายการตรวจสอบสำหรับ Reviewer
- [ ] **English:** Governance rules enforced  
      **ไทย:** กฎ governance ถูกบังคับใช้อย่างครบถ้วน  
- [ ] **English:** Security scans passed  
      **ไทย:** Security scans ผ่านครบ  
- [ ] **English:** Test coverage sufficient  
      **ไทย:** Test coverage ครอบคลุมเพียงพอ  
- [ ] **English:** No secrets exposed  
      **ไทย:** ไม่มี secrets ถูกเปิดเผย  
- [ ] **English:** Documentation updated  
      **ไทย:** เอกสารถูกอัปเดตแล้ว  

---

## 🔹 Reviewer Comments / ข้อความสำหรับ Reviewer
**English:**  
Use bilingual reviewer comments to provide clear, actionable feedback to contributors.  
**ไทย:**  
Reviewer ควรใช้ reviewer comments แบบ bilingual เพื่อให้ feedback ที่ชัดเจนและนำไปแก้ไขได้จริง  

---

## ✅ Final Note / หมายเหตุสุดท้าย
**English:**  
Consistent reviewer training ensures faster PR throughput, reduced backlog, and improved repo hygiene.  
**ไทย:**  
การฝึก reviewer อย่างสม่ำเสมอช่วยให้ PR ผ่านได้เร็วขึ้น ลด backlog และปรับปรุง repo hygiene
