# 🚀 Onboarding Guide (CrystalCastle)

## 1. Environment Setup / การตั้งค่า Environment
**English:**  
- Clone the repository: `git clone https://github.com/1napz/crystalcastle.git`  
- Install dependencies: `npm install`  
- Copy `.env.example` → `.env.local` and fill in required values.  

**ไทย:**  
- โคลน repository: `git clone https://github.com/1napz/crystalcastle.git`  
- ติดตั้ง dependencies: `npm install`  
- คัดลอก `.env.example` → `.env.local` และกรอกค่า environment ที่จำเป็น  

---

## 2. Branch Convention / การตั้งชื่อ Branch
**English:**  
- `feature/<name>` → new features  
- `fix/<name>` → bug fixes  
- `docs/<name>` → documentation updates  

**ไทย:**  
- `feature/<ชื่อ>` → ฟีเจอร์ใหม่  
- `fix/<ชื่อ>` → แก้บั๊ก  
- `docs/<ชื่อ>` → อัปเดตเอกสาร  

---

## 3. Running CI/CD / การรัน CI/CD
**English:**  
- Run lint: `npm run lint`  
- Run tests: `npm test`  
- Build project: `npm run build`  

**ไทย:**  
- รัน lint: `npm run lint`  
- รัน test: `npm test`  
- สร้าง build: `npm run build`  

---

## 4. Pull Request Workflow / ขั้นตอนการทำ PR
**English:**  
1. Ensure CI/CD passes locally.  
2. Fill PR template completely.  
3. Link related issues.  
4. Wait for reviewer approval.  

**ไทย:**  
1. ตรวจสอบให้ CI/CD ผ่านในเครื่องก่อน  
2. กรอก PR template ให้ครบถ้วน  
3. เชื่อมโยงกับ Issue ที่เกี่ยวข้อง  
4. รอ reviewer อนุมัติ  

---

## 5. Troubleshooting / การแก้ปัญหา
**English:**  
- Merge conflict → run `git fetch origin main && git rebase origin/main`  
- CI/CD fail → check logs in GitHub Actions  
- Coverage < 80% → add more unit tests  

**ไทย:**  
- Merge conflict → ใช้คำสั่ง `git fetch origin main && git rebase origin/main`  
- CI/CD fail → ตรวจสอบ logs ใน GitHub Actions  
- Coverage < 80% → เพิ่ม unit tests ให้ครอบคลุมมากขึ้น

📊 Contributor Onboarding Flow Diagram

`mermaid
flowchart TD
    A[👥 Contributor joins CrystalCastle] --> B[📂 Clone Repository]
    B --> C[🖥️ Open in VS Code + Devcontainer]
    C --> D{✅ Health Check Pass?}
    D -- Yes --> E[🔑 Configure Secrets]
    D -- No --> F[⚠️ Recovery Container + Reviewer Enforcement]

    E --> G[📋 Reviewer Checklist]
    G --> H[📝 Reviewer Expectations]
    H --> I[🎉 Contributor Ready for Development]
`

---

🇹🇭 ภาษาไทย

ขั้นตอนการ Onboarding
1. Clone repo → git clone https://github.com/1napz/crystalcastle.git  
2. เปิดด้วย VS Code + Devcontainer (javascript-node:20)  
3. ตรวจสอบ Health Check (runArgs)  
   - ถ้า fail → ใช้ recovery container และ reviewer ตรวจสอบ log  
4. ตั้งค่า Secrets (NEXTPUBLICSUPABASEURL, NEXTPUBLICSUPABASEANONKEY, GROQAPI_KEY)  
5. Reviewer ใช้ checklist ตรวจสอบ repo hygiene  
6. Contributor พร้อมเริ่มพัฒนา  

---

🇬🇧 English

Onboarding Steps
1. Clone repo → git clone https://github.com/1napz/crystalcastle.git  
2. Open with VS Code + Devcontainer (javascript-node:20)  
3. Verify Health Check (runArgs)  
   - If fail → recovery container triggered, reviewer checks logs  
4. Configure Secrets (NEXTPUBLICSUPABASEURL, NEXTPUBLICSUPABASEANONKEY, GROQAPI_KEY)  
5. Reviewer applies checklist for repo hygiene enforcement  
6. Contributor ready for development  

---