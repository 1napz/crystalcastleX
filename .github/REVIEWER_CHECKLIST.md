`markdown

📋 Reviewer Checklist – CrystalCastle (PR เพิ่มไฟล์ใหม่)

🔹 Governance
- [ ] มี PR Description ครบถ้วน (Purpose, Changes, Impact, Testing, Linked Issues)
- [ ] มีการเชื่อมโยงกับ Issue (Closes #...)
- [ ] Reviewer ถูก assign ตาม CODEOWNERS

🔹 File & Repo Hygiene
- [ ] ไฟล์ใหม่อยู่ในโครงสร้าง repo ที่ถูกต้อง (src/, frontend/, หรือ lib/)
- [ ] ไม่มีการ commit ไฟล์ที่ไม่เกี่ยวข้อง เช่น .env.local, package-lock.json
- [ ] มีการอัปเดต docs/ หรือ README.md เพื่ออธิบายการใช้งานไฟล์ใหม่

🔹 Code Quality
- [ ] โค้ดอ่านง่าย มีการตั้งชื่อ function/variable ที่สื่อความหมาย
- [ ] ไม่มี hard-coded secrets หรือ credentials
- [ ] มีการใช้ ESLint/Prettier ตามมาตรฐาน repo

🔹 Testing
- [ ] มี test coverage สำหรับไฟล์ใหม่ใน tests/
- [ ] Unit tests ผ่านทั้งหมด
- [ ] Integration tests ผ่าน
- [ ] Manual test บน local ผ่าน

🔹 CI/CD & Deployment
- [ ] Workflow ใน .github/workflows/ รันผ่านทั้งหมด
- [ ] ไม่มี error จาก Vercel deploy (ถ้า quota เกิน → reviewer ต้องแจ้ง contributor ว่าต้องรอ reset หรือ upgrade plan)
- [ ] Artifact upload/checks ผ่านครบ
`

---