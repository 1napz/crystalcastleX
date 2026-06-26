# 📜 Changelog – Crystal Castle

รูปแบบอ้างอิงจาก [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) และ [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- ยังไม่มีการเพิ่มฟีเจอร์ใหม่ในเวอร์ชันนี้

### Changed
- ยังไม่มีการเปลี่ยนแปลงในเวอร์ชันนี้

### Fixed
- ยังไม่มีการแก้ไขข้อบกพร่องในเวอร์ชันนี้

### Removed
- ยังไม่มีการลบฟีเจอร์ใด ๆ ในเวอร์ชันนี้

---

## [1.1.0] - 2026-05-05
### 🚀 Added
- ปรับปรุง Studio UI ให้รองรับการ preview video แบบ real-time
- เพิ่มระบบ notification ผ่าน Telegram integration
- ปรับปรุง Agent Dashboard ให้แสดงสถานะ engines และ Supabase logs

### 🔒 Security & Privacy
- เพิ่มการตรวจสอบ API key validity ใน CI/CD
- ปรับปรุง `privacy.yml` ให้รองรับ mock mode
- เพิ่มการตรวจสอบ secret leakage ใน workflow

### 🛠 Developer Experience
- เพิ่ม unit tests สำหรับ `engines.js` และ `supabase.js`
- ปรับปรุง README.md → เพิ่ม badges สำหรับ Build, Privacy Check, Security Scan
- เพิ่มตัวอย่าง `.env.local` ที่ชัดเจนขึ้นสำหรับ contributor

### 🐛 Fixed
- แก้ไข bug ในการเลือก video engine ที่ไม่ sync กับ UI
- แก้ไข error ของ Supabase logging ที่เกิดจาก key mismatch

---

## [1.0.0] - 2026-05-05
### 🚀 Added
- เปิดตัว **Studio UI** (`index.html`) เป็นหน้าแรกของ GitHub Pages
- ย้ายเนื้อหา `product.html` → `index.html`
- เพิ่มโครงสร้างโค้ดแบบ **modular** (`engines.js`, `supabase.js`, `ui.js`)
- เชื่อมโยงกับ **Supabase** สำหรับการบันทึก logs และ action
- รองรับหลาย video engines (FAL, Magic Hour, RunwayML, Pika, Nexa, Wavespeed)
- เพิ่ม **Documentation Hub (`doc/index.md`)**

### 🔒 Security & Privacy
- เพิ่ม **privacy.yml** และ **security.yml** สำหรับ CI/CD enforcement
- ห้าม commit `.env.local` หรือ API keys จริงลง GitHub
- ใช้ GitHub Secrets / Vercel Dashboard สำหรับ environment variables

### 🛠 Developer Experience
- เพิ่ม **Mock Mode** สำหรับการทดสอบใน dev environment
- เพิ่ม CI/CD workflow (`ci.yml`) → lint, test, build, privacy-check, security-scan

---

## 🔗 Compare Links
[Unreleased]: https://github.com/1napz/crystalcastle/compare/v1.1.0...HEAD  
[1.1.0]: https://github.com/1napz/crystalcastle/compare/v1.0.0...v1.1.0  
[1.0.0]: https://github.com/1napz/crystalcastle/releases/tag/v1.0.0
