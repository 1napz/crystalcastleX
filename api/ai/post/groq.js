// api/ai/post/groq.js
export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  const { filename, prompt, brand, category } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY' });
  }

  try {
    const systemPrompt = `คุณเป็นนักเขียนแคปชั่นโซเชียลภาษาไทยสำหรับแบรนด์แฟชั่น Crystal Castle
- เขียนสั้น 2-3 ประโยค กระชับ น่าซื้อ
- ใส่ emoji 2-3 อันที่เหมาะกับสินค้า
- ปิดท้ายด้วย hashtag 4-5 อัน เกี่ยวกับแฟชั่นและแบรนด์
- ห้ามใช้ภาษาอังกฤษยกเว้นชื่อแบรนด์`;

    const userPrompt = `สินค้า: ${filename || 'สินค้าใหม่'}
หมวดหมู่: ${category || '-'}
แบรนด์: ${brand || '-'}
คำอธิบายวิดีโอ: ${prompt || '-'}

เขียนแคปชั่นภาษาไทยสำหรับโพสต์ Facebook/Instagram`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // เร็วและภาษาไทยดี
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 250,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq error: ${err}`);
    }

    const data = await response.json();
    const post = data.choices?.[0]?.message?.content?.trim();

    if (!post) throw new Error('No content from Groq');

    res.status(200).json({ post });

  } catch (error) {
    console.error('Post generation error:', error);
    // fallback แบบง่ายถ้า Groq ล่ม
    const fallback = `ลุคใหม่ ${brand || ''} พร้อมแล้ว ✨\nสไตล์ ${category || 'แฟชั่น'} ที่คุณต้องมี\n\n#CrystalCastle #${category || 'Fashion'} #${brand || 'Style'} #NewArrival`;
    res.status(200).json({ post: fallback });
  }
}