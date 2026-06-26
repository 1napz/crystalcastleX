Crystal AI Gateway
==================

> ระบบ Chatbot AI บน Vercel AI Gateway พร้อมระบบ Governance, Review และ Audit Trail ครบวงจร

Quick Start / เริ่มใน 30 วิ
---------------------------
git clone https://github.com/your-org/crystal-ai-gateway && cd crystal-ai-gateway
pnpm i && vc dev
เปิด http://localhost:3000

Demo / ตัวอย่าง
---------------
Live Demo: https://crystal-ai-gateway.vercel.app
ลองพิมพ์: "อธิบายเรื่อง OIDC แบบง่ายๆ"

Overview / ภาพรวม
-----------------
Crystal AI Gateway คือโปรเจกต์ chatbot ที่รันบน Vercel AI Gateway เสริมด้วยระบบ Workflow Governance จาก CrystalCastle

เหมาะสำหรับ: ทีมที่ต้องการ deploy AI app ขึ้น production แต่ยังอยากคุมเรื่อง Security, Permissions และมี Audit ที่ตรวจสอบย้อนหลังได้

จุดเด่น
- Deploy ง่าย: ใช้ Vercel + OIDC เหมือน demo ปกติ
- ควบคุมได้: มี Reviewer Cockpit, RBAC, Audit Trail แบบ CrystalCastle
- Compliance Ready: Log ทุกอย่างเป็น 2 ภาษา Export เป็น Excel ได้

Requirements / สิ่งที่ต้องมี
----------------------------
- Node.js >= 20.0.0
- pnpm >= 9.0.0 หรือ npm >= 10
- Vercel CLI >= 35.0.0
- Python 3.10+ สำหรับสคริปต์ export
- Git >= 2.40

Architecture / สถาปัตยกรรม
--------------------------
[Browser] -> [Vercel Edge] -> [Next.js /api/chat] -> [Vercel AI Gateway] -> [LLM]
                                   |
                                   +-> [GitHub Actions CI]
                                             |
                                             +-> [OIDC Token] -> Deploy Vercel
                                             +-> [Audit Log] -> [Excel Export]

Key: ไม่มีการเก็บ API Key ใน repo ทุกอย่างผ่าน OIDC

Features / ฟีเจอร์หลัก
----------------------
1. AI Gateway: ใช้ Vercel AI SDK รองรับ OpenAI, Anthropic, Meta Llama
2. CI/CD Automation: GitHub Actions deploy อัตโนมัติขึ้น Vercel
3. Reviewer Cockpit: Notes + Rules + Checklist ก่อน merge ทุก PR
4. Permissions Governance: RBAC แยก reviewer / admin / agent ชัดเจน
5. Audit Trail: บันทึก Log ทุก commit/test/deploy ภาษาไทยและอังกฤษ
6. Modular Docs: เอกสารครบ: reviewer.notes.md, rules.md, flow.md
7. Local Excel Export: สคริปต์สร้างไฟล์.xlsx สำรอง Log ไว้ในเครื่อง
8. Secure Backend: ใช้ OIDC Federation ไม่เก็บ Secret ใน repo

Installation / การติดตั้ง
------------------------

1. One-time Setup

1.1 Clone ด้วย Deploy Button
    กดปุ่ม Deploy บน Vercel เพื่อสร้าง repo และโปรเจกต์พร้อมกัน

1.2 ติดตั้ง Vercel CLI
    npm i -g vercel

1.3 Clone repo ที่สร้าง
    git clone https://github.com/your-org/crystal-ai-gateway
    cd crystal-ai-gateway

1.4 Link กับ Vercel Project
    vc link
    เลือกโปรเจกต์ที่ Deploy ไว้

2. Usage / วิธีใช้งาน

2.1 ติดตั้ง Dependencies
    pnpm i
    หรือ npm i หรือ yarn i

2.2 ตั้งค่า Environment
    cp.env.example.env.local
    vc env pull

2.3 รัน Development Server
    vc dev
    คำสั่งนี้จะ auto-refresh OIDC token ให้อัตโนมัติ

2.4 ทดสอบ Chatbot
    เปิด http://localhost:3000

3. Local Excel Export Setup

Dependencies
    sudo apt update
    sudo apt install -y jq
    pip3 install pandas openpyxl

รันสคริปต์ Export
    python scripts/export_audit.py --output./logs/audit.xlsx
สคริปต์จะรวมข้อมูลเป็น CSV -> แปลงเป็น XLSX ด้วย pandas -> เซฟไว้ในเครื่อง
ไม่ auto-upload เพื่อให้ admin คุมความปลอดภัยเอง

Environment Variables
---------------------
ไฟล์.env.example:

AI_GATEWAY_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUDIT_LOG_LEVEL=info
ENABLE_AUDIT_EXPORT=true

คำอธิบายตัวแปร:

1. ตัวแปร: AI_GATEWAY_TOKEN
   จำเป็น: Yes
   คำอธิบาย: OIDC token จาก Vercel, auto-manage ด้วย vc dev

2. ตัวแปร: NEXT_PUBLIC_APP_URL
   จำเป็น: Yes
   คำอธิบาย: URL ของแอป ใช้สำหรับ callback และ CORS

3. ตัวแปร: AUDIT_LOG_LEVEL
   จำเป็น: No
   คำอธิบาย: ระดับ log: info หรือ debug, default คือ info

4. ตัวแปร: ENABLE_AUDIT_EXPORT
   จำเป็น: No
   คำอธิบาย: เปิด/ปิดฟีเจอร์ export Excel: true หรือ false

สำคัญ: AI_GATEWAY_TOKEN ไม่ต้องเซ็ตเอง vc dev จัดการให้ ถ้ารันเองต้อง vc env pull ทุก 12 ชม. เพราะ OIDC token หมดอายุ

Limits / ข้อจำกัด
-----------------
- Vercel AI Gateway: 100 req/day สำหรับ Hobby plan
- OIDC Token: หมดอายุ 12 ชม.
- Excel Export: รองรับ log ไม่เกิน 100k rows ต่อไฟล์
- Response Timeout: 60 วินาทีบน Vercel Hobby

Security / ความปลอดภัย
-----------------------
1. RBAC: แยกสิทธิ์ reviewer / admin / agent ชัดเจน ผ่าน.coderabbit.yaml
2. MFA: แนะนำให้เปิดใช้งานทุกบัญชี GitHub + Vercel
3. OIDC Federation: ใช้ "Secure Backend Access with OIDC" แทน API Key
   เปิดที่ Project Settings -> Search 'OIDC' -> Enable
4. Audit Trail: ทุก commit/test/deploy มี log ย้อนหลังได้ ทั้ง TH/EN
5. Secret Scan: ตรวจสอบ secrets อัตโนมัติทุก push ด้วย GitHub Advanced Security
6. Token Expiry: OIDC token หมดอายุทุก 12 ชม. ถ้าไม่ใช้ vc dev ต้องรัน vc env pull ใหม่

Security / แจ้งช่องโหว่
------------------------
ถ้าพบช่องโหว่ด้านความปลอดภัย ห้ามเปิด GitHub Issue

ส่งมาที่: security@your-org.com พร้อมหัวข้อ [SECURITY]
เราจะตอบกลับภายใน 48 ชั่วโมง

นโยบายเต็ม: SECURITY.md
เราใช้: OIDC, Secret Scanning, Dependabot, CodeQL

Project Structure / โครงสร้างโปรเจกต์
-------------------------------------
crystal-ai-gateway/
├── app/ # Next.js App Router + AI Chatbot UI
├── api/ # Route Handlers เรียก Vercel AI Gateway
├── docs/ # Release notes และเอกสารเพิ่มเติม
├── reviewer/ # Reviewer Cockpit ทั้งหมด
│ ├── reviewer.notes.md
│ ├── reviewer.rules.md
│ ├── reviewer.checklist.md
│ ├── reviewer.flow.md
│ └── reviewer.audit.md
├── scripts/ # Automation scripts + Excel export
├── logs/ # Audit logs ที่ export มา
├──.coderabbit.yaml # กำหนด RBAC และ Governance rules
├──.env.example # Template environment variables
├── CHANGELOG.md
├── CONTRIBUTING.md
└── SECURITY.md

Contributor Workflow / ขั้นตอนการ Contribute
--------------------------------------------
1. Fork & Clone - ทำงานบน branch ของตัวเอง
2. Branch - ตั้งชื่อ feat/xxx หรือ fix/xxx
3. Commit - ใช้ bilingual commit message เช่น feat: เพิ่มระบบ login
4. Pull Request - ต้องผ่าน Reviewer Checklist ก่อน
5. Governance Check -.coderabbit จะตรวจ Permissions อัตโนมัติ
6. Merge - Permissions revert, Audit Trail อัปเดต TH/EN logs

Merge PR Flow:
Merge PR -> Permissions Revert (read-all) -> Audit Trail Update (TH/EN) -> Reviewer Cockpit Update

ถ้า Log Incorrect -> Fix -> Block Merge
ถ้า Severity High -> Escalate -> Stop Merge

Troubleshooting / แก้ปัญหา
--------------------------
1. อาการ: Error: OIDC token expired
   สาเหตุ: Token หมดอายุ 12 ชม.
   วิธีแก้: รัน vc env pull หรือใช้ vc dev แทน

2. อาการ: Unauthorized: Invalid token
   สาเหตุ: ยังไม่ได้เปิด OIDC
   วิธีแก้: เข้า Vercel -> Project Settings -> เปิด "Secure Backend Access with OIDC Federation"

3. อาการ: vc dev ช้า / ไม่ auto-refresh
   สาเหตุ: Vercel CLI เวอร์ชันเก่า
   วิธีแก้: npm i -g vercel@latest

4. อาการ: git push ติด Secret Scanning
   สาเหตุ: มี key หลุดใน commit
   วิธีแก้: ลบ secret, ใช้ git filter-branch หรือ BFG, แล้วใช้ OIDC แทน

5. อาการ: Error: port 3000 already in use
   สาเหตุ: มี process อื่นใช้ port 3000 อยู่
   วิธีแก้: รัน npx kill-port 3000 หรือเปลี่ยน port: PORT=3001 vc dev

6. อาการ: pnpm: command not found
   สาเหตุ: ยังไม่ได้ติดตั้ง pnpm
   วิธีแก้: npm install -g pnpm หรือใช้ npm i แทน

7. อาการ: Error: No AI_GATEWAY_TOKEN found
   สาเหตุ: ลืมรัน vc env pull หรือไม่ได้ vc link
   วิธีแก้: vc link -> vc env pull -> vc dev

8. อาการ: 403 Forbidden จาก Vercel AI Gateway
   สาเหตุ: OIDC ไม่ได้เปิด หรือโปรเจกต์ Hobby หมดโควต้า
   วิธีแก้: เช็ค Vercel Dashboard -> Settings -> OIDC และ Usage

FAQ / คำถามที่พบบ่อย
--------------------
Q: ใช้กับ OpenAI API Key ตรงๆได้ไหม?
A: ได้ แต่แนะนำใช้ผ่าน Vercel AI Gateway + OIDC เพื่อไม่ต้องเก็บ secret

Q: Excel export ช้าถ้า log เยอะ?
A: ใช้ flag --stream จะเขียนทีละ chunk: python scripts/export_audit.py --stream

Q: ทำไมต้องมี Reviewer Cockpit?
A: ไว้กัน PR ที่เปลี่ยน prompt หรือ logic สำคัญโดยไม่มีคนรีวิว ป้องกัน AI hallucination

Roadmap / แผนพัฒนา
------------------
[ ] v1.1: รองรับ Claude 4 + Muse Spark
[ ] v1.2: Dashboard ดู Audit Log แบบ Realtime
[ ] v1.3: RBAC ผ่าน UI ไม่ต้องแก้.coderabbit.yaml
[ ] v2.0: Multi-tenant สำหรับหลายทีม

Quick Links / ลิงก์ด่วน
------------------------
- Reviewer Notes:./reviewer/reviewer.notes.md
- Reviewer Rules:./reviewer/reviewer.rules.md
- Reviewer Checklist:./reviewer/reviewer.checklist.md
- Reviewer Flow:./reviewer/reviewer.flow.md
- Reviewer Audit:./reviewer/reviewer.audit.md
- Reviewer Actions:./reviewer/reviewer.actions.md
- CHANGELOG:./CHANGELOG.md
- CONTRIBUTING:./CONTRIBUTING.md
- SECURITY:./SECURITY.md

Changelog / ประวัติการอัปเดต
-----------------------------
v1.0.0 - 2026-06-10
- Initial release: AI Gateway + OIDC + Audit Trail
- เพิ่ม Reviewer Cockpit และ Excel Export

Contact / ติดต่อ
-----------------
- Admin: nobizzmaru@gmail.com
- Website: 1napz.github.io/crystalcastle
- Issues: GitHub Issues

License
-------
MIT License © 2026 Zyntro — ดูรายละเอียดที่ LICENSE

---

Contributions are welcome! Feel free to open issues or submit pull requests to enhance functionality or fix bugs.
