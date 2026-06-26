# ✅ Reviewer Checklist / เช็คลิสต์สำหรับผู้ตรวจสอบ

## 🔎 Environment Variables / ตัวแปรสภาพแวดล้อม
- [ ] `.env.local` ต้องมี `FAL_KEY` และ `MAGIC_HOUR_API_KEY`  
- [ ] ตรวจสอบว่า key ถูกต้องและไม่หมดอายุ  

---

## 🎥 Video Engines / ระบบสร้างวิดีโอ
- [ ] **FAL Engine** ใช้ endpoint ที่ถูกต้อง:  
  `fal.run/fal-ai/kling-video/v2/master/image-to-video`  
- [ ] Payload ของ FAL: `duration` เป็น string, `aspect_ratio = "9:16"`  
- [ ] **Magic Hour Engine** ใช้ workflow async:  
  Upload → Job Creation → Polling → Download  

---

## 📚 Documentation / เอกสาร
- [ ] Docstring coverage ≥ 80% (ปัจจุบัน 85%)  
- [ ] Docstring bilingual (English + Thai)  
- [ ] `README.md` มี Quick Start bilingual block  
- [ ] `CHANGELOG.md` มี entry ล่าสุด (รวม PR ที่ merge แล้ว)  
- [ ] `RELEASE_NOTES.md` bilingual + Reviewer Impact section  

---

## 🔒 Governance Enforcement / การบังคับใช้กฎระเบียบ
- [ ] `.coderabbit.yaml` อัปเดตเป็น schema v2 และ validate ผ่าน  
- [ ] Branch naming rules: `feature/*`, `fix/*`, `docs/*`, `chore/*`  
- [ ] Auto-comment bilingual reminders ทำงานถูกต้อง  

---

## ⚙️ CI/CD Workflows
- [ ] มี lint/test/build/deploy pipelines ครบถ้วน  
- [ ] มี security scan workflow  
- [ ] มี governance enforcement workflow  

---

## 📋 Reviewer Impact / ผลกระทบต่อผู้ตรวจสอบ
- [ ] ตรวจสอบว่า fallback chain (FAL → Magic Hour) ทำงานได้จริง  
- [ ] บังคับใช้ bilingual docstring coverage ก่อนอนุมัติ  
- [ ] ยืนยันว่า `.coderabbit.yaml` ใช้ schema v2  
- [ ] ตรวจสอบว่า PR title อธิบาย fallback + governance enforcement  
- [ ] ยืนยันว่ามี changelog entry และ release notes ครบถ้วน  

---

## 📊 Reviewer Checklist Flow (Mermaid)

```mermaid
flowchart TD

A[เริ่มตรวจสอบ Pull Request] --> B[ตรวจสอบ Environment Variables]
B --> B1{มี .env.local หรือไม่?}
B1 -->|ใช่| B2[ตรวจสอบ FAL_KEY และ MAGIC_HOUR_API_KEY]
B1 -->|ไม่| X[⚠️ ต้องเพิ่ม .env.local]

A --> C[ตรวจสอบ Video Engines]
C --> C1[FAL Endpoint ถูกต้องตาม spec]
C --> C2[FAL Payload: duration เป็น string, aspect_ratio = "9:16"]
C --> C3[Magic Hour Workflow: upload → job → polling → download]

A --> D[ตรวจสอบ Docstring Coverage]
D --> D1{Coverage ≥ 80%?}
D1 -->|ใช่| D2[✅ ผ่าน]
D1 -->|ไม่| Y[⚠️ ต้องเพิ่ม docstring]

A --> E[ตรวจสอบ Governance Enforcement]
E --> E1[.coderabbit.yaml schema v2]
E --> E2[Branch naming rules ถูกต้อง]
E --> E3[Auto-comment bilingual reminders ทำงาน]

A --> F[ตรวจสอบ CI/CD Workflows]
F --> F1[Lint/Test/Build/Deploy pipelines]
F --> F2[Security Scan]
F --> F3[Governance enforcement workflow]

A --> G[ตรวจสอบ Documentation]
G --> G1[README.md มี Quick Start bilingual block]
G --> G2[CHANGELOG.md มี entry ล่าสุด]
G --> G3[RELEASE_NOTES.md bilingual + Reviewer Impact]

B2 --> H{ทุกข้อผ่านหรือไม่?}
C1 --> H
C2 --> H
C3 --> H
D2 --> H
E1 --> H
E2 --> H
E3 --> H
F1 --> H
F2 --> H
F3 --> H
G1 --> H
G2 --> H
G3 --> H

H -->|ใช่| I[✅ Reviewer อนุมัติ Merge]
H -->|ไม่| J[⚠️ ต้องแก้ไขก่อน Merge]
---

## 📊 Reviewer Checklist Result / ผลลัพธ์การตรวจสอบ

- ระบบจะรัน Checklist ทั้งหมดแบบซ่อนเร้น (hidden enforcement) ผ่าน CI/CD  
- Reviewer cockpit จะเห็นเฉพาะผลรวม เช่น ✅ Passed หรือ ❌ Failed  
- รายละเอียดแต่ละข้อถูกบันทึกไว้ใน log (`version/CrystalCastle/logs/reviewer-checklist.log`) และ artifact (`artifacts/checklist-report.log`)  

### 📝 Example Output (English)
- Reviewer Checklist: 12 checks passed, 2 failed
- Severity Matrix: Critical: 0, Major: 2, Minor: 0

### 📝 ตัวอย่างผลลัพธ์ (ภาษาไทย)
- Reviewer Checklist: ผ่าน 12 ข้อ, ไม่ผ่าน 2 ข้อ
- Severity Matrix: Critical: 0, Major: 2, Minor: 0


---

📌 Quick Reference Cheat Sheet

| Category / หมวดหมู่            | Key Check / สิ่งที่ต้องตรวจสอบ | Next Step / ขั้นตอนถัดไป |
|---------------------------------|---------------------------------|---------------------------|
| Environment Variables       | .env.local มี FALKEY, MAGICHOURAPIKEY | ถ้าไม่มี → เพิ่มไฟล์ .env.local |
| Video Engines               | FAL endpoint + payload, Magic Hour async workflow | ถ้าไม่ตรง spec → แก้ไข config |
| Documentation               | Docstring ≥ 80%, bilingual, README Quick Start, CHANGELOG, RELEASE_NOTES | ถ้าไม่ครบ → เพิ่ม docstring/entry |
| Governance Enforcement      | .coderabbit.yaml schema v2, branch naming, auto-comment bilingual | ถ้าไม่ผ่าน → ปรับ workflow/config |
| CI/CD Workflows             | Lint/Test/Build/Deploy, Security Scan, Governance workflow | ถ้า pipeline ขาด → เพิ่ม workflow |
| Reviewer Impact             | Fallback chain, bilingual docstring, PR title, changelog + release notes | ถ้าไม่ครบ → ปรับ PR + docs |

---

🔑 Usage Notes / หมายเหตุการใช้งาน
- ใช้ Checklist สำหรับการตรวจละเอียด  
- ใช้ Flow Diagram (Mermaid) สำหรับการเห็นภาพรวมขั้นตอน  
- ใช้ Cheat Sheet Table สำหรับการตรวจเร็ว ๆ ก่อนอนุมัติ  

---