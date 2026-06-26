# Crystal Castle 💎

AI Fashion Video Generator - อัพรูปเสื้อ → ได้คลิปนางแบบเดินรันเวย์ ตั้งชื่อไฟล์เอง

**Live Demo:** https://crystalcastle-pi.vercel.app
**GitHub Pages:** https://1napz.github.io/crystalcastle

## ✨ Features

- **P0 - Product Manager**: อัพรูปสินค้า ตั้งชื่อไฟล์แบบ `20260422-Menswear-Brand` เช็คชื่อซ้ำได้
- **P1 - AI Generation**: ใช้ FAL Kling v2.1 เจนคลิป 5 วิ จากรูป + Prompt รองรับทั้งฟรี/เสียเงิน
- **Auto Download**: เจนเสร็จโหลด `.mp4` ตั้งชื่อให้เลย

## 💎 AI Engines: ฟรี vs เสียเงิน

### 🆓 ฟรี - สำหรับเทส/คอนเทนต์ไม่จริงจัง
| Engine | คุณภาพ | จำกัดอะไร | แนะนำ |
| --- | --- | --- | --- |
| **Magic Hour** | 7/10 | 400 credits ไม่มีวันหมด | ✅ ใช้แทน HF ได้เลย |
| **Kling AI 3.0** | 9/10 | daily credits ต้องล็อกอินรับ | ✅ คุณภาพสูง |
| **Google Veo 3 (Flow)** | 10/10 | ต้องรอคิว Gmail | ✅ Cinematic |
| **Luma Dream Machine** | 8/10 | 720p รอนาน 5-10 นาที | ไว้เทส |
| **Pika AI** | 6/10 | 480p มีลายน้ำเล็กๆ | ใช้เทสไอเดีย |

### 💳 เสียเงิน - สำหรับงาน Production
| Engine | ราคาเริ่ม | คุณภาพ | หมายเหตุ |
| --- | --- | --- | --- |
| **FAL Kling 1.6 Pro** | ~$0.05/คลิป | 10/10 | เร็ว 1-2 นาที ไม่มีลายน้ำ |
| **Runway Gen-3** | $12/เดือน | 9/10 | free tier มีลายน้ำหนัก |

> **อัปเดต เม.ย. 2026:** Hugging Face ปิด Inference API สำหรับ `stable-video-diffusion` แล้ว ยิงตรงไม่ได้ ต้องใช้ Magic Hour/Kling หรือ Self-host แทน

## 🚀 Tech Stack

| ส่วน | ใช้ |
| --- | --- |
| Frontend | Vanilla HTML/CSS/JS + Tailwind |
| Hosting | Vercel + GitHub Pages |
| AI Video | FAL.ai Kling v2.1 / Magic Hour (เลือกได้) |
| Storage | Vercel Blob |

## 📋 Progress Log

### **2026-04-22 - P0 Complete ✅**
- [x] Setup Vercel project แก้ Build Error `Framework: Other`
- [x] สร้าง `product.html` UI อัพรูป + ตั้งชื่อ + เช็คชื่อซ้ำ localStorage
- [x] Deploy สำเร็จทั้ง Vercel และ GitHub Pages

### **2026-04-22 - P1 In Progress 🟡**
- [x] สร้างโฟลเดอร์ `/api` เตรียม Backend
- [x] เพิ่ม `@vercel/blob` ใน `package.json`
- [x] สร้าง `/api/upload.js` - อัพรูปเข้า Vercel Blob
- [ ] สร้าง `/api/generate.js` - เรียก FAL/Magic Hour API เจนคลิป
- [ ] ตั้งค่า `FAL_KEY` หรือ `MAGIC_HOUR_KEY` ใน Vercel Env
- [ ] เทสเจนคลิปแรก `20260422-Menswear-Brand.mp4`

### **Next Up - P2 📝**
- [ ] Gallery แสดงคลิปที่เคยเจน
- [ ] รองรับหลาย Engine เลือกฟรี/เสียเงินได้
- [ ] Queue system เจนทีละหลายคลิป
- [ ] User auth + จำกัดโควต้า

## 🔧 API Endpoints

| Endpoint | Method | ทำอะไร |
| --- | --- | --- |
| `/api/upload` | POST | รับไฟล์รูป → คืน `image_url` จาก Vercel Blob |
| `/api/generate` | POST | รับ `image_url` + `prompt` + `engine` → คืน `video_url` |

## 🔑 Setup

1. Clone repo
2. `npm install`
3. ใส่ `FAL_KEY=xxx` หรือ `MAGIC_HOUR_KEY=xxx` ใน Vercel Environment Variables
4. เปิดใช้ Vercel Blob ในแท็บ Storage
5. Deploy

---
Made with 💎 by 1napz