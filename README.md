# Crystal Castle 💎

AI Fashion Video Generator - อัพรูปเสื้อ → ได้คลิปนางแบบเดินรันเวย์ ตั้งชื่อไฟล์เอง

**Live Demo:** https://crystalcastle-pi.vercel.app 
**GitHub Pages:** https://1napz.github.io/crystalcastle

## ✨ Features

- **P0 - Product Manager**: อัพรูปสินค้า ตั้งชื่อไฟล์แบบ `20260422-Menswear-Brand` เช็คชื่อซ้ำได้
- **P1 - AI Generation**: ใช้ FAL Kling v2.1 เจนคลิป 5 วิ จากรูป + Prompt
- **Auto Download**: เจนเสร็จโหลด `.mp4` ตั้งชื่อให้เลย

## 🚀 Tech Stack

| ส่วน | ใช้ |
| --- | --- |
| Frontend | Vanilla HTML/CSS/JS + Tailwind |
| Hosting | Vercel + GitHub Pages |
| AI Video | FAL.ai Kling v2.1 |
| Storage | Vercel Blob |

## 📋 Progress Log

### **2026-04-22 - P0 Complete ✅**
- [x] Setup Vercel project แก้ Build Error `Framework: Other`
- [x] สร้าง `product.html` UI อัพรูป + ตั้งชื่อ + เช็คชื่อซ้ำ localStorage
- [x] Deploy สำเร็จทั้ง Vercel และ GitHub Pages

### **2026-04-22 - P1 In Progress 🟡**
- [x] สร้างโฟลเดอร์ `/api` เตรียม Backend
- [x] เพิ่ม `@vercel/blob` ใน `package.json`
- [ ] สร้าง `/api/upload.js` - อัพรูปเข้า Vercel Blob
- [ ] สร้าง `/api/generate.js` - เรียก FAL API เจนคลิป
- [ ] ตั้งค่า `FAL_KEY` ใน Vercel Env
- [ ] เทสเจนคลิปแรก `20260422-Menswear-Brand.mp4`

### **Next Up - P2 📝**
- [ ] Gallery แสดงคลิปที่เคยเจน
- [ ] Queue system เจนทีละหลายคลิป
- [ ] User auth + จำกัดโควต้า

## 🔧 API Endpoints

| Endpoint | Method | ทำอะไร |
| --- | --- | --- |
| `/api/upload` | POST | รับไฟล์รูป → คืน `image_url` จาก Vercel Blob |
| `/api/generate` | POST | รับ `image_url` + `prompt` → คืน `video_url` จาก FAL |

## 🔑 Setup

1. Clone repo
2. `npm install` 
3. ใส่ `FAL_KEY=xxx` ใน Vercel Environment Variables
4. เปิดใช้ Vercel Blob ในแท็บ Storage
5. Deploy

---
Made with 💎 by 1napz
