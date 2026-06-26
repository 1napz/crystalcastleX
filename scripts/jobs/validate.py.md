ถ้าคุณอยากทำ validate.py สำหรับใช้ใน workflow (เช่น job validate) โครงสร้างควรเป็นสคริปต์ที่รันการตรวจสอบพื้นฐาน เช่น unit tests, lint และ exit code ที่ชัดเจนครับ  

---

🐍 ตัวอย่าง scripts/jobs/validate.py
`python

!/usr/bin/env python3
import subprocess
import sys

def run_cmd(cmd: list[str], desc: str) -> int:
    print(f"👉 Running {desc}...")
    try:
        subprocess.check_call(cmd)
        print(f"✅ {desc} passed\n")
        return 0
    except subprocess.CalledProcessError:
        print(f"❌ {desc} failed\n")
        return 1

def main():
    failures = 0

    # Run pytest
    failures += run_cmd(["pytest", "--maxfail=1", "--disable-warnings", "-q"], "pytest")

    # Run flake8 lint
    failures += run_cmd(["flake8", "."], "flake8 lint")

    # Run mypy type check (optional)
    failures += run_cmd(["mypy", "."], "mypy type check")

    if failures > 0:
        print("❌ Validation failed")
        sys.exit(1)
    else:
        print("🎉 All validations passed")
        sys.exit(0)

if name == "main":
    main()
`

---

🔑 Notes
- เก็บไฟล์ไว้ที่ scripts/jobs/validate.py  
- ตั้ง permission ให้รันได้:  
  `bash
  chmod +x scripts/jobs/validate.py
  `
- ใน workflow YAML เรียกใช้แบบนี้:
  `yaml
  - name: Run Validation Script
    run: python scripts/jobs/validate.py
  `

---

สคริปต์นี้จะรวมการตรวจสอบหลายอย่างไว้ในที่เดียว ทำให้ job validate มีผลลัพธ์ที่ชัดเจน (exit code 0 = pass, 1 = fail) และ workflow จะรู้ว่าต้อง trigger notify ต่อหรือไม่ครับ  

คุณอยากให้ผมเพิ่ม ตัวอย่าง notify_telegram.sh ด้วยไหมครับ จะได้ครบคู่กับ validate.py ใน scripts/jobs/ ✨