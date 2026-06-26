## 🔍 Reviewer Checklist (CrystalCastle)

### 🧠 Core Review
- [ ] PR title & description ชัดเจน
- [ ] มี issue/reference ที่เกี่ยวข้อง
- [ ] โค้ดอ่านเข้าใจได้ และไม่มี logic ซับซ้อนเกินจำเป็น
- [ ] ไม่มี debug code หรือ console logs ที่ไม่จำเป็น

---

### 🔐 Security Check
- [ ] ไม่มี secrets / API keys ใน code
- [ ] `.env` / `.env.local` ไม่ถูก commit
- [ ] ใช้ `.env.example` แทนค่า real credentials
- [ ] ไม่มี sensitive data ใน logs หรือ response

---

### ⚙️ System Integrity
- [ ] CI/CD ผ่าน (lint + tests)
- [ ] ไม่มี breaking change ที่ไม่ได้ระบุ
- [ ] build / deploy workflow ยังทำงานได้

---

### 📦 Documentation
- [ ] README หรือ docs updated ถ้ามี feature change
- [ ] env variables documented (ถ้ามีการเพิ่มใหม่)

---

### 🧩 Governance (Soft Check)
- [ ] Commit message เป็น conventional format (feat/fix/chore)
- [ ] PR scope ไม่กว้างเกินไป (1 PR = 1 purpose)

---

## 📝 Notes for Reviewer
- ใช้ checklist นี้เพื่อ maintain quality ไม่ใช่ block unnecessary changes
- ถ้าไม่ critical issue → สามารถ approve พร้อม comment ได้