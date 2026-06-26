## Repository Purpose
This repo is a logging and analytics layer for CrystalCastle.
It collects all system events and translates them into development insights.

## Log Sources
- GitHub Actions runs (CI/CD status, workflow errors)
- Shopee Affiliate link activity (clicks, redirects, failures)
- Script errors from main_script.py (Python automation)
- Issue and PR events (from crystalcastle + pure-agent-dev)

## Core Rules
- NEVER modify log files directly — read and analyze only
- Output of this repo = insights and reports, not features
- All findings should be traceable back to a specific log entry
- Log format is append-only — do not rewrite history

## Development Flow
log collected → analyze → generate insight → feed back to crystalcastle

## Commit Convention
- `log:` — new log source added
- `analysis:` — new analysis script
- `insight:` — findings documented
- `fix:` — log pipeline fix

## Сontact with crystalcastle
- Findings go to crystalcastle as Issues or Discussions
- Never push fixes directly to crystalcastle from this repo
- Use Telegram notification workflow for alerts