# 🔐 Security Best Practices (CrystalCastle)

## Purpose / วัตถุประสงค์
**English:**  
This document defines security best practices for contributors to protect sensitive data, enforce governance, and maintain repo hygiene.  
**ไทย:**  
เอกสารนี้กำหนดแนวทางปฏิบัติด้านความปลอดภัยสำหรับ contributor เพื่อปกป้องข้อมูลสำคัญ, บังคับใช้ governance และรักษา repo hygiene  

---

## 🔹 Secrets Management / การจัดการ Secrets
- **English:** Store all secrets in `.env.local` and never commit them.  
- **ไทย:** เก็บ secrets ทั้งหมดไว้ใน `.env.local` และห้าม commit  

- **English:** Use GitHub Actions secrets for CI/CD workflows.  
- **ไทย:** ใช้ GitHub Actions secrets สำหรับ CI/CD workflows  

- **English:** Rotate API keys regularly and revoke unused ones.  
- **ไทย:** เปลี่ยน API keys เป็นระยะ และยกเลิก keys ที่ไม่ได้ใช้งาน  

---

## 🔹 Secure Coding / การเขียนโค้ดอย่างปลอดภัย
- **English:** Avoid hardcoding credentials in source code.  
- **ไทย:** หลีกเลี่ยงการ hardcode credentials ใน source code  

- **English:** Validate all user inputs to prevent injection attacks.  
- **ไทย:** ตรวจสอบข้อมูลที่ผู้ใช้กรอกเพื่อป้องกันการโจมตีแบบ injection  

- **English:** Use HTTPS for all API calls.  
- **ไทย:** ใช้ HTTPS สำหรับ API calls ทุกครั้ง  

---

## 🔹 Dependency Management / การจัดการ Dependencies
- **English:** Keep dependencies updated to the latest secure versions.  
- **ไทย:** อัปเดต dependencies ให้เป็นเวอร์ชันล่าสุดที่ปลอดภัย  

- **English:** Run `npm audit` and fix vulnerabilities before merging PRs.  
- **ไทย:** รัน `npm audit` และแก้ไขช่องโหว่ก่อน merge PR  

---

## 🔹 Security Scans / การตรวจสอบความปลอดภัย
- **English:** All PRs must pass CodeQL and Microsoft Defender scans.  
- **ไทย:** ทุก PR ต้องผ่านการตรวจสอบด้วย CodeQL และ Microsoft Defender  

- **English:** Review scan reports and address flagged issues immediately.  
- **ไทย:** ตรวจสอบรายงานการสแกนและแก้ไขปัญหาที่พบทันที  

---

## ✅ Final Note / หมายเหตุสุดท้าย
**English:**  
Following these best practices ensures contributor safety, protects sensitive data, and maintains repo hygiene.  
**ไทย:**  
การปฏิบัติตามแนวทางนี้ช่วยให้ contributor ทำงานได้อย่างปลอดภัย, ปกป้องข้อมูลสำคัญ และรักษา repo hygiene