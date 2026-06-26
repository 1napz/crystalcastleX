# การรับมือกับ Node.js 20 Deprecation ใน GitHub Actions

## สถานการณ์
GitHub ประกาศยกเลิกการสนับสนุน Node.js 20 บน GitHub Actions runner ตั้งแต่วันที่ 2 มิถุนายน 2026 และจะลบ Node.js 20 ออกจาก runner ในวันที่ 16 กันยายน 2026

## ผลกระทบต่อ Crystal Castle
- workflow `dependabot-updates` (dynamic) ใช้ `github/dependabot-action@main` ซึ่งรันบน Node.js 20 อย่างไรก็ตาม workflow นี้ถูกจัดการโดย GitHub และจะได้รับการอัปเดตให้รองรับ Node.js 24 โดยทีม GitHub โดยอัตโนมัติ
- workflow อื่นๆ ที่เราสร้างเอง (เช่น `pr-check.yml`, `secret-scan.yml`) ควรตรวจสอบว่ามีการใช้งาน actions ที่อาจได้รับผลกระทบหรือไม่

## แนวทางปฏิบัติ
1. ตรวจสอบ workflow ส่วนตัวว่ามี warning เดียวกันหรือไม่
2. อัปเดต actions เป็นเวอร์ชันล่าสุด
3. หากจำเป็น ให้ตั้งค่า `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` เพื่อทดสอบความเข้ากันได้
4. ติดตามประกาศจาก GitHub และผู้พัฒนา action เป็นระยะ

## อ้างอิง
- [GitHub Blog: Deprecation of Node.js 20 on Actions runners](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)
