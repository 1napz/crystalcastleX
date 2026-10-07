---

📄 CrystalCastle Local Setup (Latest)

🔧 Requirements
- Node.js 20 (แนะนำติดตั้งผ่าน nvm บน macOS/Linux/Termux)  
- Python 3.12  
- Git  
- Docker (optional)  

---

📥 Clone Repository
`bash
git clone <repo>
cd crystal-castle
`

---

🟢 ติดตั้ง Node.js ด้วย nvm
1. ติดตั้ง nvm  
   `bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
   `
   เพิ่มบรรทัดใน ~/.bashrc หรือ ~/.zshrc:  
   `bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVMDIR/nvm.sh" ] && \. "$NVMDIR/nvm.sh"
   `
2. โหลด nvm  
   `bash
   source ~/.bashrc   # หรือ ~/.zshrc
   `
3. ติดตั้ง Node.js LTS  
   `bash
   nvm install --lts
   nvm use --lts
   `
4. ตรวจสอบเวอร์ชัน  
   `bash
   node -v
   npm -v
   `

---

🐍 ติดตั้ง Python
- Windows → ดาวน์โหลดจาก python.org และเลือก Add to PATH  
- macOS →  
  `bash
  brew install python3
  `
- Linux/Termux →  
  `bash
  pkg install python
  python --version
  `

---

📱 Workflow บน Termux + Acode
1. ใช้ Termux → ติดตั้ง Git, Python, nvm → clone repo → รันโค้ด  
2. ใช้ Acode → เปิดไฟล์โปรเจกต์ → แก้ไขโค้ด → บันทึก  
3. กลับไปที่ Termux → รันคำสั่ง node app.js หรือ python main.py  

---

✅ Checklist
- [ ] Node.js 20 พร้อม npm  
- [ ] Python 3.12  
- [ ] Git  
- [ ] Docker (ถ้าต้องการ)  
- [ ] Termux + Acode workflow พร้อมใช้งาน  

---

