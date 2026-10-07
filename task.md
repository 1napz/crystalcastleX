Here's a complete, production-ready  task.md  designed for your ZyntroAI/new-crystalcastle workflow — structured for Obsidian, with clear status tracking, checkpoints, and CLI integration.
 
 
 
markdown  
---
title: Task Tracker — new-crystalcastle
aliases:
  - Tasks
  - Project Tasks
created: 2026-10-04
updated: 2026-10-04
repo: ZyntroAI/new-crystalcastle
tags:
  - task
  - workflow
  - zyntroai
  - new-crystalcastle
  - devops
status: active
version: 1.0
---

# 📋 Task Board — ZyntroAI/new-crystalcastle

## 📊 Overview
- **Repository**: `https://github.com/ZyntroAI/new-crystalcastle`
- **Current Sprint**: 2026-W40
- **Total Tasks**: `=length(this.file.tasks)`
- **Completed**: `=filter(this.file.tasks, (t) => t.status = "✅ Done").length`
- **In Progress**: `=filter(this.file.tasks, (t) => t.status = "🔄 In Progress").length`
- **Blocked**: `=filter(this.file.tasks, (t) => t.status = "⛔ Blocked").length`

---

## 🔄 Task Status Legend
| Status | Meaning |
|---|---|
| ⬜ Ready | ยังไม่เริ่ม |
| 🔄 In Progress | กำลังดำเนินการ |
| ⏳ Paused | หยุดชั่วคราว / รอข้อมูล |
| ⛔ Blocked | ติดปัญหา / รอผู้อื่น |
| 👀 Review | รอตรวจสอบ / PR เปิดแล้ว |
| ✅ Done | เสร็จสิ้น / รวมเข้าโค้ดแล้ว |
| ❌ Cancelled | ยกเลิก |

---

## 📝 Tasks

### T-001 — Setup GitHub API Data Fetcher
- **Status**: ✅ Done
- **Assignee**: @me
- **Priority**: 🔴 High
- **Created**: 2026-10-04
- **Updated**: 2026-10-04
- **Related**: `fetch_releases.py`
- **Checkpoint**: `ZyntroAI_new-crystalcastle_checkpoint.json`
- **Output**: `ZyntroAI_new-crystalcastle_releases.ndjson`
- **Description**: Build resumable script to pull releases with rate-limit handling & deduplication
- **Steps**:
  - [x] Configure `OWNER=ZyntroAI`, `REPO=new-crystalcastle`
  - [x] Implement checkpoint/resume from `next_url`
  - [x] Add rate-limit backoff (`429`/`retry-after`)
  - [x] Deduplicate by `release.id`
  - [x] Atomic save + `fsync` for durability
  - [x] Test resume after interruption
- **Notes**: Token via `$GITHUB_TOKEN`; `PER_PAGE=100` minimizes requests

### T-002 — PR Management CLI Guide
- **Status**: ✅ Done
- **Assignee**: @me
- **Priority**: 🟡 Medium
- **Created**: 2026-10-04
- **Related**: `GitHub-PR-CLI-new-crystalcastle.md`
- **Description**: Document `gh pr` workflow for the team
- **Steps**:
  - [x] Installation & auth
  - [x] Create / list / view / checkout PR
  - [x] Review / approve / merge (merge/squash/rebase)
  - [x] Obsidian template + Templater script
  - [x] Conventional Commits reference
- **Notes**: Follow `.Conventional_Commits.md`; CI runs via `ci.yml`

### T-003 — Pull Releases & Build Local Index
- **Status**: 🔄 In Progress
- **Assignee**: @me
- **Priority**: 🔴 High
- **Created**: 2026-10-04
- **Depends On**: T-001
- **Description**: Run full fetch + import into Obsidian
- **Steps**:
  - [ ] Set `GITHUB_TOKEN` environment variable
  - [ ] `python fetch_releases.py` → complete sync
  - [ ] Verify record count matches checkpoint
  - [ ] Build Dataview index from NDJSON
  - [ ] Add ETag refresh logic for next run
- **Command**:
  ```bash
  export GITHUB_TOKEN="ghp_xxx"
  python fetch_releases.py
 
 
T-004 — Add PR & Issue Fetchers
 
- Status: ⬜ Ready
- Assignee: @me
- Priority: 🟡 Medium
- Created: 2026-10-04
- Depends On: T-001
- Description: Extend script to pull PRs & issues
- Endpoints:
-  /repos/{owner}/{repo}/pulls?state=all 
-  /repos/{owner}/{repo}/issues?state=all 
- Steps:
Add  fetch_prs.py  — same checkpoint pattern
Add  fetch_issues.py 
Link PR ↔ Issue via  #number  references
Build unified dashboard in Obsidian
 
T-005 — Automate Daily Sync
 
- Status: ⬜ Ready
- Assignee: @me
- Priority: 🟢 Low
- Created: 2026-10-04
- Depends On: T-003
- Description: Scheduled refresh + vault update
- Steps:
Create cron/GitHub Action workflow
Push updated NDJSON + checkpoint to repo
Send summary notification on completion
Auto-open PR if new data detected
 
T-006 — CI/CD Status Dashboard
 
- Status: ⬜ Ready
- Assignee: @me
- Priority: 🟡 Medium
- Created: 2026-10-04
- Description: Surface workflow statuses
- Steps:
Fetch workflow runs from  /actions/runs 
Track  ci.yml ,  Python-CI.yml ,  FastAPI_CI.yaml 
Dataview table: Last run / Status / Branch / Trigger
Flag failures > 24h old
 
 
 
📌 Checkpoints & Resume Log
 
Task Checkpoint File Last Saved Next URL Status 
T-001  ZyntroAI_new-crystalcastle_checkpoint.json  2026-10-04T18:xx:xxZ — ✅ Complete 
T-003 (reuses T-001 checkpoint) — (resume from saved next_url) 🔄 Running 
 
Resume Command:  python fetch_releases.py  — no extra args needed
 
 
 
⚠️ Blockers & Risks
 
Rate Limits: Authenticated = 5,000 req/hour; unauthenticated = 60 req/hour → always use token
Token Expiry: Rotate  GITHUB_TOKEN  before expiration; store securely
Duplicate Data: Never remove  release.id  deduplication; use  INSERT OR IGNORE  if moving to SQLite
Partial Writes: Don't skip  fsync()  or atomic replace — crash-safe design depends on it
 
 
 
📎 Related Files
 
-  fetch_releases.py  — Resumable release fetcher
-  GitHub-PR-CLI-new-crystalcastle.md  — PR workflow guide
-  ZyntroAI_new-crystalcastle_releases.ndjson  — Data store
-  ZyntroAI_new-crystalcastle_checkpoint.json  — Resume state
-  Templates/PR-Log-Template.md  — Templater template
 
 
 
💡 Quick Commands
 
bash  
# Resume/re-run release sync
python fetch_releases.py

# Check rate limit
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit

# List open PRs
gh pr list --repo ZyntroAI/new-crystalcastle

# Check CI status
gh pr checks --repo ZyntroAI/new-crystalcastle
 
 
 
 
Last updated:  =date(today) 
 
plaintext  

---

### 📌 How to use
1. Copy → save as `task.md` in your SKILLS vault
2. Update **Status** as you progress: change `🔄 In Progress` → `✅ Done` when finished
3. For **T-003**, paste your actual token command once you have it
4. Dataview will auto-update counts if you have the plugin enabled; if not, just update manually

### ✨ Key features
- **Obsidian-native**: YAML frontmatter, internal links, clean formatting
- **Resume-aware**: explicitly tracks checkpoints from your script
- **Priority tiering**: High/Medium/Low keeps focus clear
- **Dependency mapping**: see what blocks what
- **Ready to extend**: just duplicate the task block for new items (T-007, T-008...)

Want me to add **Dataview queries** to auto-generate the task board at the top, or turn this into a **Templater template** so you can create new tasks with one click? 😊