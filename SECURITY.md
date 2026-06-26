# Security Policy

## Supported Versions

เราจะอัปเดตแพตช์ความปลอดภัยให้กับเวอร์ชันเหล่านี้เท่านั้น

| Version | Supported |
| --- | --- |
| main | ✅ |
| < 1.0 | ❌ |

หมายเหตุ: โปรเจกต์นี้ยังเป็น Private/Experimental ใช้ส่วนตัว

## Reporting a Vulnerability

หากคุณพบช่องโหว่ด้านความปลอดภัย กรุณา **อย่าเปิดเป็น Public Issue** 

**ช่องทางรายงานที่แนะนำ:**
1. เปิดผ่าน [GitHub Security Advisory](../../security/advisories/new) - วิธีนี้ปลอดภัยที่สุด
2. หากฉุกเฉินมาก ติดต่อ: security@yourdomain.com

**สิ่งที่ควรรายงาน:** XSS, SQL Injection, ข้อมูลรั่วไหล, API Key/Token หลุด, RCE, Auth Bypass

**กระบวนการของเรา:**
1. เราจะตอบรับรายงานของคุณภายใน **48 ชั่วโมง**
2. เราจะอัปเดตความคืบหน้าให้คุณทุกๆ 5 วันทำการ จนกว่าจะแก้ไขเสร็จ
3. เมื่อแก้เสร็จ เราจะให้เครดิตคุณใน release notes หากคุณต้องการ

ขอบคุณที่ช่วยทำให้โปรเจกต์ปลอดภัยขึ้น

## Disclosure Policy

เรายึดหลัก Coordinated Disclosure ขอความกรุณาให้เวลาเรา 90 วันในการแก้ไขก่อนเปิดเผยสู่สาธารณะ

## Out of Scope

เราไม่รับรายงานสำหรับปัญหาประเภทนี้:
- Rate limiting หรือ DoS ที่ไม่กระทบข้อมูล
- ปัญหาที่ต้องเข้าถึงเครื่องของ user โดยตรง (Physical access)
- Social engineering, Phishing
- ช่องโหว่ใน dependency ที่ยังไม่มีแพตช์จากต้นทาง
- Best practice ที่หายไป แต่ยัง exploit ไม่ได้ เช่น missing header
