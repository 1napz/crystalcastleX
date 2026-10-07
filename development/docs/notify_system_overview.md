# Notify System Overview

## 📌 วัตถุประสงค์
Notify System คือระบบกลางสำหรับการแจ้งเตือน (Notification) ของ CrystalCastle  
ทำหน้าที่เชื่อมโยง **Rules → Logs → Workflow → Reviewer Cockpit**  
เพื่อให้ทีมได้รับข้อมูลที่ครบถ้วน โปร่งใส และ bilingual (ไทย/English)

---

## 🔄 Workflow การทำงาน

1. **Daily Scan**  
   - ตรวจสอบ Security, Standard Performance, File Naming, PR Types  
   - สร้าง `version.json` พร้อมผลการตรวจ

2. **Notify Workflow**  
   - Trigger หลัง Daily Scan เสร็จ  
   - เรียก `notify.sh` เพื่ออ่าน `version.json`

3. **Notify Script**  
   - Format ข้อความ bilingual (ไทย/English)  
   - ส่งข้อความไป LINE Notify / Telegram / Slack

4. **Reviewer Cockpit**  
   - ได้รับข้อความแจ้งเตือนสั้น ๆ แต่ครบถ้วน  
   - สามารถเปิดดู `version.json` และ `logs/` เพื่อ audit trail

---

## 🔐 Security Rules
- API key rotation ทุก 90 วัน  
- Token expiry enforce ใน dashboard  
- License compliance ที่ repo root  
- Static analysis (SQL injection, XSS)

---

## ⚡ Standard Performance Rules
- PR backlog < 30 (ถ้าเกิน → auto-squash)  
- Build time < 5 นาที  
- Test coverage ≥ 80%  
- Daily scan (file naming + workflow health)

---

## 📂 โครงสร้าง Notify System