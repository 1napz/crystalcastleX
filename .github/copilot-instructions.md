# Copilot Instructions — Zyntro Media AI

> Org-level instructions for all repositories under **Zyntro-Media-AI**.  
> Copilot must follow these conventions unless a repo-level `copilot-instructions.md` overrides them.

---

## 1. Stack & Runtime

- **Frontend**: Next.js 14+ (App Router). Use Server Components by default; add `"use client"` only when necessary (event handlers, hooks, browser APIs).
- **Language**: TypeScript strict mode (`"strict": true`). No `any` unless explicitly commented with a reason.
- **Backend / DB**: Supabase (PostgreSQL). Use the `@supabase/supabase-js` v2 client. Prefer server-side client (`createServerClient`) in Server Components and Route Handlers.
- **AI inference**: Groq SDK (`groq-sdk`) for LLM calls. Do not use OpenAI SDK unless the model is OpenAI-only.
- **Styling**: Tailwind CSS. No inline `style={}` unless dynamic values require it.
- **Package manager**: npm. Do not suggest yarn or pnpm commands.
- **Runtime env**: Node.js 20 LTS. Code must run in Termux (Android) without native binary dependencies where possible.

---

## 2. Project Structure (Next.js repos)

```
app/
  (routes)/          # route groups
  api/               # Route Handlers
components/
  ui/                # shadcn/ui primitives
  [feature]/         # feature-specific components
lib/
  supabase/          # client + server helpers
  groq/              # Groq client + prompt builders
  utils/             # pure helpers
types/               # shared TypeScript types
```

- Keep components under 200 lines. Split into sub-components if larger.
- Co-locate types with their feature; export shared types from `types/`.
- Server actions go in `app/actions/` with `"use server"` directive.

---

## 3. TypeScript Conventions

- Export named types, not default types.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Use `z.infer<typeof Schema>` (Zod) for API request/response types.
- Always type Supabase query returns explicitly — do not rely on inferred `any` from `.data`.

```ts
// ✅ Good
const { data, error } = await supabase
  .from('videos')
  .select('id, title, status')
  .returns<Video[]>()

// ❌ Bad
const { data } = await supabase.from('videos').select('*')
```

---

## 4. Supabase Patterns

- Use Row Level Security (RLS) on every table. Never bypass with service role key on the client.
- Service role key (`SUPABASE_SERVICE_ROLE_KEY`) is server-only — never import in `"use client"` files.
- Wrap multi-step DB operations in a Postgres function (RPC) rather than multiple round-trips.
- Always handle `error` from Supabase calls before accessing `data`.
- Use `supabase.storage` for file uploads; never store binary in the DB.

---

## 5. AI Pipeline (Groq + FAL + RunwayML + others)

- All AI calls must go through `lib/groq/` or `lib/ai/[provider]/` — no direct SDK calls from components.
- Prompt templates live in `lib/groq/prompts/` as exported `const` strings or builder functions.
- Never hardcode model IDs in components; import from `lib/ai/models.ts`.
- Always set `max_tokens` and `temperature` explicitly — never rely on provider defaults.
- Wrap every external AI call in try/catch and return a typed `Result<T, Error>` pattern.
- Log provider, model, latency, and token usage (no PII) via a centralised `lib/logger.ts`.

```ts
// lib/ai/models.ts
export const MODELS = {
  groq: {
    fast: 'llama-3.1-8b-instant',
    smart: 'llama-3.3-70b-versatile',
  },
  fal: {
    imageGen: 'fal-ai/flux/schnell',
  },
} as const
```

---

## 6. Code Style & Review Rules

- **No commented-out code** in PRs. Delete it or use a `// TODO(name): reason` comment.
- **No `console.log`** in production code. Use `lib/logger.ts` instead.
- Functions must be pure where possible. Side effects belong in hooks or server actions.
- Max function length: 40 lines. Extract helpers if longer.
- Boolean variable names must start with `is`, `has`, `can`, or `should`.
- Async functions must always `await` — no floating promises.
- Error messages must be human-readable strings, not raw error objects.

---

## 7. Environment Variables

- All env vars must be declared in `.env.example` with placeholder values and a comment.
- Client-side vars must be prefixed `NEXT_PUBLIC_`.
- Never access `process.env` directly in components — wrap in `lib/config.ts`.

```ts
// lib/config.ts
export const config = {
  groqApiKey: process.env.GROQ_API_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ...
} as const
```

---

## 8. Testing

- Use **Vitest** for unit tests. Jest is not used in this org.
- Test files live next to the source: `lib/utils/format.test.ts`.
- Every exported util function must have at least one test.
- Mock Supabase and Groq clients in tests — never call real APIs in test suite.
- Run tests with `npm test` (mapped to `vitest run`).

---

## 9. CI / GitHub Actions

- Workflow files live in `.github/workflows/`.
- Every PR must pass: `lint` → `type-check` → `test` → `build` in that order.
- Use `actions/cache` for `node_modules` keyed on `package-lock.json` hash.
- Secrets are accessed via `${{ secrets.NAME }}` — never hardcode in YAML.
- Notify on failure via Slack webhook (`SLACK_WEBHOOK_URL` secret).

---

## 10. Security

- Never commit `.env` files. `.env.example` only.
- Sanitise all user inputs before passing to SQL or AI prompts.
- Use Supabase RLS + JWT claims for authorization — never roll custom auth middleware.
- Dependabot alerts must be resolved within 7 days for high/critical severity.
- No `eval()`, `dangerouslySetInnerHTML` without sanitisation, or dynamic `require()`.

---

## 11. Git & PR Conventions

- Branch naming: `feat/`, `fix/`, `chore/`, `docs/` prefixes.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(scope): description`.
- PRs must reference an issue: `Closes #123`.
- Keep PRs small — one logical change per PR.
- Semantic Release is used for versioning; do not manually bump `package.json` version.

---

## 12. What Copilot Should NOT Do

- Do not suggest `pages/` directory patterns — this org uses App Router only.
- Do not use `getServerSideProps` or `getStaticProps`.
- Do not suggest `axios` — use native `fetch` or the provider SDK.
- Do not generate migration files manually — use `supabase db diff` instead.
- Do not add `// eslint-disable` without a specific rule name and reason.
- Do not suggest storing secrets in `next.config.js` env section.
