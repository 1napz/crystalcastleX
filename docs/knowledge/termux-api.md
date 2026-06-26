## Termux:API — ทำอะไรได้บ้าง 🔥

### 📲 ติดตั้งก่อน
```bash
pkg install termux-api
```

---

### 🛠 API ที่น่าใช้ใน Termux

| คำสั่ง | ทำอะไร |
|--------|--------|
| `termux-battery-status` | เช็คแบตเตอรี่ |
| `termux-location` | ดู GPS Location |
| `termux-camera-photo` | ถ่ายรูปจาก Terminal |
| `termux-sms-send` | ส่ง SMS |
| `termux-sms-list` | ดู SMS ทั้งหมด |
| `termux-notification` | แจ้งเตือน |
| `termux-torch` | เปิด/ปิดไฟฉาย |
| `termux-clipboard-get` | ดู Clipboard |
| `termux-tts-speak` | พูดข้อความ |
| `termux-vibrate` | สั่นมือถือ |
| `termux-wifi-connectioninfo` | ดูข้อมูล WiFi |
| `termux-volume` | ปรับเสียง |
| `termux-wallpaper` | เปลี่ยน Wallpaper |

---

### 💡 ตัวอย่างใช้งาน
```bash
# เช็คแบต
termux-battery-status

# ถ่ายรูป
termux-camera-photo ~/photo.jpg

# พูดข้อความ
termux-tts-speak "สวัสดีครับ"

# ส่ง SMS
termux-sms-send -n 0812345678 "Hello"

# เปิดไฟฉาย
termux-torch -l on
```

---

> ⚠️ ต้องติดตั้งแอป **Termux:API** จาก F-Droid ด้วยนะครับ ไม่ใช่แค่ pkg อย่างเดียว