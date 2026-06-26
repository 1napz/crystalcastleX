---

📂 ตัวอย่าง notify.yml (DevContainer Setup + Noti Integration)
`yaml
name: DevContainer Setup & Notify

on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  devcontainer-setup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v3

      - name: Run DevContainer Up
        run: |
          devcontainer up --workspace-folder .
      
      - name: Verify Container
        run: |
          docker ps --filter "label=devcontainer.local_folder=$(pwd)" --format '{{.ID}}'

      - name: Notify Success
        if: success()
        run: |
          echo "[CrystalCastle Noti] ✅ DevContainer Setup Completed 🎉" >> notify_history.json

      - name: Notify Failure
        if: failure()
        run: |
          echo "[CrystalCastle Noti] 🚨 DevContainer Setup Failed ❌" >> notify_history.json
`

---