Here’s a CrystalCastle workflow with CodeRabbit integration you can drop into .github/workflows/coderabbit.yml. It combines automated PR review, style checks, and notifications (LINE/Telegram) so your team gets instant feedback:

`yaml
name: CrystalCastle CodeRabbit Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  coderabbit-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run CodeRabbit Review
        uses: coderabbitai/coderabbit-action@v1
        with:
          githubtoken: ${{ secrets.GITHUBTOKEN }}
          config_file: .github/coderabbit.yml

      - name: Notify LINE
        if: always()
        run: |
          curl -X POST -H "Authorization: Bearer ${{ secrets.LINE_TOKEN }}" \
          -F "message=CodeRabbit review completed for PR #${{ github.event.pull_request.number }}" \
          https://api.line.me/v2/bot/message/push

      - name: Notify Telegram
        if: always()
        run: |
          curl -s -X POST https://api.telegram.org/bot${{ secrets.TELEGRAMBOTTOKEN }}/sendMessage \
          -d chatid=${{ secrets.TELEGRAMCHAT_ID }} \
          -d text="CodeRabbit review completed for PR #${{ github.event.pull_request.number }}"
`

---

🔑 Key Parts
- Trigger → runs on PR open/update.  
- CodeRabbit Action → performs automated review using .github/coderabbit.yml.  
- LINE notification → sends message via LINE Bot API.  
- Telegram notification → sends message via Telegram Bot API.  

---

📂 Example .github/coderabbit.yml
`yaml
version: 1
rules:
  - name: "Python Style"
    triggers: ["pull_request"]
    files: ["/*.py"]
    actions:
      - run: "flake8"

  - name: "Markdown Docs"
    triggers: ["pull_request"]
    files: ["/*.md"]
    actions:
      - run: "markdownlint"

notifications:
  - type: "line"
    channel: "@dev_team"
  - type: "telegram"
    channel: "@crystalcastle_ci"
`

---

This setup ensures every PR in CrystalCastle gets:
- Automated CodeRabbit review  
- Style checks for Python + Markdown  
- Real-time alerts to LINE and Telegram  

Would you like me to extend this workflow to also include unit test execution (pytest/coverage) so CodeRabbit reviews and test results appear together in the same pipeline?