# Contributor Onboarding – Crystal Castle (Advanced Mode)

## ✅ Checklist
1. **Clone Repo**
   - Run `./setup.sh` (อ่าน config จาก `setup-config/clone.yml`)
   - ถ้ามีไฟล์ `Performance.md.gpg` → จะถูกถอดรหัสอัตโนมัติ

2. **Create Branch**
   - ใช้ชื่อ branch ตาม pattern: `feature/<short-description>` หรือ `fix/<short-description>`

3. **Make Changes**
   - ปรับปรุงโค้ด, docs, หรือ config ตามที่ต้องการ
   - ตรวจสอบว่าไม่มี unsafe link หรือ secret รั่ว

4. **Run Local Validation**
   - `npm run lint`
   - `npm run test`
   - ตรวจสอบ schema ด้วย `yamllint` หรือ `jsonschema`

5. **Commit & Push**
   - ใช้ commit message ที่ชัดเจน เช่น `feat: add video logging`
   - Push ไปยัง branch ของคุณ

6. **Open Pull Request**
   - Target → `main`
   - ต้องมี review จาก **@1napz** และ **@supabase**

7. **CI/CD Validation**
   - Workflow จะรัน build, lint, tests, security scan
   - ถ้าไม่ผ่าน → PR จะถูก block

8. **Merge**
   - เมื่อผ่านทุก validation และ review → merge เข้าสู่ `main`

---

## 🔎 Visual Flow

```mermaid
flowchart TD
    A[Clone Repo via setup.sh] --> B[Create Feature Branch]
    B --> C[Make Changes]
    C --> D[Run Local Validation]
    D --> E[Commit & Push]
    E --> F[Open Pull Request]
    F --> G[CI/CD Workflow Validation]
    G --> H{Validation Passed?}
    H -->|Yes| I[Review by Owners]
    H -->|No| J[Fix Issues & Retry]
    I --> K{Approved by 1napz + Supabase?}
    K -->|Yes| L[Merge to Main]
    K -->|No| M[Wait for Review]
    L --> N[Release Workflow Triggered]

## 🔒 Privacy Governance Flow

Crystal Castle ใช้ **first-party telemetry** เท่านั้น เพื่อปรับปรุงคุณภาพและความปลอดภัยของระบบ  
ข้อมูลที่เก็บจะถูกใช้เฉพาะภายใน ไม่แชร์กับบุคคลที่สาม

### 📊 ข้อมูลที่เก็บ
- Workflow runs (สถานะการทำงานของ GitHub Actions)  
- Error reports (บันทึกข้อผิดพลาด)  
- Contributor activity (commit, PR, issue activity)  
- Performance metrics (เวลา build/test, ความเร็วตอบสนอง)  

### 🚫 สิ่งที่ไม่เก็บ
- ข้อมูลระบุตัวบุคคล (PII)  
- ข้อมูลโฆษณา  
- การติดตามข้ามเว็บไซต์  

### 🔒 ความปลอดภัย
- Logs ถูกเก็บสูงสุด 90 วัน  
- ข้อมูลทั้งหมดถูกเข้ารหัส  
- การเข้าถึงจำกัดเฉพาะ maintainer ที่ได้รับสิทธิ์  

### 📖 ความโปร่งใส
- รายละเอียดนโยบายอยู่ใน [`docs/privacy.md`](./docs/privacy.md)  
- Contributor ทุกคนต้องยอมรับนโยบายนี้เมื่อมีส่วนร่วม  

---

### 🔎 Visual Flow

```mermaid
flowchart TD
    A[Contributor Action] --> B[Telemetry Collection]
    B --> C[Workflow Logs & Error Reports]
    C --> D[Retention Policy - 90 days]
    D --> E[Encryption & Secure Storage]
    E --> F[Restricted Access by Maintainers]
    F --> G[Audit Trail & Transparency]
    G --> H[Improvement of QA & CI/CD]