# Changelog

## [1.5.0] - 2026-04-26
### Added
- Dropdown เลือก AI Video Engine (FAL, Runway, Pika, Nexa, WaveSpeed)
- รวม API Video Engine ใน `/api/generate-video`
- Security Headers (CSP, X-Frame-Options, Permissions-Policy)
- Workflow `fix-package-lock.yml` สำหรับซ่อม lockfile อัตโนมัติ
- เอกสาร `SECURITY.md`, `copilot-instructions.md`

### Changed
- ปรับ UI `product.html` ใช้ Dropdown แทนปุ่ม Kling/Magic เดิม
- ปรับ `product.js` รองรับการเลือก Engine

### Fixed
- แก้ Vercel Build Failed (ลด Functions เหลือ ≤12)
- แก้ Dependabot `package-lock.json not parseable`
- ลบ popup ราคา/ส่วนลด

## [1.4.0] - 2026-04-20
### Added
- Slideshow, Intro, CTA, Thumbnail generators
- Groq Logs แสดงใน `index.html`
- ระบบ Fallback AI (Groq → Gemini)

### Changed
- เปลี่ยนแบรนด์เป็น @snapzreview
- ปรับปรุง `vercel.json` เพิ่ม maxDuration

## [1.0.0] - 2026-04-01
### Added
- เปิดตัวโปรเจกต์ครั้งแรก
- อัปโหลดรูป, Gen Prompt, สร้างวิดีโอด้วย FAL/Magic
- Supabase integration
