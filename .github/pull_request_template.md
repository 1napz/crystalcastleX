# 🧩 Frontend Restructure PR Template

## 📑 Summary
**EN:** Describe what files were moved into `frontend/` and why.  
**TH:** อธิบายไฟล์ที่ถูกย้ายไปที่ `frontend/` และเหตุผล  

---

## ✅ Checklist

### File Organization
- [ ] List any moved/renamed files and rationale
- [ ] Update README if structure changed

For migration-specific guidance, see [MIGRATION_CHECKLIST.md](../MIGRATION_CHECKLIST.md)

### Governance
- [ ] Bilingual documentation headers (`### English` / `### ภาษาไทย`) present in updated files
- [ ] Pre-commit hook passes locally
- [ ] Verified reviewer followed instructions/ReviewerChecklist.md
- [ ] GitHub Action `bilingual-check.yml` passes in CI/CD
- [ ] Verified reviewer followed instructions/ReviewerChecklist.md

### Reviewer Notes
- [ ] Cache logs visible in workflow run
- [ ] CodeRabbit feedback addressed (security scan, docs, folder structure)
- [ ] PR title follows convention (`chore: move UI files to frontend/`)

---

## 📜 Additional Context
**EN:** Add any notes about dependencies, CI/CD path updates, or dashboard integration.  
**TH:** เพิ่มหมายเหตุเกี่ยวกับ dependencies, การอัปเดต path ใน CI/CD หรือการเชื่อมต่อ dashboard
