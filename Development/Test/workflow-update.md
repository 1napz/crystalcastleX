
---

`yaml
name: CI/CD with Telegram Alerts

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run Unit & Smoke Tests
        run: npm test

      - name: Run Playwright Visual Regression
        run: npx playwright test --config=playwright.visual.config.ts

      - name: Send Telegram Alert on Failure
        if: failure()
        run: |
          curl -s -X POST https://api.telegram.org/bot${{ secrets.TELEGRAM_TOKEN }}/sendMessage \
            -d chatid=${{ secrets.TELEGRAMCHAT_ID }} \
            -d text="🚨 Crystal Castle Alert: Workflow failed at job ${{ github.job }} (commit: ${{ github.sha }})"
`

---

📌 จุดสำคัญ
- Unit & Smoke Tests → ตรวจสอบฟังก์ชันหลักและ flow AI Video  
- Playwright Visual Regression → ตรวจสอบ video player และ branding logo  
- Telegram Alert → ส่งข้อความไปยังกลุ่ม/ผู้ใช้ทันทีเมื่อ workflow ล้มเหลว  
- ใช้ GitHub Secrets (TELEGRAMTOKEN, TELEGRAMCHAT_ID) เพื่อความปลอดภัย  

---



