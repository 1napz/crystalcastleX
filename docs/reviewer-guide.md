# 🧭 Reviewer Guide (CrystalCastle)

## Purpose / วัตถุประสงค์
**English:**  
This guide helps reviewers (owners) know the next step after each PR stage.  
**ไทย:**  
คู่มือนี้ช่วย reviewer (owner) เข้าใจขั้นตอนถัดไปหลังจากแต่ละ stage ของ PR  

---

## 🔹 Workflow Steps / ขั้นตอนการทำงาน

1. **Initial PR Check / ตรวจสอบเบื้องต้น**
   - English: Confirm PR title, description, and linked issue.  
   - ไทย: ตรวจสอบว่า PR title, description และ issue ที่เกี่ยวข้องถูกต้อง  

   👉 Next Step: Run `@coderabbitai summary` to generate PR summary  

2. **Incremental Review / ตรวจสอบแบบเพิ่มทีละส่วน**
   - English: Use when PR has new commits after initial review.  
   - ไทย: ใช้เมื่อมี commit ใหม่หลังจาก review ครั้งแรก  

   👉 Next Step: Run `@coderabbitai review`  

3. **Full Review / ตรวจสอบใหม่ทั้งหมด**
   - English: Use when PR scope changed significantly.  
   - ไทย: ใช้เมื่อ scope ของ PR เปลี่ยนไปมาก  

   👉 Next Step: Run `@coderabbitai full review`  

4. **Unit Test Generation / สร้าง Unit Test**
   - English: Use when PR introduces new logic or functions.  
   - ไทย: ใช้เมื่อ PR เพิ่ม logic หรือ function ใหม่  

   👉 Next Step: Run `@coderabbitai generate unit tests`  

---

## 🔹 Reviewer Checklist / รายการตรวจสอบ

- [ ] PR description is clear / รายละเอียด PR ชัดเจน  
- [ ] CI/CD checks passed / CI/CD checks ผ่านครบ  
- [ ] Security scans show no vulnerabilities / ไม่พบช่องโหว่  
- [ ] Documentation updated / เอกสารถูกอัปเดตแล้ว  

---

## 🔹 Quick Reference Table / ตารางอ้างอิงเร็ว

| Command                        | When to Use (English)                  | ใช้เมื่อ (ไทย)                       |
|--------------------------------|----------------------------------------|---------------------------------------|
| `@coderabbitai summary`        | After initial PR submission            | หลังจากเปิด PR ครั้งแรก               |
| `@coderabbitai review`         | After new commits                      | เมื่อมี commit ใหม่                   |
| `@coderabbitai full review`    | When PR scope changes significantly    | เมื่อ scope ของ PR เปลี่ยนมาก         |
| `@coderabbitai generate unit tests` | When new logic/functions are added | เมื่อมี logic/function ใหม่            |