export default async function handler(req, res) {
  // เปิด CORS สำหรับ dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'ใช้เฉพาะ POST เท่านั้น'
    });
  }

  const { user_prompt, category } = req.body;

  // ตรวจสอบว่าได้รับข้อมูลหรือไม่
  if (!user_prompt) {
    return res.status(400).json({ 
      error: 'Missing user_prompt',
      details: 'กรุณาส่ง user_prompt มาใน body'
    });
  }

  try {
    // ตรวจสอบ API key
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ GROQ_API_KEY not set');
      return res.status(200).json({ 
        enhanced_prompt: `${user_prompt} (AI ไม่ทำงาน: ไม่มี API Key)`,
        warning: 'GROQ_API_KEY not configured'
      });
    }

    console.log(`📝 Calling Groq for prompt, category: ${category}`);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ 
          role: 'user', 
          content: `ช่วย Enhance prompt การทำวิดีโอแฟชั่นนี้ให้ดีขึ้น (เพิ่มแสง, การเคลื่อนกล้อง, อารมณ์) โดยคงความหมายเดิม: ${user_prompt}` 
        }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Groq API error: ${response.status}`, errorText);
      return res.status(502).json({ 
        error: 'Groq API failed',
        status: response.status,
        details: errorText,
        fallback_prompt: user_prompt
      });
    }

    const data = await response.json();
    const enhanced = data.choices?.[0]?.message?.content || user_prompt;
    
    console.log('✅ Prompt enhanced successfully');
    res.status(200).json({ 
      enhanced_prompt: enhanced,
      original_prompt: user_prompt,
      status: 'success'
    });
    
  } catch (error) {
    console.error('🔥 Prompt handler error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      fallback_prompt: user_prompt
    });
  }
}