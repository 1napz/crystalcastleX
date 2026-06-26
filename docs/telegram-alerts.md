# 📢 Telegram Alerts (CrystalCastle)

## Purpose / วัตถุประสงค์
**English:**  
This document defines the bilingual (Thai/English) alert messages used in Telegram notifications for CrystalCastle workflows.  
**ไทย:**  
เอกสารนี้กำหนดข้อความแจ้งเตือนสองภาษา (ไทย/อังกฤษ) ที่ใช้ใน Telegram สำหรับ workflow ของ CrystalCastle  

---

## 🔴 Critical / วิกฤติ
**English:**  
🚨 CrystalCastle Alert: Workflow **FAILED** at `${{ github.job }}` (commit: `${{ github.sha }}`)  
**ไทย:**  
🚨 แจ้งเตือน CrystalCastle: Workflow **ล้มเหลว** ที่ `${{ github.job }}` (commit: `${{ github.sha }}`)  

---

## 🟡 Warning / เตือน
**English:**  
⚠️ CrystalCastle Alert: Rate limit approaching for `${{ github.workflow }}`  
**ไทย:**  
⚠️ แจ้งเตือน CrystalCastle: กำลังใกล้ถึง limit สำหรับ `${{ github.workflow }}`  

---

## 🟢 Info / ข้อมูล
**English:**  
ℹ️ CrystalCastle Info: Workflow `${{ github.workflow }}` completed successfully  
**ไทย:**  
ℹ️ ข้อมูล CrystalCastle: Workflow `${{ github.workflow }}` สำเร็จเรียบร้อยแล้ว  

---

## 🔒 Implementation Notes / หมายเหตุการใช้งาน
- All alerts must include **both English and Thai** in the same message.  
- Use **emoji** to indicate severity (🚨 Critical, ⚠️ Warning, ℹ️ Info).  
- Secrets (`TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID`) must be stored in GitHub Secrets.  
- Example snippet for GitHub Actions:

```yaml
- name: Send Telegram Alert (Bilingual)
  run: |
    curl -s -X POST https://api.telegram.org/bot${{ secrets.TELEGRAM_TOKEN }}/sendMessage \
      -d chat_id=${{ secrets.TELEGRAM_CHAT_ID }} \
      -d text="🚨 CrystalCastle Alert: Workflow ล้มเหลว / FAILED at ${{ github.job }} (commit: ${{ github.sha }})"