จัดให้ครับ ✨ นี่คือตัวอย่าง GitHub Actions Workflow (YAML) สำหรับดูแล logs โดยตรง — ครอบคลุมการสร้าง, ตรวจสอบ, archive และแจ้งเตือน  

`yaml
name: Logs Maintenance

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  logs-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Validate logs directory
        run: |
          mkdir -p logs
          test -f logs/video.json || echo "⚠️ logs/video.json missing" && exit 1

      - name: Archive old logs
        run: |
          mkdir -p logs/archive
          zip -r logs/archive/$(date +'%Y-%m-%d')-logs.zip logs/raw || echo "No raw logs to archive"

      - name: Notify on failure
        if: failure()
        run: |
          echo "❌ Logs workflow failed"
          # ตัวอย่าง: ส่งแจ้งเตือนผ่าน LINE/Telegram API
          curl -X POST -H "Content-Type: application/json" \
            -d '{"message":"Logs workflow failed on PR run"}' \
            https://your-notify-endpoint.example
`

---

จุดเด่นของ Workflow นี้
- Log Creation → บังคับให้มี logs/ directory เสมอ  
- Log Validation → ตรวจสอบว่า logs/video.json ถูกสร้างจริง  
- Log Rotation → archive logs เก่าเป็น zip แล้วเก็บใน logs/archive/  
- Error Handling → ถ้า pipeline fail จะ trigger แจ้งเตือน  
- Monitoring & Alerts → สามารถเชื่อมต่อ LINE/Telegram API เพื่อส่งข้อความแจ้งเตือน  

---

คุณอยากให้ผมเพิ่ม ขั้นตอน auto-cleanup (ลบ logs เก่ากว่า 30 วัน) เข้าไปใน workflow นี้ด้วยเลยไหมครับ จะได้ไม่ต้อง archive ไว้เยอะเกินจน repo หนัก 🗑️