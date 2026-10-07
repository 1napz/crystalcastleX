# CrystalCastle – Reviewer Checklist (TH/EN)

---

## 🇹🇭 Reviewer Checklist
- [ ] ตรวจสอบว่า PR มี **title และ description** ที่ชัดเจน  
- [ ] ตรวจสอบว่า **commit messages** สอดคล้องกับ governance rules  
- [ ] ตรวจสอบว่า workflow มี **explicit permissions block** และ baseline เป็น `read-all`  
- [ ] หากมีการเพิ่ม `write` → ต้องมีเหตุผลชัดเจน และ revert หลังเสร็จงาน  
- [ ] ตรวจสอบว่า **secrets** (เช่น Slack webhook, Supabase key) ถูกตั้งค่าใน repo secrets  
- [ ] ตรวจสอบว่า CI/CD pipeline ผ่านทุก checks (unit test, health check, secret scan)  
- [ ] ตรวจสอบว่าไม่มี **duplicate issue creation** หรือ artifact conflict  
- [ ] ตรวจสอบว่า Supabase backup workflow รันสำเร็จและ artifact ถูกเก็บ  
- [ ] ตรวจสอบว่า reviewer cockpit docs (`docs/worker/reviewer/`) อัปเดตตาม PR ล่าสุด  
- [ ] ตรวจสอบว่า bilingual doc (TH/EN) ครอบคลุม notes, checklist, policy, flow, training  

---

## 🇬🇧 Reviewer Checklist
- [ ] Ensure PR has clear **title and description**  
- [ ] Verify **commit messages** follow governance rules  
- [ ] Confirm workflow has **explicit permissions block** and baseline is `read-all`  
- [ ] If `write` is added → must have clear justification and revert after completion  
- [ ] Verify **secrets** (e.g., Slack webhook, Supabase key) are configured in repo secrets  
- [ ] Ensure CI/CD pipeline passes all checks (unit test, health check, secret scan)  
- [ ] Verify no **duplicate issue creation** or artifact conflict  
- [ ] Confirm Supabase backup workflow runs successfully and artifact is stored  
- [ ] Ensure reviewer cockpit docs (`docs/worker/reviewer/`) are updated with latest PRs  
- [ ] Verify bilingual doc (TH/EN) covers notes, checklist, policy, flow, training  

---

## 📌 Notes
- Reviewer ต้องบันทึกผลการตรวจสอบลงใน `docs/checklists/Reviewer-Notes.md` ทุกครั้ง  
- Reviewer must record verification results in `docs/checklists/Reviewer-Notes.md` each time  
- หากไม่มีการ **Revert → read-all** → ต้องเปิด issue ทันที  
- If **Revert → read-all** is missing → reviewer must open an issue immediately