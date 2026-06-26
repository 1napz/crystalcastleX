`markdown
## 🔍 Reviewer Checklist (CrystalCastle)

### General Review
- [ ] PR title & description ชัดเจน (Clear PR title & description)
- [ ] Linked issue/reference ครบถ้วน (Linked issue/reference included)
- [ ] ไม่มี secrets หรือ API keys ใน commit (No secrets/API keys in commits)
- [ ] ใช้ mock mode สำหรับการทดสอบ (Mock mode used for testing)

### Security & Governance
- [ ] Supabase RLS เปิดใช้งานทุกตาราง (Supabase RLS enabled for all tables)
- [ ] CSP headers ถูกตั้งค่า (CSP headers configured)
- [ ] Rate limiting ผ่าน Upstash หรือเทียบเท่า (Rate limiting enforced)
- [ ] GitHub secret scanning ผ่าน (Secret scanning passed)

### Workflow & Automation
- [ ] CI/CD workflow ผ่าน GitHub Actions สำเร็จ (CI/CD workflows pass)
- [ ] Auto-comment bot ทำงานถูกต้อง (Auto-comment bot functioning)
- [ ] CodeRabbitAI config (.coderabbit.yaml) ถูกต้อง (CodeRabbitAI config validated)
- [ ] Kanban board sync กับ CI/CD (Kanban board synced with CI/CD)

### Documentation & Repo Hygiene
- [ ] README.md อัปเดตตามฟีเจอร์ใหม่ (README updated with new features)
- [ ] Environment variables อธิบายครบถ้วน (Environment variables documented)
- [ ] Reviewer notes อัปเดต (Reviewer notes updated)
- [ ] Release notes & changelog มี transparency (Release notes & changelog transparent)

---

⚠️ **Action Required:**  
Reviewer ต้อง tick checklist นี้ให้ครบก่อน merge.  
หากข้อใดไม่ผ่าน → ต้อง request changes พร้อมเหตุผล.
Reviewer Notes 📝

ใช้ checklist นี้ทุกครั้งที่ทำการ review Pull Request เพื่อให้มั่นใจว่ามีมาตรฐานและความปลอดภัย

---

🔒 Security
- ตรวจสอบว่าไม่มีการ commit ค่า secret จริง (เช่น API keys, service role keys)
- ยืนยันว่า .env.local ไม่ถูก push เข้า repo
- ตรวจสอบว่า .gitignore มีการ exclude .env.local

---

📂 Documentation
- ตรวจสอบว่า .env.example มีอยู่และใช้ placeholder ที่ชัดเจน
- README.md มีคำแนะนำให้ contributor copy .env.example → .env.local
- ไม่มี sensitive data ในตัวอย่างหรือเอกสาร

---

⚙️ Workflow
- CI/CD ผ่าน GitHub Actions ยังทำงานได้ตามปกติ
- ไม่มี error ใหม่จากการ build หรือ deploy
- Tests และ lint ผ่านครบถ้วน

---

🧩 Governance
- Commit message มีความชัดเจนและสอดคล้องกับ convention (เช่น chore:, fix:, feat:)
- Pull Request description อธิบายการเปลี่ยนแปลงและเหตุผลอย่างชัดเจน
- Reviewer สามารถเข้าใจเป้าหมายของ PR ได้ทันที

---

✅ Final Check
- [ ] ไม่มี secrets จริงใน PR
- [ ] .env.local ถูกลบออกจริง
- [ ] .env.example มี placeholder ครบถ้วน
- [ ] README.md อัปเดตคำแนะนำเรียบร้อย
- [ ] CI/CD และ tests ผ่านครบ
`

---
