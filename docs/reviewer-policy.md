📜 Reviewer Policy – CrystalCastle

🇹🇭 ภาษาไทย

วัตถุประสงค์
เพื่อบังคับใช้มาตรฐานการรีวิวที่ชัดเจน, ป้องกันข้อผิดพลาดด้านความปลอดภัย, และรักษา repo hygiene ให้สอดคล้องกับ governance ของ CrystalCastle

กฎการรีวิว
1. Commit Message  
   - ต้องเป็น bilingual (English + Thai)  
   - ต้องใช้ conventional commit format เช่น feat:, fix:, docs:, chore:  

2. Documentation  
   - ทุกไฟล์ใน docs/ ต้อง bilingual (Thai/English)  
   - ต้องมี artifacts ครบ: reviewer-policy.md, reviewer-checklist.md, reviewer-notes.md, commit-message-cheatsheet.md  

3. Security  
   - ห้าม commit secrets หรือ API keys ลงใน client-side code  
   - ต้องใช้ ${{ secrets.* }} ใน workflow แทน hardcode  

4. Workflow & Governance  
   - Reviewer ต้องตรวจสอบว่า .github/workflows/ ใช้ secrets อย่างถูกต้อง  
   - Reviewer ต้องบันทึกผลการตรวจสอบใน reviewer-notes.md ทุกครั้ง  

5. API Review  
   - ต้องมี error handling ครบ (try-catch, status codes)  
   - ห้ามใช้ SQL string concatenation → ต้องใช้ parameterized queries  

---

🇬🇧 English

Purpose
To enforce clear reviewer standards, prevent security issues, and maintain repo hygiene aligned with CrystalCastle governance.

Review Rules
1. Commit Message  
   - Must be bilingual (English + Thai)  
   - Must follow conventional commit format such as feat:, fix:, docs:, chore:  

2. Documentation  
   - All files in docs/ must be bilingual (Thai/English)  
   - Required artifacts: reviewer-policy.md, reviewer-checklist.md, reviewer-notes.md, commit-message-cheatsheet.md  

3. Security  
   - No secrets or API keys in client-side code  
   - Workflows must use ${{ secrets.* }} instead of hardcoded values  

4. Workflow & Governance  
   - Reviewer must verify .github/workflows/ secrets usage  
   - Reviewer must record findings in reviewer-notes.md for every PR  

5. API Review  
   - Error handling must be complete (try-catch, status codes)  
   - No SQL string concatenation → must use parameterized queries  

---

📌 Reviewer Enforcement Note  
- Reviewer ต้องใช้ policy นี้ทุกครั้งที่ตรวจ PR  
- Reviewer bot (CodeRabbitAI) จะ enforce commit message และ docs bilingual แต่ reviewer ต้องตรวจสอบ security และ governance ด้วยตนเอง  
- Reviewer ต้อง reject PR ที่ไม่ตรงตาม policy  

---