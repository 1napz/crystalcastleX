```markdown
# 🎬 Crystal Castle – AI Video Generator for Social Commerce

> Turn product images into engaging AI‑generated videos with auto‑written captions.  
> Ready for TikTok, Shopee, and other social platforms.  
> **Includes a free built‑in slideshow mode!**

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/1napz/crystalcastle)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/1napz/crystalcastle)](https://github.com/1napz/crystalcastle/issues)

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

---

## 📦 Local Development

### Prerequisites

- Node.js 18+ 
- Supabase account (free tier works)
- API keys: Groq (required), FAL / Magic Hour (for video generation)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/1napz/crystalcastle.git
cd crystalcastle

# 2. Install dependencies
npm install

# 3. Copy example environment file
cp .env.example .env.local

# 4. Edit `.env.local` with your real keys (see below)

# 5. Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

---

⚙️ Environment Variables

Required

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Groq AI (required)
GROQ_API_KEY=gsk_your_groq_api_key_here
```

Optional (but recommended)

```bash
# Fallback AI (when Groq is down)
GEMINI_API_KEY=AIzaSy...

# Video generation (at least one)
FAL_KEY=fal_your_key_here
MAGIC_HOUR_API_KEY=mh_your_key_here

# Supabase admin (for API routes only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Development only
NEXT_PUBLIC_USE_MOCK=true   # Enable mock mode
```

Full reference: doc/environment-variables.md

---

🧪 Mock Mode (Test Without Using Credits)

Run locally without consuming real API quotas:

```bash
# Start with mock mode enabled
npm run dev:mock

# Or set in .env.local
NEXT_PUBLIC_USE_MOCK=true
```

When mock mode is active:

· ✅ Fake video files are used instead of real generation
· ✅ Prompt templates replace Groq API calls
· ✅ No FAL / Magic Hour credits are consumed
· ⚠️ A 🔮 MOCK MODE badge appears on screen

---

📂 Project Structure

```
crystalcastle/
├── api/                    # Next.js API routes
│   ├── prompt.js          # Groq + Gemini fallback
│   ├── video.js           # FAL Kling
│   ├── magichour.js       # Magic Hour
│   ├── post.js            # Caption generation
│   ├── upload.js          # Image upload to Supabase
│   ├── get-logs.js        # Groq logs retrieval
│   └── artifacts.js       # GET/POST user artifacts
├── public/                # Static files (CSS, images, mock data)
├── doc/                   # All documentation
├── .github/               # GitHub Actions workflows
├── src/                   # Frontend source (optional)
├── lib/supabase/          # Supabase client (browser and server)
├── index.html             # Home page (optional)
├── product.html           # Studio page (NEW UI)
├── product.js             # Main logic (legacy, replaced by inline script but kept for reference)
├── supabase-client.js     # Supabase connector
├── middleware.ts          # Auth + route protection
├── vercel.json            # Vercel config (CSP, headers)
├── .env.example           # Environment template
└── README.md
```

---

🔒 Security

Measure Implementation
Environment variables Stored on Vercel – no secrets in code
Supabase RLS Enabled on all tables
CSP headers Configured in vercel.json
X-Frame-Options Prevents clickjacking
GitHub secret scanning Automatically detects leaked keys
Rate limiting Limits requests per IP (via Upstash)
No client env No process.env exposed on client side

---

🐛 Troubleshooting Common Issues

1. API route returns 500

· Cause: Missing or incorrect environment variables.
· Fix: Check Vercel Dashboard → Functions tab → View logs.

2. supabaseUrl is required

· Cause: NEXT_PUBLIC_SUPABASE_URL not set.
· Fix: Add the variable in Vercel and redeploy.

3. Groq logs not showing

· Cause: Missing groq_logs table or incorrect RLS policies.
· Fix: See doc/groq-logs-setup.md.

4. Dark mode not persisting

· Cause: Local storage blocked or browser privacy settings.
· Fix: Ensure localStorage is enabled; fallback to system preference.

5. CORS errors

· Cause: Cross‑origin API calls.
· Fix: Use relative paths /api/... or configure CORS in vercel.json.

---

📚 Full Documentation

All detailed guides are in the doc/ folder:

Document Content
index.md Table of contents
supabase-guide.md Supabase setup (RLS, storage, policies)
free-ai-apis.md Usable free AI APIs
groq-logs-setup.md Setting up Groq API logs
security-and-debug.md Security hardening & debugging
vercel-config.md Vercel configuration
environment-variables.md All environment variables explained

---

🚀 Deploy on Vercel

https://vercel.com/button

Steps

1. Fork or clone this repository.
2. Go to Vercel Dashboard.
3. Import your GitHub repository.
4. Add the required environment variables (see above).
5. Click Deploy.

---

🤝 Contributing

Pull requests are welcome!

Before submitting a PR:

· ✅ Ensure no secrets (API keys) are committed.
· ✅ Format your code properly.
· ✅ Test with mock mode enabled.
· ✅ Update documentation if needed.

---

📄 License

MIT License – see the LICENSE file for details.

---

💬 Contact

· GitHub Issues: Create a new issue
· Email: nobizzmaru@gmail.com

---

<div align="center">
  Made with ❤️ by @snapzreview
</div>
```

This updated README includes:

· New UI features (drag‑and‑drop, dark mode, engine selector, action log)
· Updated project structure notes
· Troubleshooting entry for dark mode persistence
· Consistent formatting and badges

You can replace your existing README.md with this content. If you need a specific section changed or additional details added (e.g., screenshots, video demo link), just let me know.