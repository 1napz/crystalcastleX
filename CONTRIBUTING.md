Here’s the latest version of your CONTRIBUTING.md — fully updated with the Reviewer Checklist and Governance Summary sections, ready to copy‑paste into your GitHub editor:  

---

`markdown
🤝 Contributing to CrystalCastle  
Thank you for your interest in contributing! This project is designed to scale with both human and AI‑assisted development workflows.

🚀 Development Philosophy  
• Keep changes small and focused  
• Prefer clarity over cleverness  
• All features must be testable and documented  
• AI‑generated code is allowed, but must be reviewed  

🚀 Getting Started  
1. Fork the repository  
Click "Fork" on GitHub and clone your fork:  
`bash
git clone https://github.com/YOUR_USERNAME/crystalcastle.git
cd crystalcastle
`

2. Create a branch  
`bash
git checkout -b feature/your-feature-name
`
Branch naming:  
• feature/...  
• fix/...  
• chore/...

3. Install dependencies  
`bash
npm install
`

4. Run the project  
`bash
npm run dev
`

🧪 Testing  
Run tests before submitting:  
`bash
npm run test
`
Rules:  
• New features must include tests  
• Bug fixes must include regression tests  

📝 Commit Guidelines  
Use Conventional Commits:  
`
feat: add login system  
fix: resolve API timeout issue  
chore: update dependencies  
`

🔁 Pull Request Process  
Before submitting:  
☑️ Code builds successfully  
☑️ Tests pass  
☑️ No sensitive data included  
☑️ PR description is clear  

PR must include:  
• What changed  
• Why it changed  
• Screenshots (if UI)  

🤖 AI‑Assisted Contributions  
AI tools (e.g., ChatGPT, Copilot) are welcome.  
But you MUST:  
• Review all generated code  
• Remove unnecessary complexity  
• Ensure security best practices  

📞 Reporting Issues  
Use GitHub Issues for:  
• Bugs  
• Feature requests  

For security issues: 👉 DO NOT open a public issue 👉 Contact maintainers privately  

🍬 Code Style  
• Use consistent formatting  
• Avoid unused code  
• Keep functions small and readable  

❤️ Community  
Be respectful. Constructive feedback only.  

🔥 Maintainer Notes  
Maintainers may:  
• Request changes  
• Reject low‑quality PRs  
• Refactor submitted code  

---

📋 Reviewer Checklist

Before approving a Pull Request, please verify the following:

🔍 Schema Validation
- Confirm ai-key-performance.json, license-status.json, and token-status.json pass JSON schema checks.
- Ensure no breaking changes in data structure.

⚙️ CI/CD Pipeline
- Verify GitHub Actions run successfully.
- Check automated tests (unit + integration) pass.

🖥️ Dashboard Logic
- Review dashboard.js changes for clean rendering and event handling.
- Ensure new logic doesn’t break existing DashboardCard components.

🎨 UI Layout
- Check index.html updates align with design guidelines.
- Confirm responsiveness and accessibility.

📖 Documentation
- Ensure README.md reflects new workflows, diagrams, and reviewer instructions.
- Confirm examples are accurate and bilingual consistency is maintained.

📈 Business Alignment
- Validate that technical changes map to KPIs (usage %, latency, token errors).
- Confirm strategic outcomes (retention, compliance, engagement) are documented.

---

🧭 Governance Summary

CrystalCastle uses a dual governance model to ensure both technical quality and strategic alignment.

👀 Reviewer Workflow
- Reviewers validate schema, CI/CD pipeline, and dashboard logic.
- They check UI layout, documentation accuracy, and business KPI alignment.
- Once all checklist items pass, the PR moves to the maintainer stage.

🛠️ Maintainer Governance
- Maintainers decide PR outcomes:
  - Approved: Merge → Deploy → Document.
  - Changes Requested: Assign revisions → Guide developer.
- If refactoring is needed, maintainers optimize and simplify code.
- Security issues trigger private investigation and patching.
- All paths converge at Final Merge, ensuring stability and compliance.

🔄 Integration
- Reviewers focus on validation and clarity.  
- Maintainers focus on security, optimization, and release stability.  
- Together, they maintain a transparent, scalable workflow for AI‑assisted development.
`
## Pull Request Template / แม่แบบ Pull Request

### วิธีการใช้งาน
เมื่อสร้าง Pull Request ใหม่ โปรดคัดลอกเนื้อหาด้านล่างนี้ไปใส่ในช่อง Description

---

**Template**

```markdown
## Title / ชื่อ Pull Request
[Feature/Fix/Refactor/Docs]: คำอธิบายสั้น ๆ (ภาษาอังกฤษ)

## Description / คำอธิบาย
<!-- อธิบายการเปลี่ยนแปลงนี้อย่างละเอียด -->

### ปัญหาที่แก้ไข / Related Issue
- Resolves #XXX
- Related to #YYY

### การเปลี่ยนแปลงหลัก / Key Changes
- [ ] รายการเปลี่ยนแปลงที่ 1
- [ ] รายการเปลี่ยนแปลงที่ 2
- [ ] ...

### ประเภทของการเปลี่ยนแปลง / Type of Change
- [ ] Feature / คุณสมบัติใหม่
- [ ] Bug Fix / แก้ไขข้อผิดพลาด
- [ ] Refactor / ปรับโครงสร้างโค้ด
- [ ] Documentation / เอกสาร
- [ ] Performance / ประสิทธิภาพ
- [ ] Security / ความปลอดภัย
- [ ] Other / อื่นๆ

## Checklist / รายการตรวจสอบ (ก่อนส่ง PR)
- [ ] โค้ดทำงานได้ถูกต้องและผ่านการทดสอบแล้ว
- [ ] เขียน Unit Test / Test Case เพิ่มเติม (ถ้ามี)
- [ ] อัปเดตเอกสารที่เกี่ยวข้อง (README, Comments, etc.)
- [ ] ไม่มีข้อผิดพลาดด้าน Security หรือ Best Practice
- [ ] Commit Message เป็นไปตาม Conventional Commits
- [ ] Branch ชื่อตรงตามมาตรฐาน (feature/, fix/, refactor/, etc.)
- [ ] ได้รับการตรวจสอบจาก Reviewer อย่างน้อย 1 คน (ถ้าจำเป็น)

## Screenshots / ภาพหน้าจอ (ถ้ามี)
<!-- แนบภาพก่อน-หลัง หรือผลลัพธ์การทำงาน -->

## Additional Notes / หมายเหตุเพิ่มเติม
<!-- ข้อมูลอื่นๆ ที่ Reviewer ควรทราบ -->

**Reviewer:** @username
---

# Local Development

This is a [Turborepo](https://turborepo.org/) using [pnpm workspaces](https://pnpm.io/workspaces). 

To develop on the packages in this repo, use the steps bellow

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Dev](#dev)
- [Build](#build)
- [Test](#test)
- [Lint](#lint)
- [Check Types](#check-types)
- [Generate new docs](#generate-new-docs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
pnpm i
```

## Dev

```sh
pnpm dev
```


## Build

```sh
pnpm build
```


## Test

```sh
pnpm test
```

## Lint

```sh
pnpm lint
```

## Check Types

```sh
pnpm typecheck
```

## Generate new docs

```sh
pnpm doctoc
```

docs(contributing): add Reviewer/Admin Checklist Flow to CONTRIBUTING.md

- Add bilingual (EN/TH) Reviewer/Admin Checklist Flow section
- Cover full review lifecycle: Review → Feedback → Approve → Merge → Audit Trail → Continuous Improvement
- Include PR Template, Issue Template, Contribution Flow, and Roadmap Governance Flow references
- Ensure documentation is consistent with team standards

```

[TH] เพิ่ม Reviewer/Admin Checklist Flow เข้า CONTRIBUTING.md
- เพิ่มส่วน Reviewer/Admin Checklist Flow แบบ bilingual (EN/TH)
- ครอบคลุมกระบวนการ Review ครบวงจร: Review → Feedback → Approve → Merge → Audit Trail → Continuous Improvement
- อ้างอิง PR Template, Issue Template, Contribution Flow และ Roadmap Governance Flow
- ตรวจสอบให้เอกสารสอดคล้องกับมาตรฐานทีม


```
