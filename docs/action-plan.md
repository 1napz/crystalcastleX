# 📌 Crystal Castle Action Plan

## P0 (เร่งด่วน)
- [ ] แก้ชื่อ directory/file ที่มีอักขระพิเศษ เช่น `Development/#` → ใช้ชื่อที่ปลอดภัย
- [ ] เพิ่ม Unit Tests จาก 0% → อย่างน้อย 50% ก่อนเพิ่มฟีเจอร์ใหม่
- [ ] กำหนด Smoke Tests (CI/CD):
  - User Login
  - Upload Image
  - Generate AI Prompt
  - View Gallery

## P1 (สำคัญต่อธุรกิจ)
- [ ] เพิ่ม LLM-Evaluation Tests → ตรวจสอบ keyword/JSON schema ของ AI output
- [ ] เพิ่ม Circuit Breaker Test → ป้องกันการเรียก API เกิน quota
- [ ] ยกระดับ UI/UX Tests เป็น P1 → ใช้ Playwright Visual Comparisons ตรวจสอบ branding/logo

## P2 (เสริมความปลอดภัยและรายได้)
- [ ] Security Tests:
  - File Injection → ป้องกัน upload .php/.exe
  - Supabase RLS Verification → User_A ไม่เห็นข้อมูล User_B
- [ ] Affiliate Link Integrity:
  - สร้าง Link Scraper test รันทุก 24 ชม.
  - ตรวจสอบ Shopee links ไม่ชี้ไป 404 หรือสินค้าหมดสต็อก

## Next Steps
- [ ] ตัดสินใจว่า Affiliate Link Integrity จะทำใน **Backend** หรือสร้างเป็น **AI Agent แยกต่างหาก**
- [ ] เพิ่มการจัดการ Error Logging → เช่น Rate Limit Exceeded warnings