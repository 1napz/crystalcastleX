# CrystalCastle Changelog

## v1.8 (2026-05-07)

### 🇹🇭 ภาษาไทย
- เพิ่มขั้นตอน AI Video pipeline (caption → video → audio → branding)
- แก้ไข `generateVideo.js` ให้สร้างโฟลเดอร์ `logs/` อัตโนมัติ
- Trigger auto-squash merge เมื่อ PR backlog > 30
- อัปเดต release package → `crystalcastle-1.8.0.tgz`
- แจ้งเตือนผ่าน LINE + Telegram พร้อม mark ว่าต้อง manual review

**ข้อผิดพลาดที่พบ**
- ENOENT error ใน `logs/video.json` (แก้ไขแล้ว)
- Warning quota limit ใน `generateVoiceover.js`

---

### 🇬🇧 English
- Added AI Video pipeline (caption → video → audio → branding)
- Fixed `generateVideo.js` to auto-create `logs/` directory
- Triggered auto-squash merge when PR backlog > 30
- Updated release package → `crystalcastle-1.8.0.tgz`
- Notifications via LINE + Telegram with manual review mark

**Known Issues**
- ENOENT error in `logs/video.json` (resolved)
- Warning quota limit in `generateVoiceover.js`
