---

📋 Reviewer Flow (บังคับ Approve โดย Code Owner)

`markdown

Reviewer Flow / กระบวนการตรวจสอบ

`mermaid
flowchart TD
    A[Contributor opens PR / ผู้ร่วมโครงการเปิด PR] --> B[CodeRabbit AI Review / ตรวจสอบอัตโนมัติด้วย CodeRabbit]
    B --> C{Checks passed? / ผ่านการตรวจสอบหรือไม่?}
    C -- No --> D[Fix issues & update PR / แก้ไขและอัปเดต PR]
    C -- Yes --> E[CODEOWNERS Review: Mr. Nattapong Pornlumfah / ตรวจสอบโดย Code Owner: ณัฐพงศ์ พรล้ำฟ้า]
    E --> F{Approved by Code Owner? / ได้รับการอนุมัติจาก Code Owner หรือไม่?}
    F -- No --> D
    F -- Yes --> G[Merge to main / รวมเข้ากับ main branch]
    G --> H[Board Sync & Audit Trail / ซิงค์ไปยังบอร์ดและบันทึก audit trail]
`
`

---

📌 ตัวอย่าง .coderabbit.yaml

`yaml
version: 1

Reviewer configuration / การตั้งค่า Reviewer
reviewers:
  - coderabbitai        # Automated AI reviewer
  - 1napz               # Mr. Nattapong Pornlumfah (Code Owner)

rules:

Require approval from Code Owner / ต้องได้รับการอนุมัติจาก Code Owner
  requirereviewerapproval: true

Block merge if conditions not met / บล็อกการ merge ถ้าไม่ผ่านเงื่อนไข
  blockmergeif:
    - reviewer_missing       # ไม่มี reviewer
    - checklist_incomplete   # Checklist ไม่ครบ
    - codeowner_missing      # ไม่มีการอนุมัติจาก Code Owner
`

---

✅ Governance Checklist (Bilingual)

🔎 Code Review & Ownership
- [ ] CODEOWNERS file อยู่ใน .github/ และกำหนดคุณ (@1napz) เป็น Code Owner หลัก  
- [ ] เปิดใช้ Branch Protection Rule → “Require review from Code Owners”  
- [ ] ตรวจสอบว่า Code Owner มี write access จริง  

🔎 Reviewer Flow
- [ ] CodeRabbitAI ตรวจสอบ PR อัตโนมัติ (lint, test, security scan)  
- [ ] คุณ (ณัฐพงศ์ พรล้ำฟ้า) ต้อง approve ทุก PR ก่อน merge  
- [ ] Reviewer/Admin ตรวจสอบ commit message bilingual (TH/EN)  

🔎 CI/CD & Security
- [ ] CI/CD checks ผ่านทั้งหมด (lint, test, build, security scan)  
- [ ] ไม่มี sensitive data หรือ secret หลุดใน PR  
- [ ] ESLint/Prettier config อยู่ใน repo root และไม่ถูกซ่อน  

🔎 Documentation & Governance
- [ ] PR Template มี Reviewer Checklist bilingual (TH/EN)  
- [ ] ReviewerFlow.md มี Diagram + Config .coderabbit.yaml  
- [ ] GovernanceFlow.md มี node “CODEOWNERS Review”  
- [ ] Audit Trail ถูก sync ไปยัง ClickUp/Azure Board  

🔎 Merge & Audit
- [ ] Manual approval สำหรับ production merge พร้อม email แจ้ง admin  
- [ ] PR status log ถูกบันทึกใน docs/status/  
- [ ] Board sync (ClickUp/Azure) แสดงสถานะล่าสุดของ PR  

---

💡 แบบนี้ docs/reviewer-flow.md จะกลายเป็นคู่มือครบชุดสำหรับทีม reviewer/admin: มี Flow Diagram + Config + Checklist bilingual อยู่ในไฟล์เดียวครับ  
