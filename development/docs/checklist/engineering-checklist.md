<!--
Version: 1.0
Owner: @1napz
Last Updated: 2026-05
Purpose: Ensure PR quality + CI stability
-->

# ✅ CrystalCastle Engineering Checklist

---

## 🧠 1. Development

- [ ] Code ทำงานใน local
- [ ] ไม่มี console error
- [ ] ใช้ env ถูกต้อง (.env.local)

---

## ⚙️ 2. Code Quality

- [ ] `npm run lint` ผ่าน
- [ ] `npm run format:check` ผ่าน
- [ ] `npm run type-check` ผ่าน

---

## 🧪 3. Testing

- [ ] มี test (ขั้นต่ำ sanity)
- [ ] test ผ่าน

---

## 🔁 4. CI/CD

- [ ] GitHub Actions ผ่าน
- [ ] ไม่มี step fail
- [ ] checkout ทำงานได้

---

## 🌐 5. Deployment

- [ ] Vercel Preview ขึ้น
- [ ] UI/UX ใช้งานได้
- [ ] ไม่มี error บน browser

---

## 🔐 6. Security

- [ ] ไม่มี `.env` ใน repo
- [ ] ไม่มี API key หลุด
- [ ] ใช้ GitHub Secrets

---

## 📄 7. Documentation

- [ ] README อัปเดต
- [ ] docs ที่เกี่ยวข้องอัปเดต

---

## 🚀 8. Merge Readiness

- [ ] PR checklist ครบ
- [ ] review แล้ว
- [ ] ไม่มี conflict