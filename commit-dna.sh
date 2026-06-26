#!/usr/bin/env bash
# commit-dna.sh — วางที่ root ของ repo แล้วรัน
set -e

# 1. สร้างโฟลเดอร์ถ้ายังไม่มี
mkdir -p knowledge

# 2. copy ไฟล์ (ถ้า run script จากโฟลเดอร์เดียวกับ project-dna.md)
# cp project-dna.md knowledge/project-dna.md

# 3. stage + commit + push
git add knowledge/project-dna.md
git commit -m "docs: initialize core project dna framework [skip ci]"
git push origin main

echo "✅ project-dna.md committed and pushed"
