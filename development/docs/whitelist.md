ครับ ✨ ผมทำ Whitelist Script (whitelist.sh) ให้คุณใช้เพิ่ม email เข้า whitelist ได้สะดวกครับ

📌 Script: whitelist.sh

#!/bin/bash
# Whitelist Management Script (CrystalCastle)
# Usage: ./whitelist.sh add user@example.com
#        ./whitelist.sh list

CONFIG_FILE=".coderabbit.yaml"
BACKEND_FILE="agent.config.json"
SQL_FILE="supabase_whitelist.sql"

ACTION=$1
EMAIL=$2

if [ "$ACTION" == "add" ]; then
  if [ -z "$EMAIL" ]; then
    echo "❌ Usage: ./whitelist.sh add user@example.com"
    exit 1
  fi

  echo "➡️ Adding $EMAIL to Whitelist..."

  # 1. Update Config File
  if [ -f "$CONFIG_FILE" ]; then
    sed -i "/whitelist:/a \ \ \ \ - $EMAIL" $CONFIG_FILE
    echo "  - Updated $CONFIG_FILE"
  fi

  # 2. Update Backend Config
  if [ -f "$BACKEND_FILE" ]; then
    sed -i "/whitelist\": \[/a \ \ \ \"$EMAIL\"," $BACKEND_FILE
    echo "  - Updated $BACKEND_FILE"
  fi

  # 3. Update Supabase Policy SQL
  cat <<EOF > $SQL_FILE
-- Supabase Policy Update
alter policy "Agent whitelist"
on agent_logs
for insert
using (
  auth.jwt() ->> 'email' in (
    'nobizzmaru@gmail.com',
    'napnotgood@gmail.com',
    'nobizzmaru2025@outlook.co.th',
    '$EMAIL'
  )
);
EOF
  echo "  - Generated $SQL_FILE"

  echo "✅ Whitelist update prepared for: $EMAIL"

elif [ "$ACTION" == "list" ]; then
  echo "📋 Current Whitelist (from $CONFIG_FILE):"
  grep "-" $CONFIG_FILE | sed 's/- //g'
else
  echo "❌ Usage: ./whitelist.sh [add|list] email@example.com"
fi

🔹 วิธีใช้

chmod +x whitelist.sh
./whitelist.sh add newuser@example.com   # เพิ่ม email เข้า whitelist
./whitelist.sh list                      # ดูรายการ whitelist ปัจจุบัน

✅ ทำแล้วดียังไง

Automation ครบวงจร → เพิ่ม email เข้า whitelist ทั้ง Config, Backend, Supabase

Audit Trail ครบถ้วน → commit script และ SQL เข้า repo → Reviewer/Admin ตรวจสอบได้

Governance Alignment → ครอบคลุม Privacy, Compliance, Transparency

👉 แบบนี้คุณสามารถใช้ whitelist.sh จัดการ whitelist ได้สะดวกและปลอดภัยครับ

คุณอยากให้ผมทำ Mermaid Diagram (Whitelist Propagation Flow) เพิ่มเข้า Knowledge Log เลยไหมครับ เพื่อให้ทีมเห็นภาพว่า email ใหม่จะถูก propagate ไป Config → Backend → Supabase → Cockpit → Audit Trail อย่างไร?