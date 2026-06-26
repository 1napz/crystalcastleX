---

📝 Commit Message Cheatsheet – CrystalCastle

🇹🇭 ภาษาไทย

รูปแบบมาตรฐาน
`
<type>(<scope>): <description in English> (<คำอธิบายภาษาไทย>)
`

ประเภทที่ใช้บ่อย
- feat: เพิ่มฟีเจอร์ใหม่  
- fix: แก้บั๊กหรือข้อผิดพลาด  
- docs: เพิ่ม/แก้ไขเอกสาร  
- chore: งานทั่วไป เช่น config, build, dependency  
- refactor: ปรับโครงสร้างโค้ดโดยไม่เปลี่ยนพฤติกรรม  
- test: เพิ่มหรือแก้ไขการทดสอบ  
- ci: แก้ไข workflow หรือ pipeline  

ตัวอย่าง
`
feat(mock): add mock-api.js for UI testing (เพิ่ม mock-api.js สำหรับทดสอบ UI)
fix(workflow): correct path for dependabot-auto-merge (แก้ path dependabot-auto-merge ให้ถูกต้อง)
docs(reviewer): add reviewer-policy.md (เพิ่ม reviewer-policy.md สำหรับ reviewer enforcement)
chore(config): update .coderabbit.yaml schema (ปรับ .coderabbit.yaml ให้ตรง schema)
`

---

🇬🇧 English

Standard Format
`
<type>(<scope>): <description in English> (<description in Thai>)
`

Common Types
- feat: Add new feature  
- fix: Bug fix  
- docs: Documentation changes  
- chore: General tasks (config, build, dependency)  
- refactor: Code restructuring without behavior change  
- test: Add or update tests  
- ci: Workflow or pipeline changes  

Examples
`
feat(mock): add mock-api.js for UI testing (เพิ่ม mock-api.js สำหรับทดสอบ UI)
fix(workflow): correct path for dependabot-auto-merge (แก้ path dependabot-auto-merge ให้ถูกต้อง)
docs(reviewer): add reviewer-policy.md (เพิ่ม reviewer-policy.md สำหรับ reviewer enforcement)
chore(config): update .coderabbit.yaml schema (ปรับ .coderabbit.yaml ให้ตรง schema)
`

---

📌 Reviewer Enforcement Note  
- ทุก commit ต้อง bilingual (English + Thai)  
- ต้องใช้ conventional commit type ที่กำหนดไว้  
- Reviewer bot (CodeRabbitAI) จะ enforce commit message ตาม cheatsheet นี้  
- Reviewer ต้อง reject commit ที่ไม่ตรงตาม format  

---