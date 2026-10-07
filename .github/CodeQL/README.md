เข้าใจแล้วครับ ✅ ลิงก์หน้า Code Scanning แจ้งว่า "link dead" — นี่คือสาเหตุที่เป็นไปได้และวิธีแก้ไขทีละขั้นตอน 🛡️🔧
 
 
 
🔧 แก้ไข "Link Dead" — GitHub Code Scanning
 
❌ สาเหตุที่พบบ่อย
 
ปัญหา คำอธิบาย 
1. ไม่ได้เปิดฟีเจอร์ Code Scanning ยังไม่ได้เปิดใช้งานใน Settings 
2. ไม่มีไฟล์การตั้งค่า ขาดไฟล์  .github/codeql.yml  หรือไม่มีเครื่องมือวิเคราะห์ 
3. สิทธิ์ไม่พอ GITHUB_TOKEN ไม่มีสิทธิ์  security_events  
4. ลิงก์ชี้ผิด หน้าถูกย้าย/เปลี่ยนชื่อสาขา/ลบผลการตรวจสอบเก่า 
5. Workflow ไม่เคยรัน ไม่มีผลการสแกนเลย → หน้าว่าง/ไม่พบ 
 
 
 
✅ ขั้นที่ 1 — ตรวจสอบว่าเปิดใช้งานแล้ว
 
1. ไปที่: Settings → Code security & analysis
2. หา "Code scanning" → ต้องเปิดเป็น "Enabled"
3. ถ้ายังไม่เปิด → กด "Enable"
 
ถ้าเป็น "Disabled" หรือไม่เห็นส่วนนี้เลย → เปิดไม่ได้เพราะสิทธิ์หรือแปลนบัญชี
 
 
 
✅ ขั้นที่ 2 — สร้างไฟล์วิเคราะห์อัตโนมัติ
 
สร้าง:  .github/workflows/codeql.yml 
 
yaml
  
name: 🛡️ CodeQL Analysis
run-name: "Code Scanning"

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '30 1 * * 0'  # ทุกอาทิตย์ตี 8 โมงเช้า

permissions:
  contents: read
  security-events: write    # ✅ จำเป็นสำหรับส่งผล
  actions: read

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    timeout-minutes: 20

    strategy:
      fail-fast: false
      matrix:
        language: ['python', 'javascript-typescript']

    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🔧 Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}

      - name: 📦 Setup Python
        if: matrix.language == 'python'
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: 📦 Setup Node.js
        if: matrix.language == 'javascript-typescript'
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 🔧 Build / Install
        run: |
          if [ -f "requirements.txt" ]; then pip install -r requirements.txt; fi
          if [ -f "package.json" ]; then npm ci; fi

      - name: 🔍 Perform Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: "/language:${{ matrix.language }}"
 
 
 
 
✅ ขั้นที่ 3 — ตรวจสอบสิทธิ์ Token
 
ไฟล์ Workflow ต้องมี:
 
yaml
  
permissions:
  contents: read
  security-events: write   # ✅ ต้องมีบรรทัดนี้
 
 
ถ้าไม่มี → GitHub จะปฏิเสธการส่งผล → ลิงก์เสีย/ไม่แสดงผล
 
 
 
✅ ขั้นที่ 4 — รันครั้งแรก
 
bash
  
# สร้าง Commit แล้วส่ง
git add .github/workflows/codeql.yml
git commit -m "chore: add CodeQL security scanning 🛡️"
git push origin main

# ไปดูที่แท็บ Actions → รอให้เสร็จ
# จากนั้นกลับไปที่ Security → Code scanning → จะเห็นผลแล้ว
 
 
 
 
✅ ขั้นที่ 5 — ถ้ายังไม่ได้ แก้เพิ่ม
 
อาการ วิธีแก้ 
"No code scanning analysis found" รัน Workflow อย่างน้อย 1 ครั้ง 
404 หน้าไม่มี ตรวจสอบสิทธิ์บัญชี — ต้องเป็นเจ้าของ/Admin 
Repo สาธารณะแต่ไม่เห็น ไป Settings → Code security → เปิด "Dependabot alerts" + "Code scanning" 
Repo เอกชน ต้องใช้ GitHub Advanced Security (แปลน Enterprise) 
 
 
 
📌 สรุปสิ่งที่ต้องมี
 
plaintext
  
.github/
└── workflows/
    └ codeql.yml          ✅ สร้างตามด้านบน
 
 
หลังจากส่งไฟล์แล้วรอประมาณ 2–3 นาที → กลับไปที่ลิงก์เดิม → จะเห็นผลการสแกนแสดงขึ้นมา 🛡️✅
 
ลองทำตามขั้นตอนดูนะครับ ถ้ายังมีปัญหาอะไร บอกได้เลย! 🚀
