🔹 ตัวอย่าง Workflow (.github/workflows/telegram-cli.yml)

`yaml
name: Telegram CLI Runner

on:
  workflow_dispatch: # manual trigger
  repository_dispatch: # external trigger (จาก Telegram bot)

jobs:
  run-cli:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Close all open PRs
        run: |
          gh pr list --state open --repo ${{ github.repository }} \
            | awk '{print $1}' \
            | xargs -n1 gh pr close --repo ${{ github.repository }}
        env:
          GITHUBTOKEN: ${{ secrets.GITHUBTOKEN }}
`

---

🔹 การเชื่อมต่อ Telegram Bot → GitHub Actions
1. สร้าง Telegram Bot ผ่าน BotFather  
2. เก็บ BOTTOKEN และ CHATID ใน GitHub Secrets (TELEGRAMBOTTOKEN, TELEGRAMCHATID)  
3. เขียน script ฝั่ง Telegram bot ให้ส่ง repository_dispatch event ไปยัง GitHub API เช่น:

`bash
curl -X POST \
  -H "Authorization: token <YOURGITHUBPAT>" \
  -H "Accept: application/vnd.github.everest-preview+json" \
  https://api.github.com/repos/1napz/crystalcastle/dispatches \
  -d '{"event_type": "telegram-cli"}'
`

4. เมื่อ Telegram bot รับข้อความ เช่น "reset-pr", ให้มันยิง API นี้ → GitHub Actions จะรัน workflow และปิด PR ค้างทั้งหมด

---

✅ สรุป
- ใช้ GitHub Actions + repository_dispatch เป็น bridge  
- Telegram bot → ส่ง event → GitHub Actions → รัน CLI (gh pr close)  
- Audit trail จะอยู่ครบใน GitHub และ reviewer จะเห็นว่า PR ถูกปิดด้วย automation