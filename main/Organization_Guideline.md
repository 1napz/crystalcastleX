Got it — let’s consolidate everything we’ve built (CI/CD workflow, contributor rules, PR/Issue templates, Code of Conduct, Security, etc.) into a single Organization_Guideline.md. This file acts as the master governance document for your repo, so contributors have one place to reference all standards.  

---

📄 Organization_Guideline.md

`markdown

🏛 Organization Guideline

This document consolidates all contributor rules, workflows, and community standards for the project.

---

⚙️ CI/CD Workflow

- CI Workflow: Runs lint, type-check, tests, and coverage on every push/PR.
- Preview Deploy: PRs trigger Vercel preview deployments.
- Production Deploy: Pushes to main trigger production deployment.
- Coverage Reporting: Integrated with Codecov for test quality.
- Semantic Release: Automates versioning, changelog, and npm publishing.

Badges:
![CI](https://github.com/<your-username>/<your-repo>/actions/workflows/ci.yml)
![Preview Deploy](https://github.com/<your-username>/<your-repo>/actions/workflows/preview.yml)
![Coverage](https://codecov.io/gh/<your-username>/<your-repo>)
![Release](https://github.com/<your-username>/<your-repo>/releases)
![Changelog](https://github.com/<your-username>/<your-repo>/blob/main/CHANGELOG.md)

---

🤝 Contributing Guide

Local Setup
`bash
npm ci
npm run dev
`

Branching Strategy
- main → production releases
- dev → feature development
- Feature branches: feat/<name> or fix/<name>

Quality Checks
- npm run lint
- npm run type-check
- npm run test
- npm run coverage

Commit Rules
Follow Conventional Commits:
- feat(auth): add login with Google
- fix(api): handle null response

Pull Requests
- Target dev
- Use PR Template
- Include screenshots/demo links
- Ensure CI checks pass

---

📄 Pull Request Template

`markdown

📝 Summary
- Purpose of PR, linked issues.

✅ Checklist
- [ ] Commits follow Conventional Commits
- [ ] Lint/type-check/tests pass
- [ ] Coverage updated
- [ ] Docs updated
- [ ] No secrets committed

🔍 Testing Notes
- Steps taken to verify changes.

📸 Screenshots / Demo
- UI changes or preview link.

🚀 Deployment Impact
- Env vars, migrations, breaking changes.

📖 Additional Context
- Reviewer notes.
`

---

🐞 Bug Report Template

`markdown

📝 Description
- Clear description of bug.

🔍 Steps to Reproduce
1. ...
2. ...

✅ Expected Behavior

❌ Actual Behavior

📸 Screenshots

🧪 Environment
- OS, Browser, Node.js version

📖 Additional Context
`

---

✨ Feature Request Template

`markdown

📝 Summary

💡 Motivation

🚀 Proposed Solution

📸 Mockups / References

📖 Additional Context
`

---

💬 Discussions Guide

- Q&A → troubleshooting
- Ideas → brainstorming
- Announcements → updates
- Show & Tell → community demos

---

📜 Code of Conduct

- Inclusive, respectful collaboration.
- No harassment, trolling, or personal attacks.
- Maintainers enforce standards.
- Report issues via email or GitHub Security tab.

---

🔒 Security Policy

- Supported branches: main, dev.
- Report vulnerabilities via email or GitHub Security Advisories.
- Do not open public issues for security concerns.
- Response within 48 hours, advisory published after fix.

---

📦 Releases

- Merges into main trigger semantic-release.
- Auto versioning + changelog updates.
- See CHANGELOG.md.

---

🌍 Community

- Use Discussions for Q&A, ideas, announcements.
- Follow Code of Conduct.
- Respect security guidelines.
`

---

✅ Result
This Organization_Guideline.md merges all your checklists, templates, and governance docs into one master file. It becomes the single source of truth for contributors.  

Would you like me to also create a ROADMAP.md section inside this file (instead of a separate file) so milestones and priorities are visible alongside guidelines?