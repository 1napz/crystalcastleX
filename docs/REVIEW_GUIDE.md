# Crystal Castle – Reviewer Guide

## 🔧 ระบบ Reviewer อัตโนมัติ
Crystal Castle ใช้ไฟล์ `.github/CODEOWNERS` เพื่อกำหนด reviewer สำหรับแต่ละโฟลเดอร์/ไฟล์  
ทุก PR จะถูก assign reviewer อัตโนมัติ โดยมี **@coderabbitai** เป็น reviewer หลักเสมอ

## 📂 การแบ่งความรับผิดชอบ
- **lib/** → @coderabbitai, @1napz  
  ตรวจสอบโค้ดหลัก, fallback logic, modularization
- **.github/** → @coderabbitai, @1napz  
  ตรวจสอบ CI/CD, branch protection, automation
- **docs/** → @coderabbitai, @team-docs  
  ตรวจสอบเอกสาร, onboarding guide
- **tests/** → @coderabbitai, @qa-team  
  ตรวจสอบ unit test, coverage
- **config/** → @coderabbitai, @devops-team  
  ตรวจสอบ environment, quota/rate limit management
- **security/** → @coderabbitai, @team-security  
  ตรวจสอบ dependency, vulnerability, policy compliance

## ✅ Workflow การ Review PR
1. เปิด PR → GitHub auto-assign reviewer ตาม `CODEOWNERS`
2. CI/CD checks (`lint`, `test`, `build`, `security`) ต้องผ่านทั้งหมด
3. Reviewer ที่ถูก assign ต้อง approve อย่างน้อย 1 คน
4. ถ้าไฟล์อยู่ใน `CODEOWNERS` → ต้องมีการ approve จาก code owner ด้วย
5. เมื่อครบทุกเงื่อนไข → PR สามารถ merge ได้

## 📌 ข้อดีของระบบนี้
- ลดภาระการ assign reviewer ด้วยมือ
- ทำให้การ review เป็นระบบและตรงกับความเชี่ยวชาญของแต่ละทีม
- ป้องกันการ merge โค้ดที่ไม่ผ่าน QA หรือ security