# สำหรับสาย Express.js + TypeScript
npm install helmet express-rate-limit zod
npm install --save-dev @types/helmet

# หรือถ้า CrystalCastle ใช้ NestJS
npm install @nestjs/throttler zod


⚙️ Backend Scope – CrystalCastle

🇹🇭 คู่มือ Backend (ภาษาไทย)

📂 โครงสร้างไฟล์
- api/ → เก็บ API routes เช่น upload, caption, video
- lib/ → Utilities และ Supabase client
- workflows/ → Automation scripts (CI/CD, governance)
- services/ → Business logic และ service layer
- models/ → Data models และ schema definitions
- tests/ → Unit/integration tests สำหรับ backend

🚀 วิธีการใช้งาน
1. ติดตั้ง dependencies  
   `bash
   npm install
   `
2. รัน backend server  
   `bash
   npm run dev
   `
3. ตรวจสอบ API routes ที่ http://localhost:3000/api

🛡️ กฎ Governance
- ห้าม hardcode secrets → ต้องใช้ .env หรือ Kubernetes Secret  
- ต้องมี rollback strategy → เช่น kubectl rollout undo  
- ต้องมี monitoring → Prometheus/Grafana + alerting  
- Reviewer/Admin ต้องตรวจสอบ compliance checklist ก่อน merge  

---

🇬🇧 Backend Guide (English)

📂 Folder Structure
- api/ → API routes (upload, caption, video)
- lib/ → Utilities and Supabase client
- workflows/ → Automation scripts (CI/CD, governance)
- services/ → Business logic and service layer
- models/ → Data models and schema definitions
- tests/ → Unit/integration tests for backend

🚀 Usage
1. Install dependencies  
   `bash
   npm install
   `
2. Run backend server  
   `bash
   npm run dev
   `
3. Access API routes at http://localhost:3000/api

🛡️ Governance Rules
- No hardcoded secrets → use .env or Kubernetes Secret  
- Rollback strategy required → e.g., kubectl rollout undo  
- Monitoring required → Prometheus/Grafana + alerting  
- Reviewer/Admin must enforce compliance checklist before merge  

---

✅ Reviewer Checklist (TH/EN)
- 📜 Manifests / ไฟล์ Manifest → Validate ก่อน deploy  
- 🔑 Secrets / การจัดการ Secrets → ห้าม hardcode, ต้องใช้ Kubernetes Secret หรือ .env  
- 🔄 Rollback / กลยุทธ์ Rollback → ต้องมี strategy รองรับ  
- 📈 Scaling / การปรับขนาด → รองรับ HPA หรือ autoscaling  
- 📊 Monitoring / การตรวจสอบ → มี Prometheus/Grafana + alerting  
- 🛡️ Governance / การกำกับดูแล → Reviewer/Admin enforce compliance ก่อน merge
`

Global Security Middleware

npm install helmet express-rate-limit zod
npm install --save-dev @types/helmet
