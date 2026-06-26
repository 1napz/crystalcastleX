📑 CHANGELOG.md (CrystalCastle)

`markdown

CHANGELOG (CrystalCastle)

บันทึกการเปลี่ยนแปลง (CrystalCastle)

---

📅 2026-05-08 – README Update

✨ Added / เพิ่ม
- Features section ครบถ้วน (CI/CD, reviewer cockpit, governance, audit trail, bilingual docs)
- Badges (CI/CD, CodeQL, Vercel, Privacy, Security)
- Environment variables example (VERCELTOKEN, GITHUBTOKEN)
- Project structure tree diagram
- Contributor workflow step-by-step (Fork → Branch → PR → Merge → Revert → Audit trail)
- Governance section bilingual + ASCII diagram
- Audit trail logs flow diagram bilingual
- Reviewer actions flow diagram bilingual
- Quick links ไปยัง reviewer pack (notes, rules, checklist, flow, index, audit, actions)

🛠️ Changed / เปลี่ยนแปลง
- README เดิมมีเพียง basic CI/CD mention → README ใหม่มี governance + audit trail + reviewer cockpit integration
- เพิ่ม bilingual (TH/EN) ทุก section → README เดิมไม่มี bilingual
- เพิ่ม ASCII diagrams (governance, audit trail, reviewer actions) → README เดิมไม่มี visual
- เพิ่ม transparency (audit trail consistency, reviewer cockpit decision flow) → README เดิมไม่ชัดเจน

🗑️ Removed / ลบ
- ไม่มี section ที่ถูกลบ แต่ปรับปรุงจาก README เดิมที่ไม่ครบถ้วน

---

📊 Diff Summary (Old vs New README)
| Aspect / ด้าน           | Old README (ก่อนหน้า)                          | New README (ล่าสุด)                                                                 |
|--------------------------|------------------------------------------------|-------------------------------------------------------------------------------------|
| Features                 | Basic CI/CD mention                            | Full list: CI/CD, reviewer cockpit, governance, audit trail, bilingual docs          |
| Governance Flow          | ไม่มี diagram                                  | มี ASCII diagram bilingual (merge → revert → audit trail → reviewer cockpit)        |
| Audit Trail              | ไม่ระบุ                                        | ระบุ log bilingual, severity matrix, reviewer actions, diff table, checklist        |
| Reviewer Docs            | ไม่ลิงก์                                       | ลิงก์ครบ: notes, rules, checklist, flow, index, audit, actions                      |
| Contributor Workflow     | ไม่ชัดเจน                                      | มี step-by-step (fork → branch → PR → merge → revert → audit trail)                 |
| Bilingual Support        | ไม่มี                                           | ครบ bilingual (TH/EN) ทุก section                                                   |
| Visuals (ASCII Diagram)  | ไม่มี                                           | มีหลาย diagram: governance, audit trail, reviewer actions, diff table flow          |
| Transparency             | ต่ำ                                            | สูง → audit trail consistency, reviewer cockpit decision flow                       |

---

📌 Notes / หมายเหตุ
- README ล่าสุดทำให้ CrystalCastle มี onboarding ง่ายขึ้น, governance enforce ได้จริง, audit trail โปร่งใส
- Reviewer cockpit ใช้งานได้ทันทีด้วย reviewer pack + audit trail docs
`

---

✅ ผลลัพธ์: ตอนนี้คุณมี CHANGELOG.md bilingual ที่สรุปการเปลี่ยนแปลง README ล่าสุด → reviewer cockpit จะเห็น history ของการอัปเดต README ได้ชัดเจน  
