---

📂 Path
`
/docs/governance/GovernanceFlow.md
`

---

📝 GovernanceFlow.md (Bilingual ASCII Diagram)

`markdown

Governance & Audit Trail Flow
การกำกับดูแลและ Audit Trail Flow

---

ASCII Flow Diagram

Developer (นักพัฒนา)
    |
    v
[ Submit PR / ส่ง PR ]
    |
    v
GitHub Actions (ระบบอัตโนมัติ)
    |
    +--> [ Update Docs / อัปเดตเอกสาร ] ---> README.md / CHANGELOG.md
    |
    +--> [ Record Metadata / บันทึกข้อมูล ] ---> Supabase Logs
    |
    v
Mission Control Dashboard (แดชบอร์ดควบคุม)
    |
    v
[ Visible Audit Trail / แสดง Audit Trail ให้ทีม ]

---

Governance Principles (English/Thai)
- 🛡️ Security-first (CSP, RLS, Rate Limiting) / ความปลอดภัยมาก่อน  
- 📖 Documentation auto-update / เอกสารอัปเดตอัตโนมัติ  
- 👥 Reviewer/Admin checklist enforced / บังคับใช้เช็คลิสต์ Reviewer/Admin  
- 📊 Audit Trail visible to all team / Audit Trail โปร่งใสสำหรับทุกคนในทีม  

---

Commit Message Template (Bilingual)

`
governance: record PR #<PR_NUMBER> in Audit Trail
การกำกับดูแล: บันทึก PR #<PR_NUMBER> ลง Audit Trail

- PR Title: <PR_TITLE>
- Author: <PR_AUTHOR>
- Status: <PR_STATUS>
- Updated: <DATE_TIME>
- Docs Updated: README.md, CHANGELOG.md
- Logs Recorded: Supabase + Mission Control
`
`

---

✅ ผลลัพธ์
- ทีมเห็นภาพรวม governance flow ชัดเจน  
- Audit Trail ครอบคลุมทั้ง Docs และ Logs  
- Commit message bilingual สอดคล้องกับ Reviewer/Admin workflow  

---