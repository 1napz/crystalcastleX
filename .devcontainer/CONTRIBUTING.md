# CONTRIBUTING.md  
คู่มือการมีส่วนร่วม (Contributor Guide)

---

## 1. Development Environment / สภาพแวดล้อมการพัฒนา
- ใช้ **Dev Container** ที่กำหนดไว้ในโฟลเดอร์ `.devcontainer`
  - `Dockerfile` → กำหนด base image และ dependencies
  - `devcontainer.json` → กำหนด VS Code settings และ extensions
  - `post-create.sh` → สคริปต์สำหรับ setup หลัง container ถูกสร้าง
  - `permissions` → ตรวจสอบสิทธิ์การเข้าถึงไฟล์/สคริปต์
- **Automation**: `.Coderabbit.yml` ใช้สำหรับ CI/CD และ reviewer automation

---

## 2. Reviewer Checklist Flow / ขั้นตอนตรวจสอบของ Reviewer
- ตรวจสอบ **Code Quality** (syntax, style, performance)
- ตรวจสอบ **Security & Governance** (permissions, secrets, compliance)
- ตรวจสอบ **Workflow & Automation** (CI/CD hooks, devcontainer setup)
- ตรวจสอบ **Documentation** (README, cross-repo references)

📌 Diagram: [docs/workflows/reviewer-checklist.md](docs/workflows/reviewer-checklist.md)

---

## 3. Admin Checklist Flow / ขั้นตอนตรวจสอบของ Admin
- ตรวจสอบ **Merge Policy** (branch protection, commit message format)
- ตรวจสอบ **Audit Trail Logs** (generated via `post-create.sh`)
- ตรวจสอบ **Cross-Repo Governance** (CrystalCastle ↔ PureAgent-Dev)

📌 Diagram: [docs/workflows/audit-trail.md](docs/workflows/audit-trail.md)

---

## 4. Commit Message Template / แม่แบบข้อความ Commit
ใช้ bilingual commit message format: