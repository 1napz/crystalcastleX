`markdown

Handling Unsafe Issues 🚨

ภาษาไทย
บางครั้ง GitHub อาจ flag issue ว่า Unsafe content ซึ่งหมายความว่าเนื้อหาภายในอาจมีข้อมูลที่ไม่ปลอดภัย เช่น:
- API keys หรือ credentials จริง
- เนื้อหาที่ละเมิด policy ของ GitHub
- โค้ดหรือข้อความที่เสี่ยงต่อความปลอดภัย

ขั้นตอนการจัดการ
1. เปิด issue บน GitHub โดยตรงเพื่อตรวจสอบเนื้อหาที่ถูก flag
2. หากพบข้อมูล sensitive → ต้องลบออกทันที และแจ้ง contributor
3. ห้าม copy เนื้อหาที่ถูก flag ลง commit หรือ PR
4. Reviewer ต้องบันทึกผลการตรวจสอบใน reviewer.notes.md
5. หากเป็น bug หรือ feature request ที่ถูก flag → ย้ายไป project board ที่เหมาะสมหลังจากแก้ไขเนื้อหาแล้ว

---

English
Sometimes GitHub may flag an issue as Unsafe content, meaning the content may contain:
- Actual API keys or credentials
- Content violating GitHub policies
- Code or text that poses security risks

Steps to handle
1. Open the issue directly on GitHub to review flagged content
2. If sensitive data is found → remove immediately and notify the contributor
3. Do not copy flagged content into commits or PRs
4. Reviewer should document the resolution in reviewer.notes.md
5. If the issue is a bug or feature request flagged as unsafe → move it to the appropriate project board after sanitizing the content

---
