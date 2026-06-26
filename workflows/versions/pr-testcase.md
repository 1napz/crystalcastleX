#----------
pr-testcase.yml
#----------

⚡ Better Performance

ก่อน
- ทดสอบเฉพาะ code logic (Java/Gradle, Node.js, Python)  
- ไม่ครอบคลุม integration กับฐานข้อมูลจริง  
- Reviewer เห็นผลลัพธ์ test แต่ไม่มั่นใจว่า code ทำงานได้กับ DB environment จริง  

หลัง
- ครอบคลุมมากขึ้น: รัน test บนหลาย OS, JDK, Gradle, Node.js, Python พร้อมฐานข้อมูลจริง (Postgres + MySQL)  
- เพิ่มความมั่นใจ: ตรวจสอบ compatibility ของระบบกับ DB ที่ใช้จริงใน production  
- ลด bug หลัง deploy: เพราะเจอปัญหา DB integration ตั้งแต่ CI stage  
- ยังคงใช้ cache (Gradle, npm) → ลดเวลา build/test แม้ matrix ใหญ่ขึ้น  
- Summary รวมผลลัพธ์ทุก combination → reviewer เห็นภาพรวมชัดเจนใน comment เดียว  

---

🏆 สรุป
- Latest change: เพิ่ม Database matrix (PostgreSQL + MySQL)  
- Better performance: Workflow ครอบคลุมทั้ง OS, JDK, Gradle, Node.js, Python และ DB → ทำให้ CI/CD pipeline มีความน่าเชื่อถือสูงขึ้น, ลด bug integration, และยัง optimize ด้วย cache  

---
