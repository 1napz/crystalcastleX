# CrystalCastle Knowledge Log Hub

## 📑 Purpose
This hub collects important log entries that serve as knowledge for the team.
(รวม log สำคัญที่ใช้เป็นฐานความรู้สำหรับทีม)

---

## 🔎 Categories
- **Ignore File Changes**
  - Timestamp, File, Reason, Summary bilingual, Impact
- **CI/CD Pre-check**
  - Merge conflict detection, sync status
- **ESLint & Governance**
  - Passed/Failed checks, Severity matrix
- **Unit Test**
  - Tests passed/failed, Coverage summary

---

## 📄 Example Entry

### Ignore File Change
[2026-05-09 01:00]  
File: `.eslintignore`  
Reason: Exclude build and coverage artifacts  

**Summary (English):**  
- Added `/build/`  
- Added `/coverage/`  
- Ensures consistent repo hygiene across team  

**สรุป (ภาษาไทย):**  
- เพิ่ม `/build/`  
- เพิ่ม `/coverage/`  
- เพื่อให้ repo สะอาดและทีม sync กันได้  

Impact: Minor (no effect on production code, only repo hygiene)