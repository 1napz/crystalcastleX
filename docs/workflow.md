# 🔄 Contributor & Reviewer Workflow Guide (Bilingual)

## 🚀 Contributor Workflow / ขั้นตอนของผู้ร่วมพัฒนา
**English:**  
1. Clone the repository  
2. Create a new branch for your feature or fix  
3. Implement changes and commit using bilingual Conventional Commits  
4. Push branch and open a Pull Request using the bilingual PR template  
5. Attach relevant logs (e.g., `creation.log`) if Codespaces or CI/CD errors occur  

**ไทย:**  
1. โคลน repository  
2. สร้าง branch ใหม่สำหรับฟีเจอร์หรือการแก้ไข  
3. ทำการเปลี่ยนแปลงและ commit โดยใช้ Conventional Commits สองภาษา  
4. Push branch และเปิด Pull Request โดยใช้ PR template สองภาษา  
5. แนบ log ที่เกี่ยวข้อง (เช่น `creation.log`) หาก Codespaces หรือ CI/CD มี error  

---

## 🔎 Reviewer Workflow / ขั้นตอนของผู้รีวิว
**English:**  
1. Review PR description and attached logs  
2. Use bilingual reviewer checklist (`docs/reviewer.notes.md`)  
3. Provide actionable comments using `.github/PULL_REQUEST_TEMPLATE/reviewer-comment.md`  
4. Approve or request changes based on governance rules  
5. Ensure CI/CD checks pass before merging  

**ไทย:**  
1. ตรวจสอบรายละเอียด PR และ log ที่แนบมา  
2. ใช้ reviewer checklist สองภาษา (`docs/reviewer.notes.md`)  
3. ให้ comment ที่ actionable โดยใช้ `.github/PULL_REQUEST_TEMPLATE/reviewer-comment.md`  
4. อนุมัติหรือขอแก้ไขตามกฎ governance  
5. ตรวจสอบให้แน่ใจว่า CI/CD checks ผ่านก่อน merge  

---

## ⚙️ CI/CD Pipeline / ระบบ CI/CD
**English:**  
- Build → Test → Security Scan → Deploy → Alert  
- Automated workflows in `.github/workflows/` enforce repo hygiene  

**ไทย:**  
- Build → Test → Security Scan → Deploy → Alert  
- Workflow อัตโนมัติใน `.github/workflows/` ช่วยบังคับใช้ repo hygiene  

---

## 📌 Governance Rules / กฎการบังคับใช้
**English:**  
- All commits must follow bilingual Conventional Commits  
- All PRs must use bilingual templates  
- Deprecated files must be moved to `archive/`  

**ไทย:**  
- ทุก commit ต้องใช้ Conventional Commits สองภาษา  
- ทุก PR ต้องใช้ template สองภาษา  
- ไฟล์ที่เลิกใช้ต้องย้ายไปที่ `archive/`  

---

## ✅ Summary / สรุป
**English:**  
This workflow ensures contributors and reviewers collaborate effectively with bilingual artifacts, structured PRs, and CI/CD enforcement.  

**ไทย:**  
Workflow นี้ช่วยให้ contributor และ reviewer ทำงานร่วมกันได้อย่างมีประสิทธิภาพ โดยมี artifact สองภาษา, PR ที่มีโครงสร้างชัดเจน และการบังคับใช้ CI/CD