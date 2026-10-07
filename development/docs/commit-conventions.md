# หลักการเขียน Commit Message (Conventional Commits)

เพื่อให้การ generate changelog และการ version release เป็นอัตโนมัติ เรายึดหลัก [Conventional Commits](https://www.conventionalcommits.org/)

## รูปแบบ

<type>(<scope>): <subject>

- `type`: ประเภทของการเปลี่ยนแปลง (จำเป็น)
- `scope`: ส่วนของโปรเจกต์ที่ได้รับผล (optional) เช่น `api`, `product`, `docs`
- `subject`: ข้อความสั้นๆ บอกถึงการเปลี่ยนแปลง (ขึ้นต้นด้วย verb ปัจจุบัน, ไม่มีจุด)

## ประเภท (type) ที่ใช้ในโปรเจกต์นี้

| Type | ความหมาย | ใน Changelog จะอยู่หมวด |
|------|----------|-------------------------|
| `feat` | เพิ่มฟีเจอร์ใหม่ | **Added** |
| `fix` | แก้ไขบั๊ก | **Fixed** |
| `docs` | เปลี่ยนแปลงเอกสาร (README, docs/) | **Documentation** |
| `style` | เปลี่ยนรูปแบบโค้ด (เว้นวรรค, semicolon) | **Changed** |
| `refactor` | ปรับปรุงโค้ดโดยไม่เปลี่ยนฟีเจอร์ | **Changed** |
| `perf` | เพิ่มประสิทธิภาพ | **Changed** |
| `test` | เพิ่มหรือแก้ไข test | **Changed** |
| `chore` | งานเบื้องหลัง (dependencies, config) | **Changed** |
| `ci` | เปลี่ยนแปลง CI/CD (GitHub Actions) | **Changed** |
| `build` | เปลี่ยนแปลง build system (webpack, next config) | **Changed** |
| `revert` | revert commit ก่อนหน้า | **Changed** |

## ตัวอย่างที่ถูกต้อง
