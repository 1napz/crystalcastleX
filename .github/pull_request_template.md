# 🚀 Pull Request

## 📌 Summary / สรุป
- EN: What changed and why
- TH: อธิบายสิ่งที่เปลี่ยนและเหตุผล

---

## ✅ Pre-Merge Checklist

### 🔧 Code & Logic
- [ ] Feature works as expected
- [ ] No breaking changes (or clearly documented)

### 🧪 Testing
- [ ] Tests added/updated (if applicable)
- [ ] Edge cases considered

### 📁 Structure & Docs
- [ ] Files moved/renamed are documented
- [ ] README/docs updated (if needed)

### 🤖 AI / Cost (สำคัญสำหรับคุณ)
- [ ] No unexpected cost increase
- [ ] AI output validated (mock or real)

---

## 🔎 Issue Reference
- Related: #<issue-number>

---

## 📝 Notes (Optional)
- Dependencies / CI changes / migration notes



# 🧾 CrystalCastle Pull Request

## 🎯 Type of Change
- [ ] Feature (new functionality)
- [ ] Fix (bug fix)
- [ ] Refactor (no behavior change)
- [ ] Docs (documentation only)
- [ ] Infra / CI
- [ ] Performance improvement

---

# 🧠 Core Rule: DOCSTRING ENFORCEMENT

⚠️ This repository enforces strict docstring compliance.

## 1. Public API Coverage (MANDATORY)

- [ ] All exported functions include docstring
- [ ] All API endpoints documented
- [ ] No public function without documentation

---

## 2. Path Compliance (based on repo structure)

### Frontend (likely `/Frontend/`)
- [ ] Functions/components documented (props, behavior)

### Backend / API
- [ ] Full request/response documented
- [ ] Error handling documented

### Scripts / automation
- [ ] Utility scripts include Args/Usage

---

## 3. Required Doc Fields

For ALL public functions:

- [ ] Description (what + why)
- [ ] Parameters (explicit types)
- [ ] Return value
- [ ] Side effects (if any)
- [ ] Example usage

---

## 4. AI Generated Doc Review (CodeRabbit)

- [ ] CodeRabbit docstrings reviewed
- [ ] No incorrect AI assumptions accepted
- [ ] Behavior matches implementation

---

## 5. Breaking Changes Check

- [ ] Function signature changed → docs updated
- [ ] API contract updated
- [ ] No stale documentation remains

---

# 🔍 Self Validation Checklist

- [ ] Code readable without reading implementation
- [ ] Naming semantic (no temp/data/input abuse)
- [ ] Functions single-responsibility
- [ ] No undocumented public logic

---

## 📝 ประเภทการอัปเดตข้อมูล (เลือกอย่างน้อย 1 ข้อ)
กรุณาระบุ **Label** นำหน้า Commit Message ให้ถูกต้องตามมาตรฐานโปรเจกต์:
- [ ] `feat(dev):` เพิ่มสคริปต์หรือฟีเจอร์ใหม่ด้านการเขียนโค้ด
- [ ] `fix(affiliate):` แก้ไขลิงก์เสียหรือข้อความผิดในหน้าการตลาด
- [ ] `docs(review):` อัปเดตไฟล์ Markdown หรือเอกสารความรู้ในคลัง

## 🧪 ผลการทดสอบ (สำหรับสาย Dev)
- [ ] รันคำสั่ง `pytest --headless` ผ่านเรียบร้อยในเครื่องส่วนตัว


# 🚨 MERGE BLOCK RULE

❌ Do NOT merge if ANY checklist is incomplete.

Enforcement is automatic via CI.

📌 Commit Message Bundle

Title (subject line):
`
docs: enforce docstring compliance and reviewer governance in PR template
`

Body (commit description):
`

Changes
- Updated .github/pullrequesttemplate.md with bilingual sections (EN/TH).
- Added Pre-Merge Checklist (code, tests, docs, AI/cost validation).
- Integrated Reviewer Checklist reference for schema, CI/CD, dashboard, UI, docs, and business alignment.
- Introduced strict docstring enforcement rules for public APIs, frontend, backend, and scripts.
- Added merge block rule: PR cannot be merged if any checklist item is incomplete.

Why
- Ensures contributors follow governance and documentation standards.
- Strengthens CI/CD and AI-assisted development compliance.
- Improves transparency for reviewers and maintainers.

Validation
- Verified Markdown formatting renders correctly.
- Cross-checked checklist items against CONTRIBUTING.md governance flow.
- Confirmed alignment with CodeRabbit docstring enforcement.
`

---

🔄 How It Connects
- Your PR editor (the description box in PR #627) should use the PR description snippet we drafted earlier.  
- Your commit message bundle (above) ensures the commit history matches the governance rules.  
- Your PR template (the checklist you pasted) enforces compliance automatically for contributors.  

---

