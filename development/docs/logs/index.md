# CrystalCastle Knowledge Log Hub

> ฐานความรู้กลางของทีม Crystal Castle — รวม log สำคัญทุกด้านของโปรเจกต์
> Central knowledge base for the Crystal Castle team.

---

## 📋 Purpose

This hub collects important log entries that serve as knowledge for the team.
(รวม log สำคัญที่ใช้เป็นฐานความรู้สำหรับทีม)

การ log ที่ดีช่วยให้ทีมสามารถ:
- ย้อนดูการตัดสินใจที่ผ่านมาได้
- Onboard สมาชิกใหม่ได้เร็วขึ้น
- Debug ปัญหาซ้ำๆ ได้โดยไม่ต้องเริ่มใหม่

---

## 🗂️ Categories

- **[Automation](#automation)** — Python scripts, GitHub Actions workflows
- **[Affiliate Links](#affiliate-links)** — Supabase state, link monitoring, response handling
- **[Content Strategy](#content-strategy)** — Captions, image/video prompts, platform notes
- **[Infrastructure](#infrastructure)** — GitHub Pages, Secrets, CI/CD pipeline
- **[Integrations](#integrations)** — Line Notify, Groq, Meta AI, Supabase
- **[Ignore File Changes](#ignore-file-changes)** — Files excluded from auto-tracking

---

## ⚙️ Automation

| Date | Entry | File | Notes |
|------|-------|------|-------|
| - | Initial automation scaffold | `main_script.py` | Entry point for all tasks |
| - | Supabase store module | `src/supabase_store.py` | Replaces Upstash Redis |
| - | Monitor loop | `src/monitor.py` | Pings affiliate links, updates status |
| - | Line Notify sender | `src/notify.py` | Sends alerts on link down |

**Key Rules:**
- ทุก secret ต้องผ่าน **GitHub Secrets** เท่านั้น — ห้าม hardcode
- Script ทุกตัวต้องมี `try/except` ครอบ HTTP calls
- Response code ที่ไม่ใช่ `200` ถือว่า link `down` ทันที

---

## 🔗 Affiliate Links

**State Layer:** Supabase `affiliate_links` table (แทน Redis)

| Field | Type | Description |
|-------|------|-------------|
| `slug` | text | Unique identifier เช่น `retro-polo-001` |
| `url` | text | Shopee affiliate URL เต็ม |
| `status` | text | `active` / `down` / `expired` |
| `last_checked` | timestamptz | เวลา ping ล่าสุด |
| `last_status_code` | int | HTTP response code |
| `metadata` | jsonb | platform, category, campaign |

**Monitor Log:** Supabase `link_monitor_log` table
- เก็บ history ทุก ping — ไม่มี TTL หายเหมือน Redis
- ใช้ดู pattern ว่า link ไหน down บ่อย

---

## 🎨 Content Strategy

**Brand Voice:** Trendy · Minimalist · Authoritative

**Target Aesthetics:**
- `#Streetwear` — Clean, oversized, monochrome-forward
- `#Retro` — Vintage palette, grain texture, nostalgic typography

**Platform Guidelines:**

| Platform | Format | Caption Style | Aspect Ratio |
|----------|--------|---------------|--------------|
| ShopeeVideo | Short video | Hook ใน 3 วินาทีแรก | 9:16 |
| Line | Image + link | กระชับ, มี CTA ชัด | 1:1 |
| X (Twitter) | Image thread | Punchy, ใช้ hashtag 2-3 ตัว | 16:9 |
| Threads | Carousel | Storytelling, aesthetic-first | 1:1 |

**Prompt Template (Groq/Meta AI):**
```
[Style]: Photorealistic fashion editorial
[Subject]: [item description]
[Aesthetic]: Streetwear / Retro
[Lighting]: Soft natural / Studio dramatic
[Ratio]: 9:16 vertical
[Mood]: [mood keyword]
```

---

## 🏗️ Infrastructure

**Stack Overview:**

```
GitHub Repo
├── GitHub Pages          → Link-in-bio hosting
├── GitHub Actions        → CI/CD + scheduled monitor
├── GitHub Secrets        → All API keys & tokens
└── src/
    ├── supabase_store.py → State persistence
    ├── monitor.py        → Link health check loop
    └── notify.py         → Line Notify dispatcher
```

**Deployment Rules:**
- `main` branch = production เสมอ
- ทุก workflow ต้อง pass ก่อน merge
- GitHub Pages deploy อัตโนมัติเมื่อ push to `main`

---

## 🔌 Integrations

| Service | Purpose | Auth Method |
|---------|---------|-------------|
| **Supabase** | State DB + monitor log | `SUPABASE_URL` + `SUPABASE_KEY` via Secrets |
| **Line Notify** | Alert เมื่อ link down | `LINE_NOTIFY_TOKEN` via Secrets |
| **Groq** | AI asset generation | `GROQ_API_KEY` via Secrets |
| **Meta AI** | Image/video prompts | API key via Secrets |
| **GitHub Actions** | Scheduled automation | Built-in `GITHUB_TOKEN` |

---

## 🚫 Ignore File Changes

ไฟล์เหล่านี้ถูก exclude จาก auto-tracking เนื่องจาก generate อัตโนมัติหรือ sensitive:

```
.env
*.log
__pycache__/
.DS_Store
node_modules/
dist/
```

> หากต้องการเพิ่ม/ลบ ให้แก้ที่ `.gitignore` และ update section นี้ด้วย

---

## 📝 How to Log

เมื่อมีการเปลี่ยนแปลงสำคัญ ให้เพิ่ม entry ในตาราง category ที่เกี่ยวข้อง:

```markdown
| 2026-05-13 | [สิ่งที่เปลี่ยน] | `file/path.py` | [หมายเหตุสั้นๆ] |
```

---

*Last updated: 2026-05-13 | Maintained by Crystal Castle Team*
