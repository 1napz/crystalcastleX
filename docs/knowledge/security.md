# 🔐 Security Fundamentals (TH/EN)

## 🇹🇭 ความปลอดภัยเบื้องต้น (Thai)
เอกสารนี้ใช้เพื่ออธิบายแนวทางและหลักการด้านความปลอดภัยสำหรับโปรเจกต์:
- [Supported Versions](ca://s?q=Supported_versions_in_security_policy) → ระบุเวอร์ชันที่ยังได้รับการดูแล
- [Reporting Vulnerabilities](ca://s?q=Reporting_vulnerabilities_in_GitHub) → วิธีแจ้งช่องโหว่
- [Out of Scope](ca://s?q=Out_of_scope_security_issues) → สิ่งที่ไม่ครอบคลุม

### หลักการสำคัญ
- ใช้ **Encryption** (AES/RSA) สำหรับข้อมูลสำคัญ  
- หลีกเลี่ยงการเก็บ **API Keys** ในโค้ดโดยตรง  
- ใช้ **Pre-commit Hooks** เพื่อตรวจสอบความปลอดภัยก่อน push  
- ตอบกลับการแจ้งช่องโหว่ภายใน 48 ชั่วโมง  

---

## 🇬🇧 Security Overview (English)
This document outlines security principles and practices for the project:
- [Supported Versions](ca://s?q=Supported_versions_in_security_policy) → Define maintained versions
- [Reporting Vulnerabilities](ca://s?q=Reporting_vulnerabilities_in_GitHub) → How to report issues
- [Out of Scope](ca://s?q=Out_of_scope_security_issues) → What is excluded

### Core Principles
- Use **Encryption** (AES/RSA) for sensitive data  
- Avoid storing **API Keys** directly in code  
- Implement **Pre-commit Hooks** for security checks before push  
- Respond to vulnerability reports within 48 hours  

---

## 📂 Usage
- Place this file in `docs/knowledge/security.md`  
- Keep bilingual sections aligned (Thai/English)  
- Reference this doc in CI/CD workflows for automated checks  
- Commit with clear security messages:  
  ```bash
  git commit -m "docs: add security fundamentals (TH/EN)"
