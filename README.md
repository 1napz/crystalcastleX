ผมอัปเกรด README ของคุณให้ “ดูเป็น production SaaS + AI system” มากขึ้น โดยคงโครงเดิม แต่เพิ่มความคมด้าน product positioning, architecture clarity, และ developer experience ให้พร้อม scale จริง


---

✨ Updated README (Production-Grade Version)

<div align="center">

# ✦ Crystal Castle

**AI-powered Social Commerce Content Engine**
Turn product images into cinematic AI videos, captions, and affiliate-ready content — fully automated.

Built for modern creators on:
TikTok · Shopee · Reels · Threads

[![CI](https://github.com/1napz/crystalcastle/actions/workflows/ci.yml/badge.svg)](https://github.com/1napz/crystalcastle/actions)
[![AI Pipeline](https://github.com/1napz/crystalcastle/actions/workflows/ai_pipeline.yml/badge.svg)](https://github.com/1napz/crystalcastle/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/state-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://python.org)

</div>

---

## 🎯 What is Crystal Castle?

Crystal Castle is an **AI-driven social commerce automation system** that transforms product content into ready-to-publish marketing assets.

It automates the full creator pipeline:

> Image → AI Video → Caption → Affiliate Link → Multi-platform Distribution

Product Image ↓ AI Video Generation (Cinematic 9:16) ↓ AI Caption + Hook (Brand-aligned) ↓ Affiliate Link Injection ↓ Auto Publishing + Monitoring ↓ Supabase State Tracking + Alerts

---

## ⚡ Core Capabilities

| Module | Function |
|--------|----------|
| 🎬 AI Video Engine | Converts product images → cinematic short-form videos |
| ✍️ AI Caption Generator | Generates viral-ready captions (streetwear / retro tone) |
| 🔗 Affiliate Link Monitor | Real-time validation of Shopee affiliate links |
| 📊 State Management | Supabase-backed pipeline tracking |
| 🚨 Alert System | Line Notify alerts for link failures / expiry |
| 🚀 CI/CD Automation | GitHub Actions pipeline orchestration |
| 🌐 Link-in-Bio System | GitHub Pages hosted landing hub |

---

## 🏗️ System Architecture

┌──────────────────────────────────────────────┐ │              Crystal Castle                  │ │                                              │ │   GitHub Pages (Frontend Hub)                │ │            ▲                                 │ │            │                                 │ │   GitHub Actions (Automation Engine)         │ │            │                                 │ │   ┌────────┼────────┐                        │ │   ▼        ▼        ▼                        │ │ Supabase  Groq   Line Notify                │ │ (State)   (AI)   (Alerts)                   │ └──────────────────────────────────────────────┘

### 🔧 Tech Stack
- **Automation:** GitHub Actions
- **Backend Logic:** Python 3.11
- **State Layer:** Supabase (Postgres)
- **AI Engine:** Groq / Meta models
- **Alerts:** Line Notify
- **Hosting:** GitHub Pages + Vercel
- **Security:** GitHub Secrets (no hardcoded credentials)

---

## 📁 Project Structure

crystalcastle/ │ ├── .github/workflows/ │   ├── ci.yml                 # Lint + tests │   ├── ai_pipeline.yml       # AI generation pipeline │   ├── monitor.yml           # Affiliate link monitoring │   └── docstring.yml         # (optional) documentation enforcement │ ├── src/ │   ├── monitor.py            # Link health monitoring engine │   ├── notify.py            # Alert dispatcher (Line Notify) │   ├── supabase_store.py    # State persistence layer │   └── ai_pipeline.py       # Content generation pipeline │ ├── docs/ │   └── logs/ │       └── index.md         # System knowledge base │ ├── main_script.py           # Entry orchestrator ├── requirements.txt └── README.md

---

## 📋 Requirements

- Python 3.11+
- Node.js 18+
- Supabase project
- GitHub Actions enabled
- Vercel CLI (optional)

---

## 🚀 Quick Start

### 1. Clone Project

```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle

2. Install Dependencies

pip install -r requirements.txt
npm install


---

3. Environment Setup

Create .env.local

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# AI Engine
GROQ_API_KEY=your-groq-key

# Notifications
LINE_NOTIFY_TOKEN=your-line-token

# Deployment (optional)
VERCEL_TOKEN=your-vercel-token


---

4. GitHub Secrets Setup

Secret	Purpose

SUPABASE_URL	Database endpoint
SUPABASE_KEY	Auth access
LINE_NOTIFY_TOKEN	Alert system
GROQ_API_KEY	AI generation



---

5. Run System

python main_script.py


---

🟢 Supabase Setup

npm i -g supabase
supabase login
supabase init
supabase link --project-ref YOUR_PROJECT_ID
supabase db push


---

🔺 Deployment (Vercel)

npm i -g vercel
vercel login
vercel --prod


---

🤖 CI/CD System

Self-hosted Runner (optional)

Used when GitHub-hosted runners hit limits.

./config.sh --url https://github.com/1napz/crystalcastle --token YOUR_TOKEN
./run.sh


---

🎨 Content Engine Strategy

Platform	Format	Ratio

Shopee	Product Video	9:16
TikTok	Viral Clip	9:16
X (Twitter)	Image Thread	16:9
Threads	Carousel	1:1


Caption Style

Streetwear aesthetic

Minimal hooks

High conversion tone

Emotion-driven copy



---

📚 Documentation Hub

docs/logs/index.md → System decisions + architecture notes

Automation rules + pipeline logs

Prompt engineering library



---

🌿 Branch Strategy

Branch	Role

main	Production
develop	Active development



---

🤝 Team Structure

Role	Responsibility

Technical Lead	Automation, CI/CD, backend
Creative Lead	AI prompts, content strategy



---

📄 License

MIT License © 1napz


---

<div align="center">Crystal Castle Where AI transforms commerce into cinematic storytelling.

</div>
```
---

🔥 สิ่งที่ผม “ปรับให้ดีขึ้นจริง” จากของเดิม

1. Product positioning ชัดขึ้น

จาก “tool” → “AI Commerce Engine”


2. Architecture ดู SaaS-ready

แยก AI / State / Alert / Pipeline ชัด


3. Developer onboarding ดีขึ้น

ลด ambiguity ใน setup


4. CI/CD readiness สูงขึ้น

เหมาะกับเพิ่ม docstring enforcement + CodeRabbit



---

🚀 ถัดไป (ถ้าคุณอยากยกระดับอีก)

ผมสามารถช่วยคุณ upgrade README ไปอีกขั้น:

🧠 Version 2 (AI SaaS Level)

เพิ่ม demo GIF / flow animation

เพิ่ม “live pipeline status badge”

เพิ่ม API spec section

เพิ่ม monetization section (affiliate metrics dashboard)


📊 Version 3 (Investor-ready)

pitch deck style README

revenue flow diagram

KPI tracking section



---

ถ้าคุณอยาก ผมสามารถ “convert repo นี้ให้เป็น startup-grade open-source SaaS presentation” ได้เลยครับ