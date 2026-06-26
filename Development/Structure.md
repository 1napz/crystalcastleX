
---

📁 Complete File Structure After Refactoring

🆕 สร้างใหม่ (New Files Created)

```text
crystalcastle/
├── lib/
│   ├── config.ts                  ← ✅ สร้างใหม่
│   ├── services/
│   │   ├── fal.ts                 ← ✅ สร้างใหม่
│   │   ├── groq.ts                ← ✅ สร้างใหม่
│   │   └── gemini.ts             ← ✅ สร้างใหม่
│   └── utils/
│       ├── logger.ts             ← ✅ สร้างใหม่
│       ├── api-handler.ts        ← ✅ สร้างใหม่
│       └── validation.ts         ← ✅ สร้างใหม่
├── hooks/
│   └── useProductVideo.ts        ← ✅ สร้างใหม่
├── middleware.ts                   ← ✅ สร้างใหม่
├── .env.example                   ← ✅ สร้างใหม่ (แทนที่ของเก่า)
```

---

✏️ แก้ไข (Files Modified)

```text
crystalcastle/
├── .env.local                     ← ✏️ แก้ไข: เอา NEXT_PUBLIC_ ออกจาก API Keys
├── next.config.js                 ← ✏️ แก้ไข: เพิ่ม security headers (ถ้ายังไม่มี)
├── package.json                   ← ✏️ แก้ไข: อัปเดต scripts ให้รองรับโครงสร้างใหม่
├── pages/
│   └── api/
│       ├── video.js              ← ✏️ แก้ไข: ใช้ service layer + error handler
│       ├── post.js               ← ✏️ แก้ไข: ใช้ service layer + error handler
│       ├── prompt.js             ← ✏️ แก้ไข: ใช้ service layer + validation
│       └── upload.js             ← ✏️ แก้ไข: ใช้ service layer + error handler
├── components/
│   └── product.js                ← ✏️ แก้ไข: แยก logic ไป hooks/
└── supabase-client.js            ← ✏️ แก้ไข: ใช้ config.ts แทน hardcode
```

---

🗑️ ลบทิ้ง (Files to Delete/Archive)

```text
crystalcastle/
├── [ไฟล์ที่มี Hardcoded Keys]     ← 🗑️ ลบหรือย้ายไป .gitignore
├── "Pull Request Template 01_260430_224859.pdf"  ← 🗑️ ลบ (ชื่อไฟล์มีช่องว่าง)
└── [ไฟล์ขยะใน Root Directory]    ← 🗑️ ลบหรือย้ายไป docs/
```

---

📋 ตารางสรุปที่ชัดเจน

ไฟล์ การกระทำ เหตุผล
lib/config.ts ✅ สร้างใหม่ รวมศูนย์ Environment Variables
lib/services/fal.ts ✅ สร้างใหม่ แยก Logic FAL API
lib/services/groq.ts ✅ สร้างใหม่ แยก Logic Groq API
lib/services/gemini.ts ✅ สร้างใหม่ แยก Logic Gemini API
lib/utils/logger.ts ✅ สร้างใหม่ ระบบ Log แบบมีโครงสร้าง
lib/utils/api-handler.ts ✅ สร้างใหม่ จัดการ Error Response
lib/utils/validation.ts ✅ สร้างใหม่ ตรวจสอบ Input
hooks/useProductVideo.ts ✅ สร้างใหม่ แยก Logic จาก product.js
middleware.ts ✅ สร้างใหม่ จัดการ CORS + Security Headers
.env.example ✅ สร้างใหม่ ตัวอย่าง Env ถูกต้อง
.env.local ✏️ แก้ไข เอา NEXT_PUBLIC_ ออก
pages/api/video.js ✏️ แก้ไข ใช้ Service Layer
pages/api/post.js ✏️ แก้ไข ใช้ Service Layer
pages/api/prompt.js ✏️ แก้ไข ใช้ Service Layer + Validation
pages/api/upload.js ✏️ แก้ไข ใช้ Service Layer
components/product.js ✏️ แก้ไข ดึง Logic ไป hook
supabase-client.js ✏️ แก้ไข ใช้ Config

---

ต้องการให้ผมช่วยเขียนโค้ดไฟล์ไหนเพิ่มเติม หรือให้อธิบายขั้นตอนการ Refactor แบบ Step-by-Step ไหมครับ?