# 📜 Legacy API (CrystalCastle)

## Purpose / วัตถุประสงค์
**English:**  
This document records deprecated or legacy APIs that must not be reintroduced into the repository.  
**ไทย:**  
เอกสารนี้บันทึก API ที่ถูกเลิกใช้งานแล้ว และห้ามนำกลับมาใช้ใน repository  

---

## 🔹 Deprecated APIs / API ที่เลิกใช้แล้ว
- **Fal API (old endpoint)** → `api.fal.ai/v1/kling/generation`  
- **Magic Hour synchronous flow** → replaced by async job flow  
- **Supabase legacy auth route** → replaced by new `auth/v2`  

---

## 🔹 Governance Notes / หมายเหตุด้าน Governance
- Contributors must update this file whenever an API is deprecated.  
- Reviewers must check PRs to ensure no legacy APIs are reintroduced.  
- This file is part of repo hygiene enforcement.  

---

## ✅ Final Note / หมายเหตุสุดท้าย
**English:**  
Maintaining this file ensures clarity, prevents regressions, and enforces governance rules.  
**ไทย:**  
การบันทึกไฟล์นี้ช่วยให้ contributor เข้าใจตรงกัน ป้องกันการย้อนกลับ และบังคับใช้กฎ governance