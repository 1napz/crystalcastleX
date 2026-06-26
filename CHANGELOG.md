# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [1.6.0] - 2026-04-28

### Added
- ระบบสร้างวิดีโอแบบอะซิงโครนัส (Async video generation) โดยใช้ Upstash QStash + Supabase เพื่อแก้ปัญหา timeout ของ Vercel Hobby Plan (10 วินาที)
  - `POST /api/generate-video` สำหรับสร้าง task และส่งงานไปยังคิว
  - `POST /api/process-video` สำหรับ worker ที่เรียก FAL/Magic Hour ในพื้นหลัง
  - `GET /api/task/[id]` สำหรับให้ frontend ใช้ polling ตรวจสอบสถานะ
- เครื่องมือตรวจจับความลับ (Secret scanning) เพื่อเพิ่มความปลอดภัย
  - `detect-secrets` + pre-commit hook (`.pre-commit-config.yaml`)
  - `gitleaks` GitHub Actions workflow (`.github/workflows/gitleaks.yml`)
- กำหนดค่า CodeRabbit (`.coderabbit.yaml`) ด้วยภาษาไทย, โปรไฟล์ `chill`, และคำแนะนำเฉพาะสำหรับโฟลเดอร์ `api/` และไฟล์ `product.js`
- เอกสารกลยุทธ์การแตกกิ่ง (`docs/branching-strategy.md`) อธิบายการใช้งาน GitHub Flow และ Feature Branches
- คู่มือการพัฒนา (`docs/development.md`) สำหรับการติดตั้ง, การพัฒนาในเครื่อง, Codespaces และการแก้ไขข้อผิดพลาด
- Workflow สำหรับ Auto-merge Dependabot PRs (`.github/workflows/dependabot-auto-merge.yml`)
- Workflow ตรวจสอบชื่อ Pull Request ให้เป็นไปตาม Conventional Commits (`.github/workflows/semantic-pr.yml`)
- Health check endpoint (`/api/health`) สำหรับการตรวจสอบสถานะระบบ
- ไฟล์ตัวอย่าง environment variables (`.env.example`) ที่สมบูรณ์ พร้อมทั้งคีย์ที่จำเป็นและคีย์เสริม

### Changed
- ปรับปรุง `vercel.json` ให้เหมาะสมกับแผน Hobby Plan:
  - ลบ `ignoreCommand` ที่ไม่รองรับ
  - ตั้ง `maxDuration: 10` สำหรับ API routes ทั้งหมด (ค่าสูงสุดที่ใช้ได้ในแผนฟรี)
  - เพิ่ม cache headers ที่เหมาะสมสำหรับ static assets และ security headers (`X-Content-Type-Options`, `X-Frame-Options` ฯลฯ)
- ปรับปรุง `README.md` ให้มี badges, ขั้นตอนการพัฒนา, หมายเหตุเกี่ยวกับ secret scanning, และปุ่ม Deploy บน Vercel ที่ใช้งานได้จริง
- ปรับแต่ง `.devcontainer/devcontainer.json`:
  - ใช้ฟิลด์ `secrets` ในการ inject `GROQ_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - เพิ่ม `postStartCommand` เพื่อเริ่ม dev server อัตโนมัติ
  - กำหนด `hostRequirements` (4 CPU / 8 GB RAM)
- อัปเกรดการตั้งค่า ESLint (`.eslintrc.json`) โดยเพิ่ม `eslint-config-prettier` เพื่อป้องกันความขัดแย้ง
- กำหนดมาตรฐาน Prettier (`.prettierrc`) ให้ใช้ single quotes, trailing commas แบบ `es5`, และความกว้างบรรทัด 100

### Fixed
- แก้ไขข้อขัดแย้งระหว่าง ESLint และ Prettier โดยเพิ่ม `eslint-config-prettier` และปิดกฎที่ซ้ำซ้อน
- แก้ไข syntax error ในฟังก์ชัน `updateFilename()` ภายในไฟล์ `product.js`
- ทำให้ `.env.local` ถูก ignore อย่างถูกต้อง (เพิ่มใน `.gitignore` และ `.prettierignore`)

### Removed
- ลบ `ignoreCommand` ออกจาก `vercel.json` (ไม่รองรับในแผน Hobby)
- ลบป๊อปอัปเกี่ยวกับราคา/ส่วนลด (ถูกลบไปแล้วในเวอร์ชันก่อนหน้า)

---

## [1.5.0] - 2026-04-26

### Added
- ตัวเลือกเมนูแบบเลื่อนลง (dropdown) สำหรับเลือก AI Video Engine (FAL, Runway, Pika, Nexa, WaveSpeed) ใน UI
- API endpoint `/api/generate-video` รองรับหลาย video engines
- Security Headers (CSP, X-Frame-Options, Permissions-Policy)
- Workflow `fix-package-lock.yml` เพื่อซ่อมแซม lockfile อัตโนมัติ
- เอกสาร: `SECURITY.md`, `copilot-instructions.md`
- ตัวสร้างสไลด์โชว์, Intro, CTA และ Thumbnail
- แสดง Groq Logs ใน `index.html`
- ระบบ AI สำรอง (Fallback) Groq → Gemini

### Changed
- อัปเดต `product.html`: เปลี่ยนจากปุ่ม Kling/Magic เป็นตัวเลือกแบบ dropdown
- อัปเดต `product.js` ให้รองรับการเลือก engine
- เปลี่ยนแบรนด์โปรเจกต์เป็น `@snapzreview`
- ปรับปรุง `vercel.json` เพิ่มการตั้งค่า `maxDuration`

### Fixed
- แก้ไขปัญหา Vercel build ล้มเหลว (ลดจำนวน serverless functions ให้เหลือ ≤12)
- ลบป๊อปอัปเรื่องราคา/ส่วนลดที่น่ารำคาญ

---

## [1.4.0] - Earlier
- เปิดตัวโปรเจกต์ครั้งแรก
- อัปโหลดรูปภาพ, สร้าง Prompt, สร้างวิดีโอด้วย FAL/Magic Hour
- เชื่อมต่อ Supabase (Storage, Authentication, RLS)

---

## 🔗 เปรียบเทียบรุ่น (Compare Links)

[Unreleased]: https://github.com/1napz/crystalcastle/compare/v1.6.0...HEAD
[1.6.0]: https://github.com/1napz/crystalcastle/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/1napz/crystalcastle/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/1napz/crystalcastle/releases/tag/v1.4.0