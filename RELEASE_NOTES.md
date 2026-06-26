# 🚀 CrystalCastle Release Notes – v1.5.0 (2026-05-06)

---

## ✨ Features / ฟีเจอร์ใหม่
- Refactored **FAL → Magic Hour async fallback chain** for video generation  
- Added bilingual auto-comment reminders for reviewers in `.coderabbit.yaml`  
- Improved docstring coverage to **82%** (above 80% threshold)  
- Enhanced governance flow documentation (`workflows/GovernanceFlow.md`)  

---

## 🛠️ Fixes / การแก้ไขบั๊ก
- Corrected FAL endpoint to official spec:  
  `fal.run/fal-ai/kling-video/v2/master/image-to-video`  
- Adjusted FAL payload: `duration` must be string, `aspect_ratio` set to `"9:16"`  
- Rewrote Magic Hour workflow: image upload → job creation → polling → download final video  
- Removed deprecated keys from `.coderabbit.yaml` (`version`, `comment_template`, `scopes`)  

---

## 📚 Docs / เอกสาร
- Added bilingual docstrings to `generate-videos.js` functions  
- Updated reviewer checklist in `workflows/ReviewerChecklist.md`  
- Expanded onboarding guide (`workflows/Onboarding.md`) with Copilot CLI setup  
- Governance flow diagram (`workflows/GovernanceFlow.md`) now bilingual ASCII chart  

---

## 🔒 Governance / การบังคับใช้กฎระเบียบ
- `.coderabbit.yaml` updated to schema v2 with auto-comment enforcement  
- Branch naming rules enforced (`feature/*`, `fix/*`, `docs/*`, `chore/*`)  
- Reviewer checklist requires:  
  - `.env.local` includes `FAL_KEY` and `MAGIC_HOUR_API_KEY`  
  - Docstring coverage ≥ 80%  
  - API endpoints match official specs  
- CI/CD workflows auto-check technical compliance (`.github/workflows/`)  

---

## 📋 Reviewer Impact / ผลกระทบต่อผู้ตรวจสอบ
- Reviewers must verify fallback chain works (FAL → Magic Hour)  
- Reviewers must enforce bilingual docstring coverage before approval  
- Reviewers must confirm `.coderabbit.yaml` validates against schema v2  
- Reviewers must ensure changelog entry is present in PR  

---

## 🌐 Next Steps / ขั้นตอนถัดไป
- Contributors follow onboarding guide (`workflows/Onboarding.md`)  
- Reviewers enforce governance flow (`workflows/GovernanceFlow.md`)  
- CI/CD workflows auto-check technical compliance before deploy