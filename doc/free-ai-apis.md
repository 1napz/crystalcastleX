# 🤖 Free AI APIs สำหรับพัฒนาและทดสอบ

ในโปรเจกต์ Crystal Castle เราใช้ AI หลายตัวในการสร้าง Prompt และสร้างวิดีโอ ด้านล่างนี้คือสรุป API ที่มี Free Tier ให้ใช้งานได้จริง พร้อมข้อจำกัดและวิธีเริ่มต้น

---

## 📊 เปรียบเทียบ Free AI APIs

| API | Free Limit | จุดเด่น | ข้อเสีย |
|-----|------------|--------|--------|
| **Google Gemini API** | 1,500 req/day (Flash), 1M token/min | Multimodal, Context ยาว 1M tokens, ฟรีใจป้ำ | ต้องสมัครผ่าน Google AI Studio |
| **Groq Cloud** | ~14,400 req/day (บางรุ่น) | ความเร็วสูงด้วย LPU | Rate limit อาจลดลงตามการใช้งาน |
| **OpenRouter** | 50 req/day (โมเดลฟรี) | รวม 350+ โมเดล, ใช้ OpenAI format | ความเร็วอาจช้าเพราะ route ผ่านหลายเจ้า |
| **Together AI** | เครดิตฟรี $25 | โมเดล Open-Source ให้เลือกเยอะ | เครดิตหมดแล้วต้องจ่าย |
| **Hugging Face Serverless** | จำกัด (rate limit) | เข้าถึงโมเดลเฉพาะทาง | Cold start นาน |
| **Cloudflare Workers AI** | 10,000 neurons/day | เหมาะกับผู้ใช้ Cloudflare | ต้องใช้ใน ecosystem Cloudflare |
| **GitHub Models** | จำกัด (prototype) | เข้าถึง GPT-4o, Llama 3 ใน IDE | สำหรับ prototyping เท่านั้น |

---

## 🔑 วิธีเริ่มต้นสำหรับ Gemini API (แนะนำ)

1. ไปที่ [Google AI Studio](https://aistudio.google.com/) และลงชื่อเข้าใช้
2. คลิก "Get API Key" และสร้าง API key
3. ติดตั้ง SDK: `npm install @google/generative-ai`
4. ใช้งานใน API Route:
   ```javascript
   import { GoogleGenerativeAI } from '@google/generative-ai'
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
   const result = await model.generateContent('Your prompt')