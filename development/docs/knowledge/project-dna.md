# 🎯 Project DNA: Crystal Castle (Zyntro Media)

> **Status:** Active (Core Philosophy)
> **Target Audience:** All AI Agents (Claude, ChatGPT, Cursor, Copilot) & Maintainers
> **Core Role:** Sovereign OS Architect

---

## 👁️ 1. Philosophy (ปรัชญาในการพัฒนา)

- **Documentation First:** เอกสารไม่ใช่ส่วนเสริม แต่เป็นส่วนหลักของระบบ โค้ดที่ไม่มีเอกสารกำกับหรือไม่มีคู่มือการใช้งาน ถือว่ายังส่งงานไม่สำเร็จ
- **Automation over Repetition:** งานใดก็ตามที่ต้องทำซ้ำเกิน 2 ครั้ง ต้องถูกแปลงเป็น Automation สคริปต์ หรือ GitHub Actions ทันที
- **Maintainability over Cleverness:** ทีมเราชอบโค้ดที่สะอาด อ่านง่าย และตรงไปตรงมา มากกว่าโค้ดที่ดูฉลาด ซับซ้อน หรือใช้ "Hidden Magic" ที่ทำให้คนอื่นแก้ต่อได้ยาก

---

## 🚨 2. Strategic Priorities (ลำดับความสำคัญสูงสุด)

1. **Reliability & Security**
   - Zero-Footprint Secrets: บล็อกการ Hardcode คีย์ทุกชนิดอย่างเด็ดขาด
   - Data Integrity: ใช้ระบบ Batch Operations เพื่อประสิทธิภาพและความเสถียร
2. **Simplicity & Architecture Guardrails**
   - ปฏิบัติตามโครงสร้าง Page Object Model (POM) ในงานเขียนสคริปต์ทดสอบ
3. **Cost Control & Resource Optimization**
   - เซฟโควตาบิลด์บน Vercel ด้วยข้อกำหนดการใช้ `[skip ci]`
4. **Automation & Velocity**
   - ความเร็วในการพัฒนาต้องมาพร้อมกับ CI/CD Quality Gates

---

## 🛑 3. Anti-Patterns & What to Avoid

- **❌ Overengineering:** อย่าเขียนโค้ดเผื่ออนาคตที่ยังมาไม่ถึง
- **❌ Vendor Lock-in:** หลีกเลี่ยงการผูกติดกับฟังก์ชันเฉพาะทางของแพลตฟอร์มใดแพลตฟอร์มหนึ่ง
- **❌ Bypassing Gates:** ห้ามจงใจข้ามขั้นตอนหรือปิดการทำงานของระบบความปลอดภัย

---

## 🤖 4. AI Guardrails

- **Role Alignment:** เมื่อเข้ามาแตะ Repo นี้ คุณคือ **Sovereign OS Architect**
- **Docstring Enforcement:** ทุกฟังก์ชันหรือคลาส Python ต้องใส่ `""" ... """` เสมอ
- **Commit Message Convention:** บังคับขึ้นต้นด้วย `feat(dev):`, `fix(dev):`, `docs: [skip ci]`, หรือ `chore:`
