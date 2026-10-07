# 📇 CrystalCastle – Reviewer Quick Guide
> Single source of truth for reviewing PRs in `Zyntro-Media-AI/crystalcastle`

## 🚀 Deploy Essentials
- **Entry:** `index.html` - AI Video Studio
- **Config:** `vercel.json` uses AI Gateway failover: `Groq → Gemini → OpenAI`
- **Ignore:** `.vercelignore` excludes `vitest.config.js`, `task.md`, `tiktok*`
- **Deploy Command:** `vercel deploy --prod --archive=tgz`

## 🔧 Governance & Workflow
**Active Workflows:** `ci.yml`, `reviewer-checklist.yml`, `auto-apply.yml`, `security-scan.yml`, `ai-validation.yml`  
**Archived:** `release.yml`, `stale.yml`, `dispatchflow.yml` → `.github/workflows/notuse/`

**Auto-Assign Rules via `.github/CODEOWNERS`**
| Path | Code Owners |
| --- | --- |
| `lib/` | `@coderabbitai`, `@1napz` |
| `.github/` | `@coderabbitai`, `@1napz` |
| `docs/` | `@coderabbitai`, `@team-docs` |
| `tests/` | `@coderabbitai`, `@qa-team` |
| `config/` | `@coderabbitai`, `@devops-team` |
| `security/` | `@coderabbitai`, `@team-security` |
| `*` | `@coderabbitai` |

## ⚠️ Common Issues & Quick Fixes
| Error | Fix |
| --- | --- |
| Build Timeout | Run `npm run build` locally first |
| File Size Error | Compress assets or host externally |
| Rate Limit | Reduce deploys or upgrade Vercel plan |
| CI/CD Fail | Check `Actions` tab, remove unused jobs in workflow |

---

## ✅ Reviewer Checklist - Copy This to PR Comment

### **Part 1: CrystalCastle-Specific Checks - Must Verify**
<!-- For any PR that touches deploy, API, or AI logic -->
- [ ] **Failover tested:** Simulate Groq down → Gemini → OpenAI responds correctly
- [ ] **Cache valid:** TTL 60s enforced, no stale data after `POST/PUT`
- [ ] **Logs visible:** Severity matrix + request ID shows in Vercel logs
- [ ] **Cost tracking on:** Token usage per provider logged to analytics
- [ ] **Bilingual:** All user-facing strings have EN/TH keys

### **Part 2: General PR Quality Checklist**
<!-- Use for all PRs -->

#### 🔹 Governance
- [ ] **Description ครบ:** Purpose / Changes / Impact / Testing / `Closes #issue`
- [ ] **Linked Issue:** มี `Closes #123` หรือ `Relates to #123`
- [ ] **Reviewer ถูก:** Auto-assigned ตรงตาม `CODEOWNERS`

#### 🔹 Repo Hygiene  
- [ ] **Path ถูก:** ไฟล์ใหม่อยู่ใน `lib/`, `docs/`, `tests/` ฯลฯ ตามหน้าที่
- [ ] **ไม่มีไฟล์ต้องห้าม:** ห้าม commit `.env`, `.env.local`, `package-lock.json`, `node_modules`, `*.tgz`
- [ ] **Docs อัปเดต:** Feature ใหม่ต้องแก้ `README.md` หรือ `docs/guide/`

#### 🔹 Code Quality
- [ ] **อ่านง่าย:** ชื่อตัวแปร/ฟังก์ชันสื่อความหมาย, ไม่มี magic numbers
- [ ] **No secrets:** ไม่มี API key, token, connection string hard-coded
- [ ] **Lint ผ่าน:** `npm run lint && npm run typecheck` ไม่มี error

#### 🔹 Testing
- [ ] **มี Test:** ไฟล์ใหม่ต้องมี `*.test.ts` หรือ `*.spec.ts` คู่กัน, coverage ไม่ลด
- [ ] **CI เขียว:** Unit + Integration tests ใน Actions ผ่านหมด
- [ ] **Manual เทส:** Reviewer รันบน local ผ่านตาม `How to Test` ใน PR

#### 🔹 CI/CD & Deploy
- [ ] **Workflows เขียว:** `ci.yml`, `security-scan.yml`, `ai-validation.yml` ผ่าน
- [ ] **Vercel Deploy:** Preview deploy สำเร็จ, ไม่มี runtime error
- [ ] **Artifact Check:** Build size < 50MB, `.vercelignore` ทำงานถูกต้อง

---

### **TH สรุปสำหรับ Reviewer - ทำ 4 ข้อนี้ก่อน Merge**
1. **ตรวจ Part 1:** Failover, Cache, Logs, Cost, EN/TH ถ้า PR เกี่ยวกับระบบหลัก
2. **Deploy ถูกวิธี:** ใช้ `vercel deploy --prod --archive=tgz` เท่านั้น
3. **ไฟล์ห้ามหลุด:** เช็ค `.vercelignore` ว่า exclude `tiktok*`, `task.md`, `vitest.config.js` แล้ว
4. **Workflow Active:** ใช้แค่ใน Active list, นอกนั้นอยู่ใน `notuse/` ห้ามรัน

### ✅ **Merge Rules**
1. CI/CD เขียวทั้งหมด
2. Approve ขั้นต่ำ 1 คนจาก reviewer ที่ auto-assign
3. ถ้าไฟล์อยู่ใน `CODEOWNERS` → ต้องได้ approve จาก code owner path นั้น
4. ครบ 1-3 → Squash and merge

> **Placement Tip:** แปะไฟล์นี้ไว้ที่ `.github/REVIEWER_GUIDE.md` และลิงก์จาก `CONTRIBUTING.md` + แปะส่วน Deploy Essentials ไว้ใต้ H1 ของ `README.md`
