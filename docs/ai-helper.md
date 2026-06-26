

`markdown

🤖 AI Helper Guide (Crystal Castle)

🎥 AI Video Workflow
- [ ] Input: ผู้ใช้ upload รูปภาพ/ไฟล์
- [ ] AI Captioning: ใช้ LLM (Groq/Gemini) สร้างคำบรรยายสินค้า
- [ ] Video Generation: เรียก Fal API เพื่อสร้างวิดีโอสั้น
- [ ] Output: แสดงผลใน Gallery พร้อม affiliate link

---

✅ Test Coverage Checklist

Functional
- [ ] ตรวจสอบว่า AI output มี videoUrl และ caption
- [ ] Caption ต้องมี keyword ที่เกี่ยวข้องกับ fashion/style/trend

Guardrails
- [ ] Circuit Breaker Test → ป้องกันการเรียก API เกิน quota
- [ ] Rate Limit Logging → แจ้งเตือนเมื่อ request/minute เกิน threshold

UX & Branding
- [ ] Visual Regression Test → ใช้ Playwright เทียบ Golden Master ของ logo/video player
- [ ] ตรวจสอบว่า video player UI ไม่เปลี่ยนแปลง

Business Path
- [ ] Affiliate Link Integrity → ตรวจสอบ Shopee links ทุก 24 ชม.
- [ ] Link ต้องไม่ชี้ไป 404 หรือสินค้าหมดสต็อก

---

🧪 Example Test Case
`typescript
it('should generate video metadata with required fields', async () => {
  const result = await generateVideoWithFal(mockData);
  expect(result).toHaveProperty('videoUrl');
  expect(result).toHaveProperty('caption');
  expect(result.caption).toMatch(/(fashion|style|trend)/i);
});
`

---

🚀 Next Steps
- [ ] เพิ่ม Smoke Test Flow: Login → Upload → Generate → View Gallery
- [ ] ตัดสินใจว่า Affiliate Link Integrity จะทำใน Backend หรือสร้างเป็น AI Agent แยกต่างหาก
- [ ] รวม AI Video Tests เข้า GitHub Actions Workflow
`

---  

 