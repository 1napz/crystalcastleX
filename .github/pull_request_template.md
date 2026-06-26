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

# 🚨 MERGE BLOCK RULE

❌ Do NOT merge if ANY checklist is incomplete.

Enforcement is automatic via CI.
