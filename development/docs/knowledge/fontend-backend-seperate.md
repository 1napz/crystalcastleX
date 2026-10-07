# การแบ่งโครงสร้างโปรเจกต์ (Frontend & Backend Separation)

ระบบนี้ถูกออกแบบโดยแยกส่วนการทำงานออกจากกันอย่างชัดเจน เพื่อความยืดหยุ่นในการพัฒนาและการขยายระบบในอนาคต

---

## 🏗️ สถาปัตยกรรมระบบ (System Architecture)

เราใช้วิธีการเชื่อมต่อแบบ **API-First Approach** โดยใช้ข้อมูลรูปแบบ JSON ในการสื่อสาร

### 1. Frontend (Client-side)
ส่วนติดต่อผู้ใช้ที่เน้นเรื่อง UI/UX และการตอบสนองที่รวดเร็ว
- **หน้าที่:** แสดงผลข้อมูล, จัดการ State ของหน้าจอ, ตรวจสอบข้อมูลเบื้องต้น (Validation)
- **เครื่องมือหลัก:** React / Vue.js / Tailwind CSS
- **การเชื่อมต่อ:** ส่ง Request ผ่าน `Axios` หรือ `Fetch API` ไปยัง Backend

### 2. Backend (Server-side)
ส่วนประมวลผลข้อมูลหลักและเชื่อมต่อฐานข้อมูล
- **หน้าที่:** ประมวลผล Business Logic, ระบบยืนยันตัวตน (Auth), จัดการฐานข้อมูล, สร้าง API Endpoints
- **เครื่องมือหลัก:** Node.js (Express) / Python (FastAPI) / Go
- **ฐานข้อมูล:** PostgreSQL / MongoDB

---

## 📂 โครงสร้างโฟลเดอร์ (Directory Structure)

นิยมจัดระเบียบโค้ดแบบแยก Folder หรือแยก Repository ดังนี้:

```text
my-project/
├── frontend/           # โค้ดส่วนหน้าบ้าน (React, Vue, etc.)
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/            # โค้ดส่วนหลังบ้าน (API, Database)
    ├── controllers/
    ├── models/
    ├── routes/
    └── package.json
```

---

## 🔄 ขั้นตอนการสื่อสาร (Communication Flow)

1. **User Interaction:** ผู้ใช้กดปุ่มบนหน้าเว็บ (Frontend)
2. **API Request:** Frontend ส่ง HTTP Request (GET/POST/PUT/DELETE) ไปยัง Backend
3. **Processing:** Backend ตรวจสอบสิทธิ์ และไปดึง/เขียน ข้อมูลใน Database
4. **JSON Response:** Backend ส่งข้อมูลกลับมาเป็นรูปแบบ JSON
5. **UI Update:** Frontend รับข้อมูลมา Update หน้าจอให้ผู้ใช้เห็น

---

## ✅ ข้อดีของการแยกส่วน
- **Scalability:** สามารถขยาย Server ฝั่ง Backend แยกกับ Hosting ฝั่ง Frontend ได้
- **Parallel Development:** ทีมหน้าบ้านและหลังบ้านทำงานพร้อมกันได้โดยไม่ทับซ้อนกัน
- **Reusability:** Backend ตัวเดิมสามารถนำไปใช้กับ Mobile App (iOS/Android) ได้ทันที
