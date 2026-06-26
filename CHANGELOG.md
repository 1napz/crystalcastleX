📑 CHANGELOG.md (CrystalCastle)

docs/changelog/
 ├── 2026-Q2.md
 ├── 2026-Q3.md
 └── releases/

`markdown
## Versioning Strategy

CrystalCastle follows Semantic Versioning:

- MAJOR → breaking changes
- MINOR → new features
- PATCH → fixes and documentation updates

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

## [Unreleased]

### 📚 Documentation
- **CONTRIBUTING.md**
  - Added **Reviewer Checklist** section:
    - Schema validation (JSON files)
    - CI/CD pipeline checks
    - Dashboard logic review
    - UI layout validation
    - Documentation accuracy (bilingual consistency)
    - Business KPI alignment
  - Added **Governance Summary** section:
    - Reviewer workflow (validation + clarity)
    - Maintainer governance (approval, refactor, security escalation, final merge)
  - Improved transparency and alignment with CrystalCastle’s governance flow.

Related:
- PR #12
- Commit: abc1234

## Impact

- Improved contributor onboarding
- Increased governance transparency
- Reduced reviewer ambiguity

## AI Governance

AI-assisted documentation updates must still be reviewed by maintainers before merge.

@coderabbit update 
# CHANGELOG

## Latest Updates

- feat: add AI video rendering pipeline (a1b2c3)
- fix: resolve Vercel deploy timeout (d4e5f6)
- docs: update architecture diagram (g7h8i9)