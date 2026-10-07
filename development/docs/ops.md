# Path Scan Automation

ระบบนี้สแกนหา absolute path ใน repository แล้วรายงานผลผ่าน PR comment, artifact, หรือ PR ที่สร้างอัตโนมัติเมื่อไฟล์จำเป็นยังไม่มี

## ทำงานยังไง
- รันบน pull request
- รันตาม schedule
- รัน manual ได้
- สแกน repo ทั้งหมด
- ถ้าไม่มี CODEOWNERS จะสร้าง PR template ให้ทีม review

## ไฟล์ที่เกี่ยวข้อง
- `scripts/scan_paths.py` — scanner หลัก
- `tests/test_scan.py` — mock tests
- `.github/workflows/check-absolute-paths.yml` — CI workflow
- `CODEOWNERS` — mapping เจ้าของไฟล์

## สิ่งที่ทีมต้องเตรียม
- ตั้ง `CODEOWNERS`
- ตรวจให้ workflow มีสิทธิ์ `contents: write`
- ถ้าจะส่งไป ClickUp ให้ตั้ง `CLICKUP_TOKEN`
- ถ้าจะใช้ GitHub Issues ให้ใช้ `GITHUB_TOKEN` หรือ PAT ตามสิทธิ์ที่ต้องการ

## ผลลัพธ์
- `path_report.md`
- `path_report.json`
- PR comment
- PR label: `automation`, `path-scan`

## ขั้นตอนใช้งาน
1. วางไฟล์ลง repo
2. Push ขึ้น GitHub
3. เปิด PR
4. ดูผลจาก comment และ artifact
5. ถ้าไม่มี `CODEOWNERS`, workflow จะสร้าง PR template ให้ review

## การดูแล
- ปรับ regex ใน `scripts/scan_paths.py` ถ้าพบ false positive
- เพิ่ม rules ใน `CODEOWNERS`
- เพิ่ม labels หรือ assignees ตามทีม