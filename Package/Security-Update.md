# 📜 Crystal Castle Governance & Security Docs

## 🔒 SECURITY.md
### Reporting
- แจ้งช่องโหว่ผ่าน GitHub Issues โดยใช้ label `security`
- ห้ามเปิดเผยสาธารณะจนกว่าจะได้รับการแก้ไข

### Guidelines
- ห้าม commit secrets (API keys, tokens) ลง repo
- ใช้ Supabase RLS (Row Level Security) สำหรับการเข้าถึงข้อมูล
- เปิดใช้งาน GitHub secret scanning และ Dependabot alerts
- ใช้ CSP headers และ rate limiting ตามที่กำหนดใน `vercel.json`

---

## 📄 TERMS.md
### Usage
- ใช้ได้ทั้ง personal และ commercial ภายใต้ MIT License
- ผู้ใช้ต้องรับผิดชอบการปฏิบัติตามกฎหมายและนโยบายแพลตฟอร์ม (TikTok, Shopee ฯลฯ)
- ไม่มีการรับประกันใด ๆ ทั้งสิ้น

### Contributions
- ต้องปฏิบัติตาม `CONTRIBUTING.md`
- Pull Request ต้องผ่าน CI/CD checks และ reviewer approval

---

## 🤝 CONTRIBUTING.md
### Workflow
- Fork → Feature Branch → Pull Request
- ใช้ mock mode สำหรับ development เพื่อลดค่าใช้จ่าย API
- ต้องมี Unit Tests และ Smoke Tests ครอบคลุมฟีเจอร์ใหม่
- อัปเดตเอกสารทุกครั้งที่มีการเปลี่ยนแปลงการใช้งาน

### Code Standards
- ใช้ standardized commit messages
- ต้องผ่าน lint และ type check ก่อน merge

---

## 📜 LICENSE.md (MIT License)
Copyright (c) 2026 Crystal Castle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

[Full MIT text…]