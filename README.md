---

`markdown

🏰 CrystalCastle

> Open Source Workflow Automation & Governance Enforcement  
> โอเพ่นซอร์สสำหรับการทำงานอัตโนมัติและการกำกับดูแลโปรเจกต์

![CI/CD](https://github.com/1napz/crystalcastle/actions)
![CodeQL](https://github.com/1napz/crystalcastle/security/code-scanning)
![Vercel](https://1napz.github.io/crystalcastle/)
![License: MIT](./LICENSE)
![Governance](./reviewer/)
![Docs Coverage](./docs/)
![Security Scan](./SECURITY.md)

---

📖 Overview / ภาพรวม

CrystalCastle เป็นระบบ Workflow Automation และ Governance สำหรับทีม Dev ที่ต้องการ:
- ควบคุม CI/CD อัตโนมัติ
- ตรวจสอบ PR และ Permissions อย่างเข้มงวด
- เก็บ Audit Trail ทั้งภาษาไทยและอังกฤษ

---

📑 Docs Index / ดัชนีเอกสาร
- Knowledge Log
- Reviewer Checklist
- Onboarding Guide
- Troubleshooting

---

🚀 Features / ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|--------|------------|
| ⚙️ CI/CD Automation | GitHub Actions + Vercel deploy triggers |
| 🔍 Reviewer Cockpit | Notes, Rules, Checklist, Flow, Audit, Actions |
| 🔒 Permissions Governance | Auto revert → read-all หลัง merge |
| 📋 Audit Trail | บันทึก Log สองภาษา TH/EN พร้อม severity matrix |
| 📦 Modular Docs | ชุดเอกสารครบวงจรสำหรับทีม |
| 🤝 Contributor Pack | CONTRIBUTING.md, PR Template, CODEOFCONDUCT.md |

---

📦 Installation / การติดตั้ง

`bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
npm ci
`

---

📂 Project Structure / โครงสร้างโปรเจกต์

`
crystalcastle/
├── 📁 Package/           — เอกสารหลัก (README, LICENSE, CHANGELOG ฯลฯ)
├── 📁 docs/              — Release notes และเอกสารเพิ่มเติม
├── 📁 reviewer/          — Reviewer Cockpit ทั้งหมด
├── 📁 src/               — Source code หลัก
├── 📁 api/               — API handlers
├── 📁 Frontend/          — Frontend assets
├── 📁 scripts/           — Automation scripts
└── 📁 logs/              — Audit logs
`

---

👥 Contributor Workflow / ขั้นตอนการร่วมพัฒนา

`mermaid
flowchart LR
    A[Fork & Clone] --> B[Branch]
    B --> C[Commit bilingual + checklist]
    C --> D[Pull Request]
    D --> E[Reviewer/Admin Approval]
    E --> F[Merge + Governance Enforcement]
`

---

🗺️ Roadmap / แผนงาน
- This Week: อัพเดท Reviewer Checklist, เพิ่ม mock test logs  
- This Month: ปรับปรุง CI/CD summary ให้ครอบคลุมทุก repo  
- This Quarter: เพิ่ม Audit Trail และ Privacy Governance  

---

📊 Governance Flow

`
Merge PR
   │
   ▼
Permissions Revert (read-all)
   │
   ▼
Audit Trail Update (TH/EN logs)
   │
   ▼
Reviewer Cockpit (Notes + Rules + Checklist)
`

---

📈 Performance Progression

`mermaid
graph LR
    A[Start] --> B[Engagement Growth]
    B --> C[Compliance Improvement]
    C --> D[Error Recovery]
    D --> E[Governance Enforcement]
    E --> F[Audit Trail Expansion]
    F --> G[Dashboard]
`

---

🔒 Security / ความปลอดภัย

- RBAC — reviewer / admin / agent แยกสิทธิ์ชัดเจน  
- MFA — แนะนำให้เปิดใช้งานทุกบัญชี  
- Audit Trail — ทุก commit/test/deploy มี log ย้อนหลังได้  
- Secret Scan — ตรวจสอบ secrets อัตโนมัติทุก push  

ดูนโยบายความปลอดภัยเพิ่มเติมที่ [ดูเหมือนว่าผลลัพธ์จะไม่ปลอดภัยที่จะแสดง มาสลับสิ่งต่างๆ และลองทำอย่างอื่นกันเถอะ!]

---

📬 Contact / ติดต่อ

- Admin: nobizzmaru@gmail.com  
- Website: 1napz.github.io/crystalcastle  
- Issues: GitHub Issues

---

📜 License

MIT License © 1napz — ดูรายละเอียดที่ [ดูเหมือนว่าผลลัพธ์จะไม่ปลอดภัยที่จะแสดง มาสลับสิ่งต่างๆ และลองทำอย่างอื่นกันเถอะ!]
`

---
