# PR Dashboard / สรุปสถานะ Pull Requests

## 🔎 Overview
- Total Open PRs: 41
- Closed/Merged PRs: (ตาม GitHub history)
- Status Categories:
  - ✅ Passed checks (CI/CD + CodeRabbit)
  - ⚠️ Failing checks (CodeQL, Vercel, etc.)
  - ⏳ In progress (workflow running)
  - ❌ Cancelled/Skipped (automation incomplete)

---

## 📌 Open PRs (ตัวอย่างสำคัญ)

### PR #379
- Status: Open
- Checks: ✅ Passed
- Code Owner Approval: Pending (Mr. Nattapong Pornlumfah)
- Next Action: Approve → Merge → Sync to Board

### PR #126 (API Integration)
- Status: Open
- Checks: ⚠️ Some failing
- Reviewer Checklist: Required
- Next Action: Fix issues → Re-run checks → Await Code Owner Approval

### PR #142
- Status: Open
- Checks: ⏳ In progress
- Governance Enforcement: Needs commit message fix
- Next Action: Contributor update → Code Owner review

### PR “Create ai.yml”
- Status: Open
- Checks: Mixed (some fail, some pass)
- Owner: @1napz
- Next Action: Resolve failing checks → Code Owner approval

---

## ✅ Governance Checklist (Applied to All PRs)
- [ ] CodeRabbitAI checks passed
- [ ] CI/CD checks passed
- [ ] Commit message bilingual (TH/EN)
- [ ] No sensitive data/secrets in diff
- [ ] ESLint/Prettier config visible in repo root
- [ ] Code Owner (Mr. Nattapong Pornlumfah) approval
- [ ] Sync status to ClickUp/Azure Board
- [ ] Log saved in `docs/status/pr-<ID>.log`

---

## 📌 Next Steps
- Review all 41 open PRs
- Approve only those that pass CodeRabbit + CI/CD
- Log each PR status in `docs/status/`
- Sync updates to ClickUp/Azure Board for audit trail