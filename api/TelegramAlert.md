
---

📢 Telegram Alert Integration (Crystal Castle)

🔑 ขั้นตอนหลัก
1. สร้าง Telegram Bot  
   - ไปที่ BotFather  
   - ใช้คำสั่ง /newbot → รับ Bot Token

2. หาค่า Chat ID  
   - ส่งข้อความไปยัง bot ที่สร้าง  
   - ใช้ API https://api.telegram.org/bot<token>/getUpdates → จะได้ chat.id

3. เพิ่มขั้นตอนใน GitHub Actions Workflow  
   ตัวอย่าง workflow snippet:

`yaml
- name: Send Telegram Alert
  run: |
    curl -s -X POST https://api.telegram.org/bot${{ secrets.TELEGRAM_TOKEN }}/sendMessage \
      -d chatid=${{ secrets.TELEGRAMCHAT_ID }} \
      -d text="🚨 Crystal Castle Alert: Workflow failed at ${{ github.job }} (commit: ${{ github.sha }})"
`

---

📌 Use Cases
- CI/CD Failure Alert → แจ้งทันทีเมื่อ workflow ล้มเหลว  
- Security Alert → แจ้งเมื่อพบการละเมิด RLS หรือการ upload ไฟล์ต้องห้าม  
- AI Video Alert → แจ้งเมื่อ Fal/Groq API เกิน quota หรือ caption ไม่ผ่าน schema validation  

---

⚙️ Optimization
- ใช้ pre-comment strategy → ทุก alert จะถูกส่งเป็นข้อความใหม่ ไม่แก้ไขข้อความเดิม → ลด notification noise  
- ตั้งค่า severity level ในข้อความ เช่น  
  - 🔴 Critical: Workflow failed  
  - 🟡 Warning: Rate limit approaching  
  - 🟢 Info: Workflow success  

---

🚀 Improve Skill
- Structured Alerts → ใช้ JSON → แปลงเป็นข้อความอ่านง่าย  
- Multi-channel → นอกจาก Telegram สามารถส่งซ้ำไป Slack/Email ได้  
- Auto-Issue Creation → ถ้า alert เป็น Critical → เปิด GitHub Issue พร้อมรายละเอียด  

---

🔒 Security Note
- เก็บ TELEGRAMTOKEN และ TELEGRAMCHAT_ID ใน GitHub Secrets เท่านั้น  
- ห้าม commit ค่า token ลง repo  

---

