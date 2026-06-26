# 🗄️ Archived Workflows (CrystalCastle)

## Purpose / วัตถุประสงค์
**English:**  
This document lists workflows that are outdated, replaced, or scheduled for deletion.  
Contributors should avoid using these workflows and instead refer to updated versions in `.github/workflows/`.

**ไทย:**  
เอกสารนี้ใช้สำหรับแจ้ง workflows ที่ล้าสมัย ถูกแทนที่แล้ว หรือควรถูกลบออก  
Contributor ไม่ควรใช้งาน workflows เหล่านี้ และควรอ้างอิงเวอร์ชันใหม่ใน `.github/workflows/`

---

## 🔹 Deprecated Workflows / Workflows ที่เลิกใช้แล้ว

### 1. `ci-old.yml`
- **English:** Legacy CI pipeline (Node 14.x) replaced by `ci.yml` (Node 18.x, 20.x, 22.x).  
- **ไทย:** CI pipeline เก่า (Node 14.x) ถูกแทนที่ด้วย `ci.yml` (Node 18.x, 20.x, 22.x).

---

### 2. `deploy-legacy.yml`
- **English:** Old deployment workflow to Heroku. Replaced by `vercel-deploy.yml`.  
- **ไทย:** Workflow สำหรับ deploy ไป Heroku ถูกแทนที่ด้วย `vercel-deploy.yml`.

---

### 3. `security-scan-old.yml`
- **English:** Deprecated security scan workflow. Replaced by `security-scan.yml` with Microsoft Defender integration.  
- **ไทย:** Workflow ตรวจสอบความปลอดภัยแบบเก่า ถูกแทนที่ด้วย `security-scan.yml` ที่เชื่อมกับ Microsoft Defender.

---

### 4. `auto-labeler-legacy.yml`
- **English:** Old auto-labeler workflow. Replaced by `auto-labeler.yml` with governance rules.  
- **ไทย:** Workflow auto-labeler แบบเก่า ถูกแทนที่ด้วย `auto-labeler.yml` ที่มี governance rules.
