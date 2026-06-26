`markdown

CrystalCastle Contribution Guidelines

📝 Commit Messages
- ภาษาไทย/English คู่กัน (Bilingual)
- ใช้รูปแบบ: <type>: <short description>
- ตัวอย่าง:
  - fix: แก้ path ของ workflow ให้ถูกต้อง
  - docs: update onboarding guide

Types
- feat → เพิ่มฟีเจอร์ใหม่ (New feature)
- fix → แก้บั๊ก (Bug fix)
- docs → ปรับปรุงเอกสาร (Documentation)
- chore → งานทั่วไป เช่น update dependencies (General tasks)
- test → เพิ่ม/แก้ไข test (Tests)

---

🔄 Pull Request Hygiene
- Branch name → ใช้รูปแบบ feature/..., fix/..., docs/...
- PR description → อธิบายการเปลี่ยนแปลงเป็นภาษาไทย/อังกฤษ
- Checklist ก่อน merge
  - [ ] Workflow อยู่ใน .github/workflows/
  - [ ] ไม่มีการ commit .env.local
  - [ ] มี .env.example สำหรับ contributor
  - [ ] Workflow รองรับ Node.js 24
  - [ ] Docs อัปเดตถ้ามีการเปลี่ยนแปลงที่เกี่ยวข้อง

---

👀 Reviewer Checklist
- ตรวจสอบว่า commit message ชัดเจน  
- ตรวจสอบว่าไม่มี secrets จริงใน .secrets.baseline  
- ตรวจสอบว่า test results ถูกสร้างและ upload artifact สำเร็จ  
- ตรวจสอบว่า docs มี section “CI/CD Common Errors & Fixes”  

---

🔒 Privacy Notice
- ห้าม commit secrets เช่น API keys, tokens, หรือ .env.local  
- ใช้ .env.example เป็น template สำหรับ contributor  
- Production secrets ต้องตั้งค่าใน GitHub Actions secrets หรือ Vercel Dashboard  
- Reviewer ต้องตรวจสอบทุก PR ว่าไม่มีข้อมูลลับหลุดเข้ามาใน repo  

---

✅ Summary
- ใช้ commit message ที่ชัดเจนและ bilingual  
- รักษา PR hygiene ด้วย branch name และ description ที่ถูกต้อง  
- Reviewer ต้องใช้ checklist ตรวจสอบทุกครั้ง  
- Secrets ต้องถูกจัดการผ่าน GitHub/Vercel ไม่ใช่ commit ลง repo
`

---
