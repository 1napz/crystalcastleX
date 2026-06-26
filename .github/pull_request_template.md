`markdown

📋 Pull Request Description

🔹 Purpose
- What does this PR do?
- Why is it needed?

🔹 Changes
- List the main changes (files, configs, features)
- Example: Added settings.yml for CI/CD configuration

🔹 Impact
- How does this affect deployment, CI/CD, or repo governance?
- Any breaking changes?

🔹 Testing
- Steps to verify changes locally
- Example: npm run test or vercel --prod

🔹 Governance
- Linked issue(s): #ISSUE_ID
- Reviewer(s): @username
- Labels: ci/cd, config, docs

🔹 Notes
- Any special considerations (security, secrets, migration steps)
`


`markdown

📌 Pull Request Template – Crystal Castle

📝 Summary
โปรดอธิบายว่า PR นี้ทำอะไร:
- ปัญหาที่แก้ไข / ฟีเจอร์ที่เพิ่ม
- เหตุผลที่ต้องทำการเปลี่ยนแปลงนี้

🔄 Changes
- รายการสิ่งที่เปลี่ยนแปลง (ไฟล์, configs, features)
- ใช้ bullet points เพื่อให้ reviewer อ่านง่าย

✅ Impact
- ผลกระทบต่อระบบ (CI/CD, Deployment, Security, Governance)
- มี Breaking Changes หรือไม่

🧪 Testing
วิธีตรวจสอบการทำงาน:
- [ ] Unit tests ผ่านทั้งหมด
- [ ] Integration tests ผ่าน
- [ ] Manual test บน local ผ่าน

📖 Documentation
- [ ] อัปเดต docs/ หรือ README.md ถ้ามีการเปลี่ยนแปลงที่เกี่ยวข้อง
- [ ] เพิ่มตัวอย่างการใช้งานใหม่ (ถ้ามี)

🔒 Security & CI/CD
- [ ] ตรวจสอบว่าไม่มี secret หรือ credential หลุดเข้ามา
- [ ] CI/CD checks ผ่านทั้งหมด (lint, build, test, security)

📌 Related Issues
- Closes #ISSUE_ID
- Milestone: (ถ้ามี)

👥 Reviewers
- Reviewer ที่เกี่ยวข้อง (CODEOWNERS จะ assign อัตโนมัติ)
- ต้องมี reviewer อย่างน้อย 1 คนอนุมัติ

👀 Reviewer Notes
- จุดที่ reviewer ควรโฟกัสเป็นพิเศษ
- ข้อควรระวังหรือ dependency ที่เกี่ยวข้อง

🛡️ Notes
- ตรวจสอบว่า secrets ถูกจัดการผ่าน environment variables เท่านั้น
- ห้าม commit ไฟล์ .env
`

---