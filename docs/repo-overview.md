# 🏰 CrystalCastle Repository Overview

## Purpose / วัตถุประสงค์
**English:**  
This document provides an overview of the CrystalCastle repository structure and PR governance flow.  
**ไทย:**  
เอกสารนี้อธิบายภาพรวมโครงสร้าง CrystalCastle และขั้นตอนการทำงานของ PR  

---

## 📂 Repo Structure / โครงสร้าง Repo
- **crystalcastle /**
  - README.md → Project overview / ภาพรวมโปรเจกต์  
  - CONTRIBUTING.md → Contributor guidelines / แนวทางสำหรับผู้ร่วมพัฒนา  
  - .env.example → Environment variables template / ตัวอย่าง environment variables  
- **.github / workflows** → CI/CD Scripts  
- **docs /** → Onboarding & Governance Docs / เอกสาร onboarding และ governance  
- **tests /** → Unit Tests / การทดสอบหน่วย  
- **frontend /** → UI/UX source code / โค้ดส่วน UI/UX  
- **archive /** → Legacy files / ไฟล์ที่เลิกใช้แล้ว  
  - old-workflows.md  
  - legacy-api.md  

---

## 🔄 PR Governance Flow / ขั้นตอนการทำงานของ PR
1. **Open PR** → Contributor เปิด Pull Request  
2. **feature / fix / docs** → ใช้ branch ตาม convention  
3. **Checklist & PR Template** → กรอก checklist และ template bilingual  
4. **CI/CD Pipeline** → GitHub Actions ตรวจสอบ  
   - CodeQL & Security Checks  
   - Unit Tests & Coverage  
5. **Reviewer Checklist** → Reviewer ตรวจสอบตาม checklist bilingual  
6. **Governance Review** → Reviewer enforce governance rules  
7. **Merge to Main** → เมื่อผ่านทุกขั้นตอน  

---

## ✅ Final Note / หมายเหตุสุดท้าย
**English:**  
This overview ensures contributors and reviewers understand repo structure and governance flow, reducing PR backlog and improving collaboration.  
**ไทย:**  
ภาพรวมนี้ช่วยให้ contributor และ reviewer เข้าใจโครงสร้าง repo และขั้นตอน governance ได้ตรงกัน ลด PR backlog และเพิ่มประสิทธิภาพการทำงานร่วมกัน