# CrystalCastle Reviewer Training Guide

## 🎯 Objective
คู่มือนี้ถูกสร้างขึ้นเพื่อช่วย Reviewer ใหม่เข้าใจขั้นตอนการตรวจสอบ Pull Request (PR) ใน CrystalCastle โดยเน้นที่ **repo hygiene**, **security enforcement**, และ **workflow compliance**.

---

## 📋 Reviewer Workflow

### 1. ตรวจสอบ PR Hygiene
- [ ] PR title & description ต้องชัดเจน
- [ ] Linked issue/reference ครบถ้วน
- [ ] ไม่มี secrets หรือ API keys ใน commit
- [ ] ใช้ mock mode สำหรับการทดสอบ

### 2. ตรวจสอบ Security & Governance
- [ ] Supabase RLS เปิดใช้งานทุกตาราง
- [ ] CSP headers ถูกตั้งค่า
- [ ] Rate limiting ผ่าน Upstash หรือเทียบเท่า
- [ ] GitHub secret scanning ผ่าน

### 3. ตรวจสอบ Workflow & Automation
- [ ] CI/CD workflows ผ่าน GitHub Actions สำเร็จ
- [ ] Auto-comment bot ทำงานถูกต้อง
- [ ] CodeRabbitAI config (.coderabbit.yaml) ถูกต้อง
- [ ] Kanban board sync กับ CI/CD

### 4. ตรวจสอบ Documentation & Repo Hygiene
- [ ] README.md อัปเดตตามฟีเจอร์ใหม่
- [ ] Environment variables อธิบายครบถ้วน
- [ ] Reviewer notes อัปเดต
- [ ] Release notes & changelog มี transparency

---

## 🛡 Governance Enforcement

### `.coderabbit.yaml`
- บังคับให้ **ทุก PR** ต้อง tick checklist ก่อน merge
- PR จาก bot (เช่น `coderabbitai[bot]`) ต้องมี human reviewer ตรวจสอบ
- Secret scanning จะบล็อก PR ที่มี API keys หรือ secrets

### Auto-comment Bot
- GitHub Action จะโพสต์ Reviewer Checklist ลงในทุก PR
- Reviewer ต้อง tick checklist ใน PR comment ก่อน merge

---

## ✅ Reviewer Responsibilities
- ทำการ review ตาม checklist ทุกครั้ง
- หากข้อใดไม่ผ่าน → ต้อง request changes พร้อมเหตุผล
- ยืนยันว่า Vercel deployment สำเร็จ
- ตรวจสอบว่า unit tests ครอบคลุมการเปลี่ยนแปลง
- อัปเดต reviewer notes หากมีการเปลี่ยนแปลง workflow

---

## 📌 Summary
Reviewer มีหน้าที่หลักในการ:
1. รักษา **repo hygiene**
2. บังคับใช้ **security & governance**
3. ตรวจสอบ **workflow compliance**
4. อัปเดต **documentation**

Checklist และ `.coderabbit.yaml` จะช่วย enforce ให้ทุก PR มีคุณภาพและปลอดภัยก่อน merge