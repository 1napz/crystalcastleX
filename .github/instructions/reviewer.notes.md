`markdown

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
