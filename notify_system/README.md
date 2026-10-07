Here's the complete **production-ready configuration & structure proposal** aligned with what I see in your repo — `notify_system/` branch with `logs/` and broader project reorganization 🎯

---

# ⚙️ CrystalCastle — Notify System: New Config & Structure

**Branch:** `notify_system` • **Status:** 45 commits ahead of upstream • **Ready:** Apply & Push ✅

---

## 📁 Recommended Clean Structure

```
crystalcastleX/
├── notify_system/              # 🔔 Notification & Alert Engine
│   ├── README.md              # → Purpose, triggers, delivery methods
│   ├── CONFIG.md               # → This file — settings & reference
│   ├── .env.example           # → Template: API keys, channels, thresholds
│   ├── src/
│   │   ├── index.js            # → Entry: init(config)
│   │   ├── channels/           # → Email • Slack • Discord • Webhook • GitHub Issue
│   │   │   ├── base.js         # → Channel interface
│   │   │   ├── slack.js
│   │   │   ├── email.js
│   │   │   └── webhook.js
│   │   ├── processors/         # → Filter • Batch • Throttle • Template
│   │   │   ├── router.js       # → Route event → channel
│   │   │   ├── throttle.js     # → Prevent flood
│   │   │   └── template.js     # → Message formatting
│   │   └── storage/            # → Persist history & state
│   │       ├── history.js      # → Append-only notify_history.json
│   │       └── cursor.js       # → Last-processed checkpoint
│   ├── logs/
│   │   ├── notify_history.json # ✅ Exists — append-only, immutable
│   │   └── notify_errors.log   # → Runtime failures
│   ├── schemas/
│   │   ├── event.schema.json   # → Input validation
│   │   └── config.schema.json  # → Self-validate config
│   └── package.json            # → Dependencies: ajv, axios, @slack/web-api, nodemailer
│   └── .gitignore              # → .env, *.log, node_modules/
├── docs/knowledge/
│   └── notify-system.md        # → User guide & integration
└── .github/workflows/
    └── notify-dispatch.yml     # → Auto-run on issue/PR/push
```

---

## 📄 `notify_system/CONFIG.md` — Full Reference

```markdown
# ⚙️ Notify System — Configuration Reference

**Version:** 1.0.0 • **Branch:** `notify_system` • **Status:** Active

---

## 🔧 Environment Variables (`.env`)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NOTIFY_ENV` | No | `production` | `development` = verbose logging, no rate limits |
| `NOTIFY_LOG_PATH` | No | `./logs/notify_history.json` | Path to append-only history file |
| `NOTIFY_MAX_BATCH` | No | `10` | Group N events before dispatching |
| `NOTIFY_RATE_LIMIT_SEC` | No | `60` | Minimum seconds between same-type alerts |
| `NOTIFY_SLACK_WEBHOOK_URL` | Conditional | — | Slack incoming webhook |
| `NOTIFY_EMAIL_FROM` | Conditional | — | Sender address |
| `NOTIFY_EMAIL_TO` | Conditional | — | Comma-separated recipients |
| `NOTIFY_WEBHOOK_URL` | No | — | Generic POST endpoint |
| `NOTIFY_SECRET_TOKEN` | No | — | Signed header for webhook verification |

---

## 📂 `config.json` — Runtime Settings

```json
{
  "system": {
    "name": "CrystalCastle Notify",
    "version": "1.0.0",
    "logLevel": "info",
    "historyRetentionDays": 90
  },
  "channels": {
    "slack": {
      "enabled": true,
      "webhookUrl": "${NOTIFY_SLACK_WEBHOOK_URL}",
      "defaultChannel": "#alerts",
      "mentionOnError": ["@here"],
      "priorityMap": {
        "critical": "channel",
        "warning": "here",
        "info": ""
      }
    },
    "email": {
      "enabled": false,
      "from": "${NOTIFY_EMAIL_FROM}",
      "to": "${NOTIFY_EMAIL_TO}",
      "transport": "smtp",
      "smtpHost": "smtp.gmail.com",
      "smtpPort": 587,
      "secure": false
    },
    "webhook": {
      "enabled": false,
      "url": "${NOTIFY_WEBHOOK_URL}",
      "secret": "${NOTIFY_SECRET_TOKEN}",
      "signatureHeader": "X-Notify-Signature"
    }
  },
  "rules": {
    "throttle": {
      "enabled": true,
      "windowSeconds": 60,
      "maxPerWindow": 5
    },
    "batch": {
      "enabled": true,
      "maxCount": 10,
      "flushIntervalSeconds": 30
    },
    "filter": {
      "excludeEvents": ["ping", "heartbeat"],
      "minPriority": "info"
    }
  },
  "triggers": {
    "onPullRequest": true,
    "onIssue": true,
    "onPush": false,
    "onWorkflowFailure": true
  }
}
```

---

## 📤 Event Payload Format

```json
{
  "id": "evt_abc123xyz",
  "timestamp": "2026-09-23T22:00:00Z",
  "source": "github/pr",
  "priority": "info",
  "title": "chore: restructure repo",
  "message": "PR #3 opened — moving to frontend/backend/dev structure",
  "link": "https://github.com/zyntromedia/crystalcastleX/pull/3",
  "actor": "zyntromedia",
  "repository": "zyntromedia/crystalcastleX",
  "metadata": {
    "prNumber": 3,
    "branch": "chore/restructure-repo"
  }
}
```

---

## 🧪 Validate Config

```bash
cd notify_system
node -e "const cfg = require('./config.json'); console.log('✅ Config loaded —', cfg.system.name, 'v' + cfg.system.version)"
```

---

## 📜 History Schema (`logs/notify_history.json`)

**Append-only — never rewrite existing lines**
```json
{"id":"evt_xxx","ts":"2026-09-23T...","ch":"slack","status":"delivered"}
{"id":"evt_yyy","ts":"2026-09-23T...","ch":"email","status":"queued"}
{"id":"evt_zzz","ts":"2026-09-23T...","ch":"webhook","status":"failed","retry":1}
```

---

## 🚀 Workflow Trigger Example

```yaml
# .github/workflows/notify-dispatch.yml
name: 🔔 Dispatch Notification
on:
  pull_request:
    types: [opened, reopened, synchronize]
  issues:
    types: [opened, labeled]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: cd notify_system && npm ci
      - name: Send notification
        env:
          NOTIFY_SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
        run: node src/index.js --event "$EVENT_PAYLOAD"
        env:
          EVENT_PAYLOAD: ${{ toJson(github.event) }}
```

---

## ✅ Quick Apply

```bash
git checkout notify_system

# Create folders
mkdir -p notify_system/src/{channels,processors,storage,schemas}

# Create files from above
# → CONFIG.md
# → .env.example
# → config.json
# → src/index.js
# → schemas/*.json

git add notify_system/
git commit -m "feat: notify system — complete config & structure"
git push -u origin notify_system
```

---

Would you like me to write the **actual JavaScript implementation** (`src/index.js`, channels, history logger) to make this runnable? 🚀
