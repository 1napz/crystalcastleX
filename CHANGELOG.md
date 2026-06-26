# 📜 CrystalCastle Changelog
## [1.4.0] – 2026-05-06

### 🚀 Added
- Implemented **FAL → Magic Hour fallback chain** for video generation  
- Added bilingual docstrings (English + Thai) to `generate-videos.js` functions  
- Improved reviewer enforcement notes in code comments  

### 🛠️ Changed
- Updated FAL endpoint to official spec (`fal.run/fal-ai/kling-video/v2/master/image-to-video`)  
- Adjusted FAL payload: `duration` must be string, `aspect_ratio` set to `"9:16"`  
- Rewrote Magic Hour workflow: async job creation → polling → download final video  
- Renamed PR title to reflect fallback mechanism  

### 🔒 Governance Enforcement
- Reviewer checklist updated:  
  - `.env.local` must include `FAL_KEY` and `MAGIC_HOUR_API_KEY`  
  - Docstring coverage ≥ 80% required  
  - PRs must document API compliance fixes in changelog/release notes  

### 📋 Reviewer Impact / ผลกระทบต่อผู้ตรวจสอบ
- Reviewers must confirm API endpoints match official docs  
- Reviewers must verify fallback chain works (FAL → Magic Hour)  
- Reviewers must enforce bilingual docstring coverage before approval  
- Reviewers must ensure changelog entry is present in PR  

---
## [1.3.0] - 2026-05-06

### 🚀 Features / ฟีเจอร์ใหม่
- **feat(api):** Added video logging endpoint for monitoring AI events  
  **ไทย:** เพิ่ม API สำหรับ video logging เพื่อใช้ตรวจสอบเหตุการณ์ AI  

- **feat(devcontainer):** Added missing `express` dependency to package.json  
  **ไทย:** เพิ่ม dependency `express` ที่หายไปใน package.json  

---

### 🐛 Fixes / การแก้ไขบั๊ก
- **fix(frontend):** Resolved login form validation error  
  **ไทย:** แก้ไขปัญหา validation ของฟอร์ม login  

- **fix(workflows):** Corrected CI pipeline step order to prevent build failures  
  **ไทย:** แก้ไขลำดับขั้นตอน CI pipeline เพื่อป้องกัน build ล้มเหลว  

---

### 📚 Documentation / เอกสาร
- **docs(onboarding):** Updated environment setup guide with `.env.local` usage  
  **ไทย:** อัปเดตคู่มือการตั้งค่า environment โดยเพิ่มการใช้งาน `.env.local`  

- **docs(reviewer):** Added bilingual reviewer checklist for `creation.log` analysis  
  **ไทย:** เพิ่ม checklist สองภาษา สำหรับ reviewer ในการตรวจสอบ `creation.log`  

---

### 🛠 Maintenance / งานบำรุงรักษา
- **chore(deps):** Updated axios to v1.2.0  
  **ไทย:** อัปเดต axios เป็นเวอร์ชัน 1.2.0  

- **ci(security):** Added secret scanning workflow  
  **ไทย:** เพิ่ม workflow สำหรับการสแกน secrets  

---

### ⚡ Performance / ประสิทธิภาพ
- **perf(video):** Optimized rendering speed for video engine  
  **ไทย:** ปรับปรุงความเร็วในการ render ของ video engine  

---

### ✅ Governance & Reviewer Training / มาตรฐานการตรวจสอบ
- Added bilingual PR template requiring `creation.log` review  
  **ไทย:** เพิ่ม PR template สองภาษา ที่บังคับให้ reviewer ตรวจสอบ `creation.log`  

- Added reviewer workflow diagram bilingual for Codespaces error handling  
  **ไทย:** เพิ่ม diagram สองภาษา สำหรับ reviewer workflow ในการจัดการ error ของ Codespaces  

---

## 📌 Summary / สรุป
**English:**  
CrystalCastle v1.3.0 introduces new API features, dependency fixes, improved CI/CD workflows, and bilingual governance artifacts for reviewers.  

**ไทย:**  
CrystalCastle v1.3.0 เพิ่มฟีเจอร์ API ใหม่, แก้ไข dependency, ปรับปรุง CI/CD workflows และเพิ่ม artifact สองภาษาเพื่อช่วย reviewer ตรวจสอบได้อย่างมีมาตรฐาน

# 📜 CrystalCastle Changelog (Bilingual)

## [1.2.0] - 2026-05-06
### ✨ Added / เพิ่ม
**English:**  
- Bilingual PR template enforcing reviewer checklist  
- Updated reviewer notes (`docs/reviewer.notes.md`) with streamlined bilingual checklist  
- Enhanced CI/CD workflows for QA and security scanning  

**ไทย:**  
- เพิ่ม PR template สองภาษาที่บังคับใช้ reviewer checklist  
- อัปเดต reviewer notes (`docs/reviewer.notes.md`) ด้วย checklist สองภาษาที่กระชับขึ้น  
- ปรับปรุง CI/CD workflows สำหรับ QA และการสแกนความปลอดภัย  

---

### 🛠 Fixed / แก้ไข
**English:**  
- Codespaces recovery log handling (`creation.log`)  
- Onboarding documentation for environment setup  
- Deprecated files moved to `archive/`  

**ไทย:**  
- แก้ไขการจัดการ Codespaces recovery log (`creation.log`)  
- แก้ไขเอกสาร onboarding สำหรับการตั้งค่า environment  
- ย้ายไฟล์ที่เลิกใช้ไปที่ `archive/`  

---

### 📚 Documentation / เอกสาร
**English:**  
- Updated `CHANGELOG.md` bilingual entries  
- Added bilingual release notes for governance transparency  
- Improved reviewer training guide in `docs/onboarding.md`  

**ไทย:**  
- อัปเดต `CHANGELOG.md` ด้วย bilingual entries  
- เพิ่ม release notes bilingual เพื่อความโปร่งใสด้าน governance  
- ปรับปรุง reviewer training guide ใน `docs/onboarding.md`

# CrystalCastle Changelog / บันทึกการเปลี่ยนแปลง

## 📌 Versioning Rules / กฎการจัดการเวอร์ชัน
- Use **Semantic Versioning (SemVer)**: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes / การเปลี่ยนแปลงที่ทำให้โค้ดเก่าใช้ไม่ได้
- MINOR: New features (backward-compatible) / ฟีเจอร์ใหม่ที่ยังเข้ากันได้
- PATCH: Bug fixes / การแก้บั๊ก

---

## 📝 Template / แม่แบบ

### [X.Y.Z] - YYYY-MM-DD
#### 🚀 Features / ฟีเจอร์ใหม่
- Added [feature name]  
- เพิ่ม [ชื่อฟีเจอร์]

#### 🐛 Fixes / การแก้ไขบั๊ก
- Fixed [bug description]  
- แก้ไข [รายละเอียดบั๊ก]

#### 📖 Documentation / เอกสาร
- Updated [doc name]  
- อัปเดต [ชื่อเอกสาร]

#### 🔒 Governance & Enforcement / กฎระเบียบและการบังคับใช้
- Reviewer checklist enforced in PRs  
- บังคับใช้เช็คลิสต์ Reviewer ใน PR
- `.vercelignore` verified for deploy size  
- ตรวจสอบ `.vercelignore` เพื่อลดขนาดการ Deploy
- Supabase RLS policies confirmed  
- ยืนยันนโยบาย RLS ของ Supabase

#### 👥 Reviewer Impact / ผลกระทบต่อผู้ตรวจสอบ
- Minimum 2 reviewers required for merge  
- ต้องมีผู้ตรวจสอบอย่างน้อย 2 คนก่อน Merge
- Checklist confirmation logged in PR comments  
- บันทึกการยืนยันเช็คลิสต์ในคอมเมนต์ PR

---

## 📌 Example Entry / ตัวอย่าง

### [1.2.0] - 2026-05-06
#### 🚀 Features
- Added bilingual reviewer checklist enforcement  
- เพิ่มการบังคับใช้เช็คลิสต์ Reviewer แบบสองภาษา

#### 🐛 Fixes
- Fixed Supabase client initialization error  
- แก้ไขข้อผิดพลาดการเริ่มต้น Supabase client

#### 📖 Documentation
- Added governance flowchart to `docs/`  
- เพิ่ม Flowchart การบังคับใช้ใน `docs/`

#### 🔒 Governance & Enforcement
- `.coderabbit.yaml` updated with PR size limits  
- อัปเดต `.coderabbit.yaml` ด้วยข้อจำกัดขนาด PR

#### 👥 Reviewer Impact
- Reviewers must confirm `.env.local` setup before approval  
- ผู้ตรวจสอบต้องยืนยันการตั้งค่า `.env.local` ก่อนอนุมัติ
