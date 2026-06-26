📑 CrystalCastle – README.md

`markdown

CrystalCastle
Open Source Workflow Automation & Governance Enforcement  
โอเพ่นซอร์สสำหรับการทำงานอัตโนมัติและการกำกับดูแล

---

🚀 Features / ฟีเจอร์
- CI/CD workflow automation (GitHub Actions + Vercel deploy triggers)
- Reviewer cockpit (notes, rules, checklist, flow, index, audit, actions)
- Permissions governance (auto revert → read-all after merge)
- Audit trail bilingual (TH/EN logs, severity matrix)
- Modular docs pack (notes, checklist, rules, flow, index, audit, actions)
- Contributor onboarding pack (CONTRIBUTING.md, PR Template, CODEOFCONDUCT.md)

---

🛡️ Badges / สถานะ
!CI/CD  
!CodeQL  
!Vercel  
!Privacy Check  
!Security Scan

---

📦 Installation & Setup / การติดตั้ง
`bash
git clone https://github.com/CrystalCastle/crystalcastle.git
cd crystalcastle
npm ci
`

🔧 Environment Variables / ตัวแปรสภาพแวดล้อม
`env
VERCEL_TOKEN=xxxx
GITHUB_TOKEN=xxxx
`

---

📂 Project Structure / โครงสร้างโปรเจกต์
`
/Package
  ├── README.md
  ├── CHANGELOG.md
  ├── TERMS.md
  ├── PRIVACY.md
  ├── LICENSE.md
  ├── CONTRIBUTING.md
  ├── SECURITY.md
/docs
  ├── release-notes.md
/reviewer
  ├── reviewer.notes.md
  ├── reviewer.rules.md
  ├── reviewer.checklist.md
  ├── reviewer.flow.md
  ├── reviewer.index.md
  ├── reviewer.audit.md
  ├── reviewer.actions.md
`

---

👥 Contributor Workflow / การทำงานของผู้ร่วมพัฒนา
1. Fork → Clone → Branch → Commit → PR  
2. Reviewer cockpit ใช้ notes + rules + checklist ตรวจสอบ  
3. Merge → Permissions revert → Audit trail update bilingual  
4. Reviewer cockpit ตรวจสอบ log consistency  

---

🔄 Governance Section / ส่วนการกำกับดูแล
- Merge PR → Revert permissions → Update audit trail bilingual  
- Reviewer cockpit ตรวจสอบ log และ severity matrix  
- Governance consistency enforced across reviewer docs  

---

📊 ASCII Diagram – Governance Flow
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

📊 ASCII Diagram – Audit Trail Logs Flow
`
PR Event
   │
   ▼
Log Entry (version/CrystalCastle/logs/)
   │
   ▼
Severity Matrix Applied
   │
   ▼
Reviewer Cockpit (ตรวจสอบ log bilingual TH/EN)
`

---

📊 ASCII Diagram – Reviewer Actions Flow
`
Log Correct → Approve → Continue Review
Log Incorrect → Request Fix → Block Merge
Severity High → Escalate → Stop Merge
`

---

📑 Quick Links / ลิงก์ด่วน
## 📑 Quick Links / ลิงก์ด่วน
- [Reviewer Notes](./reviewer/reviewer.notes.md)
- [Reviewer Rules](./reviewer/reviewer.rules.md)
- [Reviewer Checklist](./reviewer/reviewer.checklist.md)
- [Reviewer Flow](./reviewer/reviewer.flow.md)
- [Reviewer Index](./reviewer/reviewer.index.md)
- [Reviewer Audit](./reviewer/reviewer.audit.md)
- [Reviewer Actions](./reviewer/reviewer.actions.md)
---

📜 License
MIT License
`

---
