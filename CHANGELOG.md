# 📜 CrystalCastle Changelog

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
