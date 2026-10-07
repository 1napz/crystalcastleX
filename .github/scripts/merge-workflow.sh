#!/bin/bash
# merge-workflow.sh - รวม workflow หลายไฟล์เข้าด้วยกัน

WORKFLOW_DIR=".github/workflows"
MAIN_WORKFLOW="auto-everything.yml"

echo "🔧 Merging workflows..."

# สร้าง header
cat > "$WORKFLOW_DIR/$MAIN_WORKFLOW" << 'HEADER'
name: 🤖 Auto Everything (Merged)
on:
  push:
    branches: [main, develop]
  pull_request:
  workflow_dispatch:

jobs:
HEADER

# รวมทุกไฟล์ .yml ยกเว้นไฟล์หลัก
for file in "$WORKFLOW_DIR"/*.yml; do
  filename=$(basename "$file")
  if [ "$filename" != "$MAIN_WORKFLOW" ]; then
    echo "  📄 Adding: $filename"
    # ดึงเฉพาะส่วน jobs (ตัด header ออก)
    sed -n '/^jobs:/,$p' "$file" | sed '1d' >> "$WORKFLOW_DIR/$MAIN_WORKFLOW"
    echo "" >> "$WORKFLOW_DIR/$MAIN_WORKFLOW"
  fi
done

echo "✅ Merged into: $WORKFLOW_DIR/$MAIN_WORKFLOW"

