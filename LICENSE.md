Here’s a clean, professional README.md update you can use for your crystalcastle repo. It ties together your backup automation script, Supabase migration workflow, and contributor guidelines so everything is documented in one place:

`markdown

CrystalCastle Repository

📌 Overview
CrystalCastle is a structured, secure, and collaborative project designed with:
- Modular documentation (docs/)
- Automated workflows (CI/CD, CodeRabbit, GitHub Actions)
- Secure backup practices for scripts and artifacts
- Supabase database migration workflow for reproducibility

---

🔐 Secure Backup Workflow
We use backup.sh to encrypt and back up sensitive .sh scripts before pushing to the cloud.

Steps
1. Run the backup script:
   `bash
   ./backup.sh
   `
   → Encrypts, commits, and pushes automatically.

2. Clone and recover later:
   `bash
   git clone git@github.com:YOURNAME/crystalcastle.git
   cd crystalcastle
   gpg myscript.sh.gpg   # decrypts back to myscript.sh
   `

Golden Rules
- Never commit raw .sh files with secrets.
- Always encrypt before cloud backup.
- Keep repo private and enforce 2FA.

---

🛡️ Supabase Migration Workflow
We manage schema changes with Supabase migrations to ensure consistency across environments.

Commands
- Create migration:  
  `bash
  supabase migration new <desc>
  `
- Apply locally:  
  `bash
  supabase migration up
  `
- Reset with seed:  
  `bash
  supabase db reset
  `
- Deploy remotely:  
  `bash
  supabase db push
  `

Golden Rule: Never edit the remote database directly — always use migration files.

---

👥 Ownership & Responsibility
- Owner (ณัฐพงศ์):
  - Controls linking (supabase link), pushing (supabase db push), and repairing (supabase migration repair).
  - Manages project tokens and permissions.
- Contributors:
  - Create and test migrations locally.
  - Commit migration files to Git.
  - Submit PRs for review.
- CI/CD: Enforces checks but does not override owner authority.

---

📂 Documentation Index
- docs/backup_checklist.md → Secure backup steps
- docs/migrationownershipexample.md → Owner vs contributor responsibilities
- docs/index.md → Links to comparison, badges, diagram, timeline

---

✅ Status Badges
- CI/CD Workflow https://github.com/YOURNAME/crystalcastle/actions/workflows/ci.yml/badge.svg
- Security Scan https://github.com/YOURNAME/crystalcastle/actions/workflows/codeql.yml/badge.svg
- Deployment https://vercel.com/YOURNAME/crystalcastle/deployments

---

🚀 Contributing
1. Fork the repo and create a feature branch.
2. Add migrations or docs as needed.
3. Run supabase db reset before committing.
4. Submit a PR for review.

---

📜 License
This project is licensed under the MIT License. See LICENSE.md for details.
`

---

This README update makes your repo professional, secure, and contributor-friendly. It documents both your backup automation and Supabase workflow so teammates know exactly how to work with your project.  

Do you want me to also generate a shorter “Quick Start” section at the top (like 3 commands only) so new contributors can get running immediately without reading the full doc?