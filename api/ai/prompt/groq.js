// /api/ai/prompt/groq.js
export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).end();

  const { user_prompt, category } = await req.json? await req.json() : req.body;

  const system = `คุณเป็นผู้เชี่ยวชาญเขียน prompt สำหรับ Image-to-Video AI (Kling, Magic Hour)

กฎเหล็ก 5 ข้อ:
1. ต้องเริ่มด้วย "Use the EXACT product in the uploaded image as the source. Do not replace, recreate, or alter the product design, logo, color, texture, or shape."
2. วิดีโอต้องคงสินค้าตัวเดิม 100% — ห้ามสร้างสินค้าใหม่ที่คล้ายกัน
3. เน้นการเคลื่อนไหวของกล้อง/แสง ไม่ใช่การเปลี่ยนสินค้า: slow 360 orbit, gentle zoom, soft studio lighting
4. ระบุ category: ${category || 'product'} เพื่อให้ AI รู้บริบท
5. ความยาว 5 วินาที, cinematic, 4K, เหมาะกับ TikTok Shop (ต้องเห็นสินค้าชัดตลอด)

ห้ามใช้คำว่า "similar", "like", "inspired by", "a handbag" — ต้องอ้างถึง "the product in the image" เท่านั้น`;

  const user = user_prompt || `สร้างวิดีโอ 5 วินาทีจากรูปสินค้านี้`;

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.3
    })
  });

  const data = await groqRes.json();
  const prompt = data.choices?.[0]?.message?.content?.trim() || user;

  return res.status(200).json({ prompt });
}