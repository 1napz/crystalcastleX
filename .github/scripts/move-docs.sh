#!/bin/bash
# move-docs.sh
# ย้ายไฟล์จาก doc/ ไป docs/ และ push ขึ้น GitHub

cd "$(git rev-parse --show-toplevel)" || exit 1

# สร้างโฟลเดอร์ docs ถ้ายังไม่มี
[ ! -d "docs" ] && mkdir docs

# ย้ายไฟล์ทั้งหมด
git mv doc/* docs/

# ลบโฟลเดอร์ doc ถ้าว่าง
rmdir doc 2>/dev/null

# commit และ push
git commit -m "Move documentation files from doc/ to docs/"
git push origin main