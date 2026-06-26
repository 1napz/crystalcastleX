`markdown

📝 Reviewer Feedback (CrystalCastle)

✅ General Review
- [ ] PR title & description ชัดเจน (Clear PR title & description)
- [ ] Linked issue/reference ครบถ้วน (Linked issue/reference included)
- [ ] ไม่มี secrets หรือ API keys ใน commit (No secrets/API keys in commits)

🛡 Security & Governance
- [ ] Supabase RLS เปิดใช้งานทุกตาราง (Supabase RLS enabled for all tables)
- [ ] CSP headers ถูกตั้งค่า (CSP headers configured)
- [ ] Rate limiting ผ่าน Upstash หรือเทียบเท่า (Rate limiting enforced)
- [ ] GitHub secret scanning ผ่าน (Secret scanning passed)

⚙️ Workflow & Automation
- [ ] CI/CD workflows ผ่าน GitHub Actions สำเร็จ (CI/CD workflows pass)
- [ ] Auto-comment bot ทำงานถูกต้อง (Auto-comment bot functioning)
- [ ] CodeRabbitAI config (.coderabbit.yaml) ถูกต้อง (CodeRabbitAI config validated)
- [ ] Kanban board sync กับ CI/CD (Kanban board synced with CI/CD)

📂 Documentation & Repo Hygiene
- [ ] README.md อัปเดตตามฟีเจอร์ใหม่ (README updated with new features)
- [ ] Environment variables อธิบายครบถ้วน (Environment variables documented)
- [ ] Reviewer notes อัปเดต (Reviewer notes updated)
- [ ] Release notes & changelog มี transparency (Release notes & changelog transparent)

---

💬 Reviewer Notes
- Reviewer-training.md ได้รับการปรับปรุงแล้ว → เนื้อหาภาษาไทย/English ครบถ้วน อ่านง่าย  
- .coderabbit.yaml ยังมี properties ที่ไม่รองรับ → ต้องแก้ไขตาม schema ล่าสุด  
- Vercel deployment error → เกิดจาก quota ฟรีเต็ม ต้องรอ 24 ชั่วโมงหรืออัปเกรด plan  

---

⚠️ Action Required:  
Reviewer ต้อง tick checklist ให้ครบ และแก้ไข .coderabbit.yaml ให้ตรง schema ก่อน merge.  
Deployment error ต้องถูกแก้ไขหรือยืนยันว่าไม่กระทบ production.
`

---