🔀 Merge Strategy Guideline

เพื่อให้ commit history ของ Repo สะอาดและอ่านง่าย ทีมควรเลือก merge strategy ตามสถานการณ์

## 1. Normal Merge

**คำสั่ง:**
```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

**ใช้เมื่อ:**
- Branch ย่อยมี commit ที่มีความหมายชัดเจน
- ต้องการเก็บรายละเอียดการพัฒนาไว้ครบทุก commit

**ผลลัพธ์:**
- มี commit merge เพิ่มเข้ามา
- commit ย่อยทั้งหมดจาก branch ย่อยถูกเก็บไว้ใน history

---

## 2. Squash Merge

**คำสั่ง:**
```bash
git checkout main
git pull origin main
git merge --squash develop
git commit -m "feat(workflow): integrate develop branch changes as single commit"
git push origin main
```

**ใช้เมื่อ:**
- Branch ย่อยมี commit จำนวนมาก (เช่น WIP, แก้ไขเล็ก ๆ)
- ต้องการให้ history ของ main สะอาดและกระชับ

**ผลลัพธ์:**
- รวม commit ของ branch ย่อยเป็น commit เดียวใน main
- ลด commit noise และทำให้ history อ่านง่าย

---

## 3. Fast-forward Merge

**คำสั่ง:**
```bash
git checkout main
git pull origin main
git merge --ff-only develop
git push origin main
```

**ใช้เมื่อ:**
- Branch develop ยังไม่ diverge จาก main (ไม่มี commit แยก)
- ต้องการ history ต่อเนื่องโดยไม่มี commit merge เพิ่ม

**ผลลัพธ์:**
- ไม่มี commit merge เพิ่ม
- history main ต่อเนื่องเหมือน develop ถูก "เลื่อน" เข้ามาโดยตรง

---

## 💡 แนวทางการเลือก

| Strategy | Use Case | Best For |
|----------|----------|----------|
| **Normal Merge** | เก็บรายละเอียดทุก commit | งานที่ต้องการ trace ย้อนหลัง |
| **Squash Merge** | รวมเป็น commit เดียว | branch ที่มี commit ย่อยเยอะหรือ WIP |
| **Fast-forward Merge** | history สะอาดที่สุด | develop ยังไม่ diverge จาก main |

---

## 🔗 See Also

- [Contributing Guidelines](../CONTRIBUTING.md) - Full contribution workflow
- [Governance Summary](../CONTRIBUTING.md#-governance-summary) - PR review and merge process
