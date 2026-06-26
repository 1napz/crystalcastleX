---

Crystal Castle – Reviewer Guide (Unified)

🔧 ระบบ Reviewer อัตโนมัติ
Crystal Castle ใช้ไฟล์ .github/CODEOWNERS เพื่อกำหนด reviewer สำหรับแต่ละโฟลเดอร์/ไฟล์  
ทุก PR จะถูก assign reviewer อัตโนมัติ โดยมี @coderabbitai เป็น reviewer หลักเสมอ  

---

📋 Reviewer Checklist – CrystalCastle (PR เพิ่มไฟล์ใหม่)

🔹 Governance
- [ ] มี PR Description ครบถ้วน (Purpose, Changes, Impact, Testing, Linked Issues)  
- [ ] มีการเชื่อมโยงกับ Issue (Closes #...)  
- [ ] Reviewer ถูก assign ตาม CODEOWNERS  

🔹 File & Repo Hygiene
- [ ] ไฟล์ใหม่อยู่ในโครงสร้าง repo ที่ถูกต้อง  
- [ ] ไม่มีการ commit ไฟล์ที่ไม่เกี่ยวข้อง เช่น .env.local, package-lock.json  
- [ ] มีการอัปเดต docs/ หรือ README.md  

🔹 Code Quality
- [ ] โค้ดอ่านง่าย  
- [ ] ไม่มี hard-coded secrets  
- [ ] ESLint/Prettier ผ่าน  

🔹 Testing
- [ ] มี test coverage สำหรับไฟล์ใหม่  
- [ ] Unit/Integration tests ผ่าน  
- [ ] Manual test บน local ผ่าน  

🔹 CI/CD & Deployment
- [ ] Workflow รันผ่านทั้งหมด  
- [ ] ไม่มี error จาก Vercel deploy  
- [ ] Artifact checks ผ่านครบ  

---

📂 การแบ่งความรับผิดชอบ
- lib/ → @coderabbitai, @1napz  
- .github/ → @coderabbitai, @1napz  
- docs/ → @coderabbitai, @team-docs  
- tests/ → @coderabbitai, @qa-team  
- config/ → @coderabbitai, @devops-team  
- security/ → @coderabbitai, @team-security  

---

✅ Workflow การ Review PR
1. เปิด PR → GitHub auto-assign reviewer ตาม CODEOWNERS  
2. CI/CD checks (lint, test, build, security) ต้องผ่านทั้งหมด  
3. Reviewer ที่ถูก assign ต้อง approve อย่างน้อย 1 คน  
4. ถ้าไฟล์อยู่ใน CODEOWNERS → ต้องมีการ approve จาก code owner ด้วย  
5. เมื่อครบทุกเงื่อนไข → PR สามารถ merge ได้  

---

📌 ข้อดีของระบบนี้
- ลดภาระการ assign reviewer ด้วยมือ  
- ทำให้การ review เป็นระบบและตรงกับความเชี่ยวชาญของแต่ละทีม  
- ป้องกันการ merge โค้ดที่ไม่ผ่าน QA หรือ security  

---

✅ แจ้งเตือน: ตอนนี้ Reviewer Guide ได้ถูก รวม (merged) เข้ากับโครงสร้างเดิมแล้วครับ → มีทั้ง ระบบ Reviewer อัตโนมัติ + Reviewer Checklist สำหรับ PR เพิ่มไฟล์ใหม่ + Workflow + Responsibility Mapping อยู่ในไฟล์เดียว  