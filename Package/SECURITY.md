# 🔒 Security Policy

## Supported Versions
เราสนับสนุนเฉพาะ branch หลัก (`main`) และ release ล่าสุดเท่านั้น  
เวอร์ชันที่เก่ากว่านี้อาจไม่ได้รับการอัปเดตด้านความปลอดภัย

| Version | Supported |
|---------|-----------|
| main    | ✅ |
| old     | ❌ |

---

## Reporting a Vulnerability
หากคุณพบช่องโหว่หรือปัญหาด้านความปลอดภัย:
1. **ห้ามเปิดเผยในที่สาธารณะทันที**
2. ส่งรายงานไปที่ **nobizzmaru@gmail.com**
3. ระบุรายละเอียด:
   - เวอร์ชันที่ใช้งาน
   - ขั้นตอนการ reproduce
   - ผลกระทบที่คาดว่าจะเกิดขึ้น

ทีมจะตอบกลับภายใน **72 ชั่วโมง** และแจ้ง timeline การแก้ไข

---

## Security Practices
- **RBAC**: Reviewer / Admin / Agent มีสิทธิ์แยกชัดเจน  
- **MFA**: แนะนำให้เปิดใช้งาน Multi-Factor Authentication ทุกบัญชี  
- **Audit Trail**: ทุก commit/test/deploy มี log ย้อนหลังได้  
- **Secret Scan**: ตรวจสอบ secrets อัตโนมัติทุก push  
- **CodeQL**: ใช้ GitHub CodeQL ตรวจสอบช่องโหว่ในโค้ดทุก PR  

---

## Disclosure Policy
- ช่องโหว่ที่มี **Severity สูง** จะถูกแก้ไขก่อน deploy  
- หากพบการโจมตีจริง ทีมจะ **หยุดการ merge** และแจ้งเตือน community  
- เราจะเผยแพร่รายละเอียดช่องโหว่หลังจากแก้ไขเรียบร้อยแล้วเท่านั้น