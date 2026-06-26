# 🤖 AI Video Helper (Crystal Castle)

## 🎥 Workflow Steps
1. **User Login** → รับ token สำหรับ session
2. **Upload Image** → เก็บไฟล์ใน Supabase storage
3. **Generate AI Video** → เรียก Fal API พร้อม prompt
4. **Validate Output** → ตรวจสอบว่าได้ `videoUrl` และ `caption`
5. **View Gallery** → แสดงวิดีโอพร้อม affiliate link

---

## ✅ Test Checklist
### Functional
- [ ] ตรวจสอบว่า AI output มี `videoUrl` และ `caption`
- [ ] Caption ต้องมี keyword เช่น `fashion`, `style`, `trend`

### Guardrails
- [ ] Circuit Breaker Test → ป้องกันการเรียก API เกิน quota
- [ ] Rate Limit Logging → แจ้งเตือนเมื่อ request/minute เกิน threshold

### UX & Branding
- [ ] Visual Regression Test → ใช้ Playwright เทียบ Golden Master ของ video player และ logo
- [ ] ตรวจสอบว่า UI ไม่เปลี่ยนแปลงใน pixel-level

### Business Path
- [ ] Affiliate Link Integrity → ตรวจสอบ Shopee links ทุก 24 ชม.
- [ ] Link ต้องไม่ชี้ไป 404 หรือสินค้าหมดสต็อก

---

## 🧪 Example Smoke Test
```typescript
describe('AI Video Smoke Flow', () => {
  it('should complete end-to-end AI video generation flow', async () => {
    const user = await loginUser({ username: 'testUser', password: 'securePass' });
    const uploadResult = await uploadImage(user.token, mockData.imageFile);
    const videoResult = await generateVideoWithFal({
      token: user.token,
      imageUrl: uploadResult.imageUrl,
      prompt: 'fashion style showcase'
    });
    expect(videoResult).toHaveProperty('videoUrl');
    expect(videoResult.caption).toMatch(/fashion|style|trend/i);
    const gallery = await viewGallery(user.token);
    expect(gallery).toEqual(
      expect.arrayContaining([expect.objectContaining({ videoUrl: videoResult.videoUrl })])
    );
  });
});