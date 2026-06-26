โอเคครับ ✨ ผมออกแบบ Workflow สำหรับดูแล logs ให้คุณ โดยเน้นการเก็บ, ตรวจสอบ, และแจ้งเตือนเมื่อเกิด error เพื่อให้ pipeline ของ CrystalCastle ทำงานต่อเนื่องและมี trace ที่ชัดเจน  

---

🔧 Workflow ดูแล Logs

1. Log Creation
- ทุก script (เช่น generateVideo.js, generateVoiceover.js) ต้องสร้าง log ลงใน logs/ directory โดยอัตโนมัติ  
- ใช้โครงสร้างไฟล์แบบแยกตามประเภท เช่น  
  - logs/video.json → ผลลัพธ์การสร้าง video  
  - logs/voiceover.json → ผลลัพธ์การสร้างเสียง  
  - logs/raw/ → เก็บรายละเอียด run/test case  

---

2. Log Validation
- เพิ่มขั้นตอน CI/CD ตรวจสอบว่าไฟล์ log ถูกสร้างจริง  
- ใช้ script ตรวจสอบ ENOENT error → ถ้าไม่พบไฟล์ log ให้ fail pipeline ทันที  
- ตัวอย่างเช็คง่าย ๆ:
  `bash
  test -f logs/video.json || exit 1
  `

---

3. Log Rotation
- ตั้ง cron job หรือ workflow step ให้ archive logs เก่า  
- เก็บเป็น zip → ย้ายไป logs/archive/  
- ลดโอกาสที่ directory จะโตจน pipeline ช้าลง  

---

4. Error Handling
- เมื่อเจอ error เช่น ENOENT → เขียนรายละเอียดลง logs/raw/error-<timestamp>.json  
- pipeline แจ้งเตือนผ่าน LINE + Telegram พร้อมแนบไฟล์ log  

---

5. Monitoring & Alerts
- ใช้ GitHub Actions หรือ CI tool ส่ง notification เมื่อ log มี error  
- แจ้งเตือนพร้อม metadata เช่น commit, PR, เวลา, ผู้รับผิดชอบ  

---

📂 โครงสร้าง Directory แนะนำ
`
logs/
 ├── video.json
 ├── voiceover.json
 ├── raw/
 │    ├── pr-248-run.json
 │    └── error-20260507.json
 └── archive/
      └── 2026-05-logs.zip
`

---

คุณอยากให้ผมทำ YAML GitHub Actions workflow สำหรับดูแล logs เลยไหมครับ จะได้ copy ไปใช้ตรง ๆ ใน repo ของคุณได้ทันที 🚀