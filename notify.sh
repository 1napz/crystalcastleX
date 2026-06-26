#!/bin/bash
# notify.sh - ส่งผลการตรวจจาก version.json ไป LINE Notify

# ตั้งค่า LINE Notify Token
LINE_TOKEN="YOUR_LINE_NOTIFY_TOKEN"

# อ่านข้อมูลจาก version.json
TOPIC=$(jq -r '.หัวข้อ' version.json)
STATUS=$(jq -r '.สถานะ' version.json)
TIME=$(jq -r '.เวลา' version.json)
CHANGES=$(jq -r '.สิ่งที่เปลี่ยน[]' version.json | sed 's/^/- /')
ERRORS=$(jq -r '.ข้อผิดพลาด[]?' version.json | sed 's/^/- /')
NOTE=$(jq -r '.อื่นๆ.หมายเหตุ' version.json)

# สร้างข้อความ bilingual
MESSAGE=$(cat <<EOF
[CrystalCastle Governance Alert]

หัวข้อ: $TOPIC
สถานะ: $STATUS
เวลา: $TIME

สิ่งที่ตรวจพบ:
$CHANGES

ข้อผิดพลาด:
$ERRORS

การแจ้งเตือน: $NOTE

---

Topic: $TOPIC
Status: $STATUS
Time: $TIME

Findings:
$CHANGES

Errors:
$ERRORS

Notification: $NOTE
EOF
)

# ส่งข้อความไป LINE Notify
curl -X POST -H "Authorization: Bearer $LINE_TOKEN" \
     -F "message=$MESSAGE" \
     https://notify-api.line.me/api/notify