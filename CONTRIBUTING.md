# Contributing to CrystalCastle 🏰
<!-- การมีส่วนร่วมในโปรเจกต์ CrystalCastle -->

> Workflow automation & governance system — maintained by [@ZyntroMedia](https://github.com/Zyntro-Media-AI)

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Commit Policy](#commit-policy)
3. [Commit Checklist](#commit-checklist)
4. [Reviewer Guidelines](#reviewer-guidelines)
5. [Governance & Audit Trail](#governance--audit-trail)
6. [Workflow Summary](#workflow-summary)

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/Zyntro-Media-AI/crystalcastle_workspace.git
cd crystalcastle_workspace
pnpm install

# Create a feature branch (never commit directly to main)
git checkout -b feat/<scope>/<short-description>
```

> ⚠️ **ห้าม push ตรงไปยัง `main` หรือ `staging`** — ต้องผ่าน PR + reviewer approval เท่านั้น

---

## Commit Policy

ใช้ **Conventional Commits** ทุก commit:

```
<type>(<scope>): <description>
```

| Type | ใช้เมื่อ |
|------|----------|
| `feat` | เพิ่ม feature ใหม่ |
| `fix` | แก้ไข bug |
| `docs` | อัปเดต documentation |
| `chore` | งาน maintenance / config |
| `refactor` | ปรับโครงสร้างโค้ด |
| `test` | เพิ่ม/แก้ไข test |
| `ci` | เปลี่ยน CI/CD config |

**ตัวอย่าง / Examples:**
```
feat(agent-hub): add task routing via Claude tool-use
fix(auth): resolve token refresh loop on mobile
docs(governance): update bilingual audit trail guide (TH/EN)
```

> สำหรับ commit ที่เกี่ยวกับ docs หรือ governance — ใส่ bilingual description (EN/TH) ด้วย

---

## Commit Checklist

ตรวจสอบก่อน commit ทุกครั้ง / Check before every commit:

### 🔐 Security & Compliance
- [ ] ไม่มี sensitive data (API keys, passwords, tokens) ใน commit
- [ ] `.gitignore` ครอบคลุมไฟล์ที่ไม่ควรเผยแพร่ทั้งหมด
- [ ] ไม่มี `.env`, `.env.local`, หรือ secrets file รั่วออกมา
- [ ] สอดคล้องกับ CrystalCastle governance policy

### 📝 Commit Message
- [ ] ใช้ Conventional Commits format
- [ ] Scope ระบุถูกต้อง (`agent-hub`, `auth`, `dashboard`, `ci`, ฯลฯ)
- [ ] Description กระชับ ชัดเจน ≤72 chars
- [ ] มี bilingual notes ถ้า commit เกี่ยวกับ docs/governance

### ⚙️ Code Quality
- [ ] ผ่าน lint (`pnpm lint`) และ formatter (`prettier`)
- [ ] ไม่มี `console.log` หรือ debug code ค้างอยู่
- [ ] ไม่มี unused imports หรือ dead code
- [ ] Functions มีขนาดเล็ก อ่านง่าย (Single Responsibility)

### 🧪 Testing
- [ ] รัน `pnpm test` ผ่านทั้งหมด
- [ ] Feature ใหม่ → มี unit test ครอบคลุม
- [ ] Bug fix → มี regression test
- [ ] Coverage ไม่ต่ำกว่า threshold ที่กำหนดใน CI

### 📖 Documentation
- [ ] อัปเดต `README.md` หรือ docs ที่เกี่ยวข้อง
- [ ] Diagram/Blueprint อัปเดตให้ตรงกับการเปลี่ยนแปลง
- [ ] มี inline comments สำหรับ logic ที่ซับซ้อน

---

## Reviewer Guidelines

### สิ่งที่ต้องตรวจสอบ / What to Review

**1. Security (บังคับ / Required)**
- ไม่มี secrets หรือ credentials รั่วใน diff
- ไม่มี SQL injection / XSS vector ใหม่
- ตรวจ dependency เพิ่มใหม่ — มีความเสี่ยงไหม?

**2. Logic & Architecture**
- โค้ดทำงานตามที่ PR description อธิบายไว้ไหม?
- มี edge case ที่ยังไม่ handle?
- สอดคล้องกับ architecture ของ CrystalCastle?

**3. Test Coverage**
- มี test สำหรับ happy path และ error path?
- Test มีความหมาย — ไม่ใช่แค่ pass ผ่าน?

**4. Governance Alignment**
- ตรวจ audit trail log ว่า capture ถูกต้อง
- KPIs ที่เกี่ยวข้อง (latency, token errors, usage %) ถูก track?

### Reviewer Response SLA
| Priority | ตอบภายใน |
|----------|-----------|
| `hotfix` / `security` | 2 ชั่วโมง |
| `feat` / `fix` | 24 ชั่วโมง |
| `docs` / `chore` | 48 ชั่วโมง |

### การ Approve
- ✅ **Approve** — พร้อม merge
- 💬 **Request Changes** — ระบุ item ที่ต้องแก้ให้ชัดเจน
- ❓ **Comment** — ถามเพื่อทำความเข้าใจ (ไม่ block merge)

> Reviewer ต้องบันทึก audit trail ใน governance dashboard (TH/EN) ทุกครั้งที่ approve หรือ request changes

---

## Governance & Audit Trail

ทุก PR ต้องมี:

```markdown
## Governance Checklist (แนบใน PR description)
- [ ] Reviewer checklist ผ่านครบ
- [ ] Audit trail บันทึกใน governance dashboard
- [ ] Alignment กับ KPIs ตรวจสอบแล้ว
- [ ] Compliance score ใน CI ผ่าน
```

### Branch Protection (main)
- Squash merge only
- Required: ≥1 reviewer approval
- Required: signed commits
- Required: Vitest coverage check ผ่าน
- No direct push

---

## Workflow Summary

```
Contributor
  └─► Stage files + Commit (ตาม Conventional Commits)
        └─► Push branch → Open PR
              └─► CI/CD: Lint + Test + Compliance check
                    └─► Reviewer: ตรวจ checklist + บันทึก audit trail
                          └─► Maintainer: Merge หลังผ่าน governance rules
                                └─► Dashboard: บันทึก metrics + ปรับปรุงต่อเนื่อง
```

---

> **CrystalCastle** — built with 🖤 by [Zyntro Media AI](https://github.com/Zyntro-Media-AI)
