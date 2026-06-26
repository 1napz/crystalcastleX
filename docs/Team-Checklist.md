# Governance Checklist / รายการตรวจสอบการกำกับดูแล

## 1. Licensing / ใบอนุญาต
- [ ] LICENSE file ถูกต้องและชัดเจน
- [ ] ไม่มีการละเมิดลิขสิทธิ์ (Copyright infringement)

## 2. Sensitive Data / ข้อมูลอ่อนไหว
- [ ] ไม่มีการใส่รหัสผ่าน, API keys, หรือข้อมูลส่วนตัว
- [ ] ตรวจสอบ `.gitignore` ครอบคลุมไฟล์ที่ไม่ควรเผยแพร่

## 3. Community Guidelines / แนวทางชุมชน
- [ ] README อธิบายการใช้งานอย่างสุภาพและชัดเจน
- [ ] ไม่มีเนื้อหาที่ละเมิด GitHub Terms of Service

## 4. Workflow & Automation / เวิร์กโฟลว์และระบบอัตโนมัติ
- [ ] Dependabot และ CI/CD ผ่านการตรวจสอบ
- [ ] PR จาก Dependabot มี reviewer/admin ตรวจสอบก่อน merge

## 5. Documentation / เอกสาร
- [ ] README และ CONTRIBUTING.md มี bilingual (TH/EN)
- [ ] Diagram (ASCII/Mermaid) อธิบาย workflow ชัดเจน

## 6. Security & Governance / ความปลอดภัยและการกำกับดูแล
- [ ] CODEOWNERS กำหนด reviewer/admin/agent roles
- [ ] Audit log และ board integration (ClickUp/Azure) ทำงานครบถ้วน