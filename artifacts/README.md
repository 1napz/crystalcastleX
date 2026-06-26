# 📦 Artifacts Folder / โฟลเดอร์ Artifacts

This folder contains artifacts generated from workflows or manual runs, such as PDF exports, logs, and reports.  
โฟลเดอร์นี้ใช้เก็บผลลัพธ์ (artifacts) ที่สร้างจาก workflow หรือการรันงานแบบ manual เช่น PDF, log, และรายงาน

## 📌 Policy / นโยบาย
- Files in `artifacts/` must be outputs from workflows or manual runs only.  
  ไฟล์ใน `artifacts/` ต้องเป็นผลลัพธ์จาก workflow หรือการรันงานแบบ manual เท่านั้น
- Files here are **not production code**.  
  ไฟล์ในนี้ **ไม่ใช่โค้ดสำหรับ production**
- Reviewer must confirm that artifacts are temporary and not mixed with source code.  
  ผู้ตรวจสอบต้องยืนยันว่า artifacts เป็นไฟล์ชั่วคราว และไม่ปะปนกับ source code
- Files must be clearly named (e.g., `ReviewerPolicy.pdf`, `test-report-YYYYMMDD.log`).  
  ต้องตั้งชื่อไฟล์ให้ชัดเจน (เช่น `ReviewerPolicy.pdf`, `test-report-YYYYMMDD.log`)
- Files must be cleaned up or archived after review.  
  ไฟล์ต้องถูกลบหรือเก็บเข้าคลังหลังรีวิวเสร็จ