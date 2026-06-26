<div align="center">

# ✦ Crystal Castle

**Turn product images into AI-generated videos with cinematic crystal aesthetics.**
Built for social commerce — TikTok · Shopee · Reels · Threads

[![CI](https://github.com/1napz/crystalcastle/actions/workflows/ci.yml/badge.svg)](https://github.com/1napz/crystalcastle/actions)
[![AI Pipeline](https://github.com/1napz/crystalcastle/actions/workflows/ai_pipeline.yml/badge.svg)](https://github.com/1napz/crystalcastle/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/state-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://python.org)

</div>

---

## 🎯 What is Crystal Castle?

Crystal Castle is an **AI-powered social commerce automation system** for fashion content creators and Shopee Affiliates.

It handles the full pipeline — from **product image input** to **ready-to-post video content** — with automated link monitoring, status alerts, and multi-platform distribution.

```
Product Image  →  AI Video Generation  →  Caption + Link  →  Post to Platform
     ↓                                          ↓
Shopee Affiliate URL            Supabase State + Line Notify Alert
```

---

## ⚡ Core Features

| Feature | Description |
|---------|-------------|
| 🎬 **AI Video Pipeline** | แปลง product image → cinematic short video (9:16) |
| 🔗 **Affiliate Link Monitor** | ตรวจสอบ Shopee links แบบ real-time ผ่าน Supabase |
| 📲 **Line Notify Alerts** | แจ้งเตือนทันทีเมื่อ link down หรือ campaign หมดอายุ |
| 🤖 **Auto Caption Gen** | สร้าง caption สไตล์ Streetwear/Retro ด้วย Groq AI |
| 🚀 **GitHub Actions CI/CD** | Deploy อัตโนมัติทุก push to `main` |
| 🌐 **Link-in-Bio Page** | Hosted บน GitHub Pages — zero cost |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│               Crystal Castle                │
│                                             │
│  GitHub Pages        GitHub Actions         │
│  (link-in-bio)  ←──  (CI/CD + scheduler)   │
│                            │                │
│              ┌─────────────┼──────────┐     │
│              ▼             ▼          ▼     │
│         Supabase      Line Notify   Groq    │
│        (state DB)      (alerts)   (AI gen)  │
└─────────────────────────────────────────────┘
```

**Stack:**
- **Hosting:** GitHub Pages
- **Automation:** GitHub Actions + Python 3.11
- **State / DB:** Supabase (Postgres)
- **Alerts:** Line Notify
- **AI Generation:** Groq · Meta AI
- **Security:** GitHub Secrets (no hardcoded keys)

---

## 📁 Project Structure

```
crystalcastle/
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # Lint + test on PR
│       ├── monitor.yml          # Scheduled link health check
│       └── ai_pipeline.yml      # AI content generation
│
├── src/
│   ├── supabase_store.py        # State persistence layer
│   ├── monitor.py               # Affiliate link monitor loop
│   └── notify.py                # Line Notify dispatcher
│
├── docs/
│   └── logs/
│       └── index.md             # Knowledge Log Hub
│
├── main_script.py               # Entry point
├── requirements.txt
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
pip install -r requirements.txt
```

### 2. Set GitHub Secrets

| Secret | Description |
|--------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase service role key |
| `LINE_NOTIFY_TOKEN` | Line Notify token |
| `GROQ_API_KEY` | Groq API key |

### 3. Init Supabase Tables

```bash
# รัน SQL ใน Supabase SQL Editor
# ดู schema ได้ที่ docs/logs/index.md → Affiliate Links section
```

### 4. Run

```bash
python main_script.py
```

---

## 🎨 Content Strategy

**Brand Aesthetics:** `Streetwear` · `Retro`

| Platform | Format | Ratio |
|----------|--------|-------|
| ShopeeVideo | Short video | 9:16 |
| Line | Image + link | 1:1 |
| X | Image thread | 16:9 |
| Threads | Carousel | 1:1 |

> Caption style: **Punchy · Minimalist · Trend-forward**

---

## 📚 Documentation

- [Knowledge Log Hub](docs/logs/index.md) — Team log, decisions, and system notes
- [Automation Guide](docs/logs/index.md#automation) — Script rules & workflow
- [Content Strategy](docs/logs/index.md#content-strategy) — Prompt templates & platform guide

---

## 🤝 Team

| Role | Responsibility |
|------|---------------|
| Lead Technical Architect | Python automation, CI/CD, Supabase |
| Creative Director | Fashion content, AI prompts, captions |

---

## 📄 License

MIT © [1napz](https://github.com/1napz) · Crystal Castle Team

---

<div align="center">

*Built with ✦ by Crystal Castle — Where fashion meets automation.*

</div>
