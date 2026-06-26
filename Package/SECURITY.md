# Security Guidelines

To keep Crystal Castle secure:

- Report vulnerabilities via GitHub Issues with the `security` label.
- Do not commit secrets (API keys, tokens) into the repository.
- Follow Supabase RLS policies for database access.
- Enable GitHub secret scanning to detect leaked keys.
- Apply CSP headers and rate limiting as configured in `vercel.json`.