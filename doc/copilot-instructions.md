## Copilot Instructions for Crystal Castle

### General
- Use Vanilla JavaScript (ES Modules) for client-side
- Prefer `innerHTML` when possible, avoid `document.createElement`
- Do NOT use jQuery
- Tailwind CSS is used via CDN
- API Routes are in `/api/*.js`
- Supabase client initialization uses constants in `supabase-client.js`

### Error Handling
- Always handle errors with try/catch
- Provide toast notifications via `showToast()` instead of `alert()`
- Use AbortController for all fetch requests
- Add `window.addEventListener('unhandledrejection', ...)` globally

### API Integration
- AI Video Engine endpoints are unified in `/api/generate-video`
- Send `engine` parameter to select the AI provider
- Supported engines: fal, magic, runway, pika, nexa, wavespeed

### Security
- Never hardcode API keys in client-side code
- Use `https` for all external requests
- Verify CSP and X-Frame-Options in `vercel.json`
