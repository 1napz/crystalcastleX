# Changelog

## [1.5.0] - 2026-04-26

### Added
- Dropdown to select AI Video Engine (FAL, Runway, Pika, Nexa, WaveSpeed) in the UI
- API endpoint `/api/generate-video` to support multiple video engines
- Security Headers (CSP, X-Frame-Options, Permissions-Policy)
- Workflow `fix-package-lock.yml` to auto-repair lockfile
- Documentation: `SECURITY.md`, `copilot-instructions.md`
- Slideshow, Intro, CTA, and Thumbnail generators
- Groq Logs displayed in `index.html`
- Fallback AI system (Groq → Gemini)

### Changed
- Updated `product.html`: replaced Kling/Magic buttons with dropdown selector
- Updated `product.js` to handle engine selection logic
- Rebranded project to `@snapzreview`
- Improved `vercel.json` with `maxDuration` setting

### Fixed
- Resolved Vercel build failure (reduced serverless functions to ≤12)
- Removed annoying price/discount popups

## [1.4.0] - Earlier
- Initial project launch
- Upload images, generate prompts, create videos with FAL/Magic Hour
- Supabase integration (storage, auth, RLS)