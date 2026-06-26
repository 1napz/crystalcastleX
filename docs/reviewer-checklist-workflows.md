`markdown

✅ Reviewer Checklist for Workflow PRs (Bilingual)

📌 Purpose / วัตถุประสงค์
English:  
This checklist ensures reviewers enforce CI/CD workflow standards, quota monitoring, and governance compliance.  

ไทย:  
Checklist นี้ช่วย reviewer บังคับใช้มาตรฐาน CI/CD workflow, quota monitoring และการปฏิบัติตาม governance  

---

📝 Checklist Items / รายการตรวจสอบ

🔍 CI/CD Validation
- [ ] Lint Passed → ESLint logs show no errors.  
- [ ] Unit Tests Passed → Jest results are green.  
- [ ] Integration Tests Passed → API/DB tests successful.  
- [ ] Quota Monitoring → Deployments ≤ 4/5, no quota exceeded.  
- [ ] Security Scan → No secrets exposed, npm audit clean.  

📂 Repo Hygiene
- [ ] Code placed under src/ only.  
- [ ] Documentation updates in docs/.  
- [ ] Folder structure respected.  

📜 Governance Compliance
- [ ] PR template bilingual completed.  
- [ ] CHANGELOG updated bilingual.  
- [ ] Release Notes updated bilingual.  
- [ ] No legacy API usage.  
- [ ] Secrets stored in GitHub Actions.  

---

👥 Reviewer Notes / หมายเหตุ Reviewer
English:  
- ❌ Reject PRs failing any CI/CD step.  
- ❌ Reject PRs missing bilingual documentation.  
- ✅ Approve PRs with complete checklist compliance.  

ไทย:  
- ❌ Reject PR ที่ CI/CD step ไม่ผ่าน  
- ❌ Reject PR ที่ไม่มีเอกสารสองภาษา  
- ✅ Approve PR ที่ทำตาม checklist ครบถ้วน  

---

✅ Summary / สรุป
English:  
This checklist enforces workflow rigor, repo hygiene, and governance rules, ensuring contributors meet reviewer expectations.  

ไทย:  
Checklist นี้บังคับใช้ workflow rigor, repo hygiene และ governance rules เพื่อให้ contributor ทำตามความคาดหวังของ reviewer  
`

---

