`markdown
🎬 Crystal Castle – AI Video Generator for Social Commerce

> Turn product images into engaging AI‑generated videos with auto‑written captions.  
> Ready for TikTok, Shopee, and other social platforms.  
> Includes a free built‑in slideshow mode!

![Vercel Deploy](https://vercel.com/new/clone?repository-url=https://github.com/1napz/crystalcastle)
![License: MIT](https://opensource.org/licenses/MIT)
![GitHub issues](https://github.com/1napz/crystalcastle/issues)
![Privacy Check](./setup-config/privacy.yml)
![Security Scan](./.github/workflows/security-scan.yml)

---

## ✨ Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🖼️ Product image upload | ✅ Done | Drag & drop, up to 10 images, max 6MB each |
| 🤖 AI prompt generation | ✅ Live | Groq (Llama 3.3 70B) + Gemini fallback |
| 📝 AI caption generation | ✅ Live | Thai/English captions + hashtags automatically |
| 🎬 Video generation | ✅ Live | FAL Kling / Magic Hour (selectable) |
| 🎞️ Free slideshow | ✅ Live | Instant non‑AI video from uploaded images |
| 📱 Mobile responsive | ✅ Done | Modern Tailwind CSS + dark mode |
| 📊 Groq usage logs | ✅ New | Real‑time AI call logs |
| 🔄 Automatic fallback | ✅ New | Groq fails → Gemini takes over |
| 🔒 Security hardening | ✅ Done | CSP headers, RLS, rate limiting |
| 🏷️ Branding | ✅ | `@snapzreview` across the app |
| 🌙 Dark mode | ✅ New | User preference + system detection |
| 🎨 Modern UI | ✅ New | Two‑column layout, engine card selector, action log |

---

## 🛠️ Tech Stack

| Area | Technology |
|------|-------------|
| **Frontend** | HTML5 + Tailwind CSS + Vanilla JS (no framework) |
| **Backend** | Next.js API Routes (serverless on Vercel) |
| **Database & Storage** | Supabase (PostgreSQL + Storage) |
| **AI Models** | Groq (Llama 3.3), Gemini (fallback), FAL Kling, Magic Hour |
| **Deployment** | Vercel (CI/CD from GitHub) |

---

## 📸 UI Preview

- **Two‑column desktop layout** – controls on left, preview & output on right.
- **Drag & drop upload zone** – visual feedback, image counter.
- **Radio card engine selector** – FAL Kling vs Magic Hour with descriptions.
- **Live action log** – timestamped status messages.
- **Dark mode toggle** – persistent across sessions.

# CrystalCastle 🏰

## Overview
CrystalCastle is a modern workflow and subscription-enabled platform built with Supabase, Stripe, and Next.js.  
It provides CI/CD automation, onboarding documentation, and reviewer training materials.

---

## Features
- 🔐 Authentication with Supabase
- 💳 Subscription system (Stripe + Supabase)
- ⚙️ CI/CD workflows with GitHub Actions
- 📚 Onboarding docs & reviewer training quizzes
- 🌐 Multi-language support (Thai/English)

---

## Getting Started
### Prerequisites
- Node.js >= 18
- Supabase project
- Stripe account
- Vercel (for deployment)

### Installation
```bash
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle
npm install
