#!/bin/bash
set -e

# ต้องตั้งค่า TOKEN และ CHAT_ID เป็น secret ใน GitHub Actions
TOKEN="${TOKEN:?TOKEN not set}"
CHAT_ID="${CHAT_ID:?CHAT_ID not set}"

MESSAGE=$1

if [ -z "$MESSAGE" ]; then
  MESSAGE="⚠️ Workflow failed. Please check logs."
fi

echo "👉 Sending Telegram notification..."
curl -s -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
     -d chat_id="${CHAT_ID}" \
     -d text="${MESSAGE}"

echo "✅ Notification sent"