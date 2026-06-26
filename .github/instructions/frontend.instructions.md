# 🎨 Frontend Instructions — CrystalCastle

## 🧠 Scope
Applies to all UI, pages, and client-side interactions.

---

## ⚙️ Stack
- Next.js App Router
- React (Server + Client Components)
- TailwindCSS

---

## 🧩 Component Rules
- Use Server Components by default
- Add `"use client"` only when:
  - using state
  - handling events
  - using browser APIs

- Keep components < 200 lines
- Extract reusable UI into `/components`

---

## 📱 UI/UX Principles
- Mobile-first (TikTok-style layout)
- Clean, minimal, high contrast
- Fast interaction (no lag)

---

## ⏳ State Handling
Must handle:
- loading (skeleton/spinner)
- error (friendly message)
- empty state

---

## ⚡ Performance
- Use `next/image` for images
- Lazy load heavy components
- Avoid unnecessary re-renders

---

## 🔗 Data Fetching
- Prefer Server Actions
- Avoid client fetch unless necessary
- Cache where possible

---

## 🎬 Feature: Video Preview UI
- Show:
  - thumbnail
  - caption preview
  - status (processing/done)
- Include:
  - play button
  - download button

---

## 🚫 Avoid
- Inline CSS
- Large UI libraries
- Overusing client components

---

## ✅ Output Expectations
- Clean JSX
- Accessible (aria when needed)
- Responsive on mobile