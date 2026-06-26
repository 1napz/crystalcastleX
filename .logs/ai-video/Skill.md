

📊 Crystal Castle Status & Best Practices

🔎 สถานะปัจจุบัน
- CI/CD Pipeline: ยังมี error ในขั้นตอน checkout (Development/#) → ต้องแก้ชื่อ directory  
- Test Coverage: Unit Tests ยังต่ำมาก (~0%) → เสี่ยงต่อ regression  
- QA Strategy: มีจุดแข็ง (MSW, Schema Isolation) แต่ยังขาด LLM-Evaluation, Circuit Breaker, Visual Regression  
- Business Readiness: Affiliate links ยังไม่ถูกตรวจสอบอัตโนมัติ → เสี่ยงต่อ 404/สินค้าหมดสต็อก  

---

✅ วิธีที่ดีที่สุด (Action Plan)
1. แก้ CI/CD Error → เปลี่ยนชื่อ directory ให้ปลอดภัย  
2. เพิ่ม Unit Tests → อย่างน้อย 50% coverage ก่อนเพิ่มฟีเจอร์ใหม่  
3. Smoke Tests → Flow: Login → Upload → Generate AI Prompt → View Gallery  
4. Visual Regression → ใช้ Playwright ตรวจสอบ video player และ branding logo  
5. Affiliate Link Monitoring → ตั้ง cron job ตรวจสอบ Shopee links ทุก 24 ชม.  
6. Budget Guardrail → Circuit Breaker test สำหรับ Fal/Groq API  

---

🎥 AI Video Logging Prompt, Optimize, Improve Skill

📝 Logging Prompt
- เก็บ log ทุกครั้งที่ AI สร้าง caption หรือ video metadata  
- Log format (JSON):
`json
{
  "timestamp": "2026-05-01T10:30:00Z",
  "inputImage": "image123.png",
  "prompt": "fashion style showcase",
  "caption": "Trendy streetwear for summer",
  "videoUrl": "https://fal.ai/video/abc123",
  "affiliateLink": "https://shopee.com/product/xyz"
}
`
- เก็บใน ./logs/ai-video/ → ใช้สำหรับ audit และ debugging

---

⚙️ Optimize
- Prompt Optimization: ใช้ template เช่น  
  "Generate a {style} fashion showcase video highlighting {product}, include keywords: {trend}, {season}"  
- Caching: ถ้า input image + prompt ซ้ำ → ใช้ผลลัพธ์จาก cache เพื่อลด API cost  
- Parallelization: ใช้ worker queue → แบ่งโหลดการสร้าง video หลายไฟล์พร้อมกัน  

---

🚀 Improve Skill
- LLM-Evaluation: ตรวจสอบว่า caption มี keyword ที่ถูกต้อง (เช่น fashion, style, trend)  
- Visual Regression: ตรวจสอบว่า logo/branding ไม่เปลี่ยนแปลง  
- Affiliate Monitoring Agent: ตรวจสอบว่า CTA link ยังใช้งานได้ทุกวัน  
- Analytics Integration: เก็บ metrics เช่น CTR ของ affiliate link, watch completion rate  

---

📌 สรุป
Crystal Castle ควรเร่งแก้ CI/CD error + เพิ่ม test coverage เป็นอันดับแรก จากนั้นเสริม AI Video Logging + Prompt Optimization + Guardrails เพื่อให้ระบบทั้งเสถียรและสร้างรายได้จริง  

---
