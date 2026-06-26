
---

## 📄 5. `doc/security-and-debug.md`

```markdown
# ความปลอดภัยและการ Debug สำหรับ Crystal Castle

## การทดสอบและ Debug

- **Logs บน Vercel:** ดูที่ Dashboard → Functions → เลือก function → Runtime Logs
- **Local Debug:** ใช้ `vercel dev` และเปิด Console ในเบราว์เซอร์
- **GitHub Actions Logs:** ดูที่ repo → Actions → เลือก workflow → `Run details`

## การรักษาความปลอดภัยเพิ่มเติม

- เปิด **Branch protection** สำหรับ branch `main` (ต้องมี PR และ review ก่อน merge)
  - ไปที่ repo → Settings → Branches → Add rule
    - ตั้งชื่อ `main` → ติ๊ก `Require a pull request before merging`
    - เปิด **Secret scanning** ใน GitHub repo
      - Settings → Code security → Secret scanning → Enable
      - ใช้ **pre-commit hook** ตรวจสอบ secrets ก่อน commit
        - ติดตั้ง `detect-secrets` หรือ `git-secrets`
          - ตัวอย่างกับ `detect-secrets`:
              ```bash
                  pip install detect-secrets
                      detect-secrets scan --all-files > .secrets.baseline
                          # ติดตั้ง pre-commit hook (optional)
                              ```
                              - ตรวจสอบ `.gitignore`: ต้องมี `.env`, `.env.local`, `*.log`, `node_modules/` ฯลฯ

                              ## สรุปแนวทางปฏิบัติ

                              | การกระทำ | ความถี่ | หมายเหตุ |
                              |----------|---------|----------|
                              | ตรวจสอบ logs บน Vercel | ทุกครั้งที่ deploy ใหม่ | เพื่อดู error |
                              | รัน `truffleHog` หรือ `detect-secrets` | อย่างน้อยเดือนละครั้ง หรือหลัง merge PR ใหญ่ | ป้องกัน secret leak |
                              | ทดสอบ `vercel dev` ก่อน push | ทุกครั้ง | ป้องกัน syntax error |
                              | ทบทวน Environment Variables | เมื่อเพิ่ม API ใหม่ | อย่า hardcode |