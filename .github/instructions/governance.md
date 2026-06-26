# CrystalCastle Repository Governance 🏰

เอกสารนี้สรุปมาตรฐานการดูแลและการทำงานร่วมกันใน CrystalCastle repo  
เพื่อให้ทีมมี workflow ที่ชัดเจน ปลอดภัย และมีคุณภาพ

---

## 🔒 Security
- ห้าม commit ค่า secret จริง (API keys, service role keys, tokens)
- ใช้ `.env.local` สำหรับค่า secret และ exclude ด้วย `.gitignore`
- ใช้ `.env.example` เป็น template พร้อม placeholder เท่านั้น
- Reviewer ต้องตรวจสอบว่าไม่มี secret จริงใน PR

---

## ⚙️ CI/CD Workflow
- ทุก PR ต้องผ่าน GitHub Actions (build, lint, test)
- Deploy pipeline ต้องไม่ถูกกระทบจากการเปลี่ยนแปลง
- ใช้ commit prefix ตาม convention:  
  - `feat:` สำหรับฟีเจอร์ใหม่  
  - `fix:` สำหรับการแก้บั๊ก  
  - `chore:` สำหรับการปรับปรุง config/infra  
  - `docs:` สำหรับการอัปเดตเอกสาร  

---

## 📚 Documentation
- README.md ต้องมีคำแนะนำการ setup environment
- `.env.example` ต้องมี placeholder ครบถ้วน
- Reviewer Notes (`reviewer.notes.md`) ต้องใช้ทุกครั้งในการตรวจสอบ PR
- Quiz (`docs/quiz.md`, `docs/quiz.th.md`) ใช้สำหรับ reviewer training

---

## 🧩 Reviewer Training
- Reviewer ใหม่ต้องทำ Reviewer Quiz และอ่าน Reviewer Notes
- Reviewer Notes และ Quiz Instructions อยู่ใน `.github/instructions/`
- Quiz ภาษาอังกฤษและภาษาไทยอยู่ใน `docs/`

---

## ✅ Governance Summary
- **Security:** ไม่มี secret จริงใน repo  
- **CI/CD:** ทุก PR ต้องผ่าน workflow  
- **Documentation:** มี README, `.env.example`, reviewer notes  
- **Reviewer Training:** ใช้ quiz และ notes เป็นมาตรฐาน
