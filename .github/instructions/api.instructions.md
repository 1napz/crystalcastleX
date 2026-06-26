# 🔌 API Instructions — CrystalCastle

## 🧠 Scope
Applies to all backend logic, API routes, and server actions.

---

## 📁 Structure
- All APIs: `/app/api/*/route.ts`
- Use REST-style naming

---

## ⚙️ Standards

### Input Handling
- Always validate input
- Reject invalid requests early

### Response Format
```json
{
  "success": true,
  "data": {},
  "error": null
}