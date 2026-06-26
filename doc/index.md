# 📖 Crystal Castle – Documentation Hub

ยินดีต้อนรับสู่ Crystal Castle!  
หน้านี้เป็นศูนย์กลางสำหรับ contributor และผู้ใช้งาน เพื่อเข้าถึงเอกสารทั้งหมดที่เกี่ยวข้องกับการพัฒนา, การตั้งค่า, และ governance ของโปรเจกต์

---

## 🚀 Getting Started
- [Environment Variables](./environment-variables.md) – วิธีตั้งค่า API keys และ Supabase
- [Onboarding Guide](../CONTRIBUTE.md) – ขั้นตอนการเริ่มต้นสำหรับ contributor
- [Setup Configs](../setup-config/) – privacy.yml, security.yml, และ CI/CD configs

---

## 🔒 Privacy & Security
- [Privacy Policy](./privacy.md) – นโยบายความเป็นส่วนตัวและการบันทึกข้อมูล
- [Security Governance](../setup-config/security.yml) – การ enforce ความปลอดภัยใน CI/CD
- [Privacy Governance Diagram](../CONTRIBUTE.md#privacy-governance) – แผนภาพ governance flow

---

## 🗂 Repository Governance
- [CODEOWNERS](../CODEOWNERS) – กำหนด reviewer ที่ชัดเจน
- [settings.yml](../.github/settings.yml) – การตั้งค่า repository governance
- [Pull Request Template](../.github/PULL_REQUEST_TEMPLATE.md) – โครงสร้าง PR ที่ enforce privacy/security
- [Issue Templates](../.github/ISSUE_TEMPLATE/) – Bug Report และ Feature Request พร้อม checklist
- [Discussions](https://github.com/1napz/crystalcastle/discussions) – ใช้สำหรับถามคำถามทั่วไปหรือแลกเปลี่ยนไอเดีย

---

## 🎬 Product UI
- [Index.html](../index.html) – หน้า Studio UI (default entry)
- [Product.js](../product.js) – Script หลักสำหรับ Studio
- [Engines.js](../src/engines.js) – Video engine integration
- [Supabase.js](../src/supabase.js) – Supabase interaction
- [UI.js](../src/ui.js) – UI interaction module

---

## 🛠 Developer Tools
- [CI/CD Workflows](../.github/workflows/) – privacy-check.yml, security-scan.yml
- [Mock Mode](./environment-variables.md#🧪-development--mock-mode) – วิธีเปิด mock mode สำหรับ dev/test
- [Agent Dashboard](./agent-dashboard.md) – สรุปสถานะระบบ

---

## 📊 Status Badges
![Build](https://github.com/1napz/crystalcastle/actions/workflows/build.yml/badge.svg)
![Security Scan](https://github.com/1napz/crystalcastle/actions/workflows/security-scan.yml/badge.svg)
![Privacy Check](https://github.com/1napz/crystalcastle/actions/workflows/privacy-check.yml/badge.svg)

---

## 📌 Notes
- ห้าม commit `.env.local` หรือ API keys จริงลง GitHub
- ใช้ Vercel Dashboard หรือ GitHub Secrets สำหรับ environment variables
- ทุก PR และ Issue ต้องผ่าน **privacy/security checklist**