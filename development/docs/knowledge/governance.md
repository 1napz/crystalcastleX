# 🛡 Governance & Reviewer Guidelines (TH/EN)

## 🇹🇭 แนวทางการรีวิว (Thai)
เอกสารนี้กำหนดกฎและขั้นตอนสำหรับการรีวิว Pull Request และการทำงานร่วมกัน:
- [Reviewer Swimlane](ca://s?q=Reviewer_swimlane_diagram) → แบ่งบทบาทผู้รีวิวตามความเชี่ยวชาญ
- [CI/CD Hooks](ca://s?q=CI_CD_hooks_in_GitHub) → ตรวจสอบอัตโนมัติก่อน merge
- [Decision Flow](ca://s?q=Decision_flow_in_pull_requests) → ขั้นตอนการตัดสินใจ
- [Performance Gap Analysis](ca://s?q=Performance_gap_analysis_in_CI_CD) → ตรวจสอบช่องว่างประสิทธิภาพ

### กฎหลัก
- ทุก PR ต้องมี Reviewer อย่างน้อย 1 คน
- ใช้ Pre-commit Hooks เพื่อป้องกัน error
- Reviewer ต้องตรวจสอบทั้งโค้ดและเอกสาร
- Merge ได้ก็ต่อเมื่อ CI/CD ผ่านทั้งหมด

---

## 🇬🇧 Reviewer Guidelines (English)
This document defines rules and processes for pull request reviews and collaboration:
- [Reviewer Swimlane](ca://s?q=Reviewer_swimlane_diagram) → Assign reviewers by expertise
- [CI/CD Hooks](ca://s?q=CI_CD_hooks_in_GitHub) → Automated checks before merge
- [Decision Flow](ca://s?q=Decision_flow_in_pull_requests) → Step-by-step decision process
- [Performance Gap Analysis](ca://s?q=Performance_gap_analysis_in_CI_CD) → Identify efficiency gaps

### Core Rules
- Every PR must have at least one reviewer
- Pre-commit hooks required to prevent errors
- Reviewers check both code and documentation
- Merge allowed only if all CI/CD checks pass

---

## 📂 Usage
- Place this file in `docs/knowledge/governance.md`
- Keep bilingual sections aligned
- Update swimlane diagrams in `docs/knowledge/diagrams/`
- Commit with clear governance messages:
  ```bash
  git commit -m "docs: add governance guidelines (TH/EN)"
