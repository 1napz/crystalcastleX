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
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
`

2. Create a branch  
`bash
git checkout -b feature/new-feature
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

---

Would you like me to also prepare a README cross‑reference snippet so your main README links neatly to this CONTRIBUTING.md section?
