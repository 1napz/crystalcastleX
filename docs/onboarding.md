# 🚀 Crystal Castle Onboarding Guide

ยินดีต้อนรับสู่ Crystal Castle!  
คู่มือนี้จะช่วยให้ contributor ใหม่เข้าใจขั้นตอนการทำงาน ตั้งแต่การ setup environment, deploy, ไปจนถึงการแก้ไขปัญหาที่เจอบ่อย

---

## 1️⃣ Setup Environment
- Clone repo: `git clone https://github.com/1napz/crystalcastle.git`
- Install dependencies: `npm install`
- Run local dev: `npm run dev`
- ใช้ Codespaces หรือ VS Code Dev Container สำหรับ environment ที่ consistent

---

## 2️⃣ Workflow & Governance
- Branch naming:  
  - `feature/*` → ฟีเจอร์ใหม่  
  - `fix/*` → bug fix  
  - `docs/*` → เอกสาร  
- Pull Request:  
  - ใช้ template `.github/pull_request_template.md`  
  - ต้องมี reviewer อย่างน้อย 1 คนอนุมัติ  
- CI/CD:  
  - GitHub Actions → lint, build, test  
  - Vercel → deploy preview (main branch เท่านั้น)

---

## 3️⃣ Deploy Guide
- Deploy preview: push ไปที่ branch → Vercel auto-deploy  
- Production deploy: merge เข้า `main` → Vercel deploy production  
- ใช้ `.vercelignore` เพื่อลดไฟล์ที่ไม่จำเป็น  
- ถ้า quota Vercel หมด → รอ reset 24 ชั่วโมง หรืออัปเกรด plan

---

## 4️⃣ Troubleshooting
### Repository Not Found
- ตรวจสอบชื่อ repo และสิทธิ์การเข้าถึง

### Vercel Quota Exceeded
- รอ 24 ชั่วโมง หรืออัปเกรด plan

### Codespaces Refresh
- Restart หรือ Rebuild container  
- ถ้า environment พัง → Delete & Recreate Codespace

### AI Usage Limit
- ถ้า quota หมด → รอ reset หรืออัปเกรด plan

---

## 5️⃣ Contributor Guide
- ห้าม commit `.env` หรือ secrets  
- ใช้ environment variables สำหรับ API keys  
- อัปเดต `docs/` หรือ `README.md` เมื่อมีการเปลี่ยนแปลงที่เกี่ยวข้อง  
- ใช้ commit message style guide:  
  - `feat:` → ฟีเจอร์ใหม่  
  - `fix:` → bug fix  
  - `docs:` → เอกสาร  
  - `chore:` → งานเบ็ดเตล็ด

---

## 6️⃣ Reviewer Notes
- ตรวจสอบ CI/CD checks ผ่านทั้งหมด  
- ตรวจสอบว่าไม่มี secrets หลุดเข้ามา  
- ตรวจสอบว่า PR มี description ครบถ้วนตาม template

---

## ✅ Checklist สำหรับ Contributor ใหม่
- [ ] Setup environment เรียบร้อย  
- [ ] ใช้ branch naming convention  
- [ ] เปิด PR พร้อม template  
- [ ] ผ่าน CI/CD checks  
- [ ] Reviewer อนุมัติ