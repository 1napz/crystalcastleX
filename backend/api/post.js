export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'ใช้เฉพาะ POST เท่านั้น'
    });
  }

  const { filename, prompt, brand, category } = req.body;

  if (!prompt) {
    return res.status(400).json({ 
      error: 'Missing prompt',
      details: 'กรุณาส่ง prompt มาใน body'
    });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ GROQ_API_KEY not set');
      const fallbackPost = `✨ ${brand || 'สินค้า'} สวยโดนใจ! พร้อมส่งตรงจาก Crystal Castle\n\n#CrystalCastle #${category || 'แฟชั่น'} #AIvideo`;
      return res.status(200).json({ 
        post: fallbackPost,
        warning: 'GROQ_API_KEY not configured, using fallback'
      });
    }

    console.log(`📝 Calling Groq for post, brand: ${brand}, category: ${category}`);

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
          content: `Write a short, engaging TikTok caption in Thai for a fashion product video. Include:
- 1-2 sentences describing the product/style
- 3-5 relevant hashtags (#CrystalCastle, #แฟชั่น, etc.)
- Friendly, trendy tone (Gen Z style)
- No emoji overload (max 3 emojis)

Brand: ${brand}
Category: ${category}
Prompt: ${prompt}

Caption (Thai):` 
        }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Groq API error: ${response.status}`, errorText);
      return res.status(502).json({ 
        error: 'Groq API failed',
        status: response.status,
        details: errorText,
        fallback_post: `✨ ${brand || 'สินค้า'} สวยงามด้วย AI #CrystalCastle`
      });
    }

    const data = await response.json();
    const post = data.choices?.[0]?.message?.content || `✨ ${brand || 'สินค้า'} มาแรง! #CrystalCastle`;
    
    console.log('✅ Post generated successfully');
    res.status(200).json({ 
      post: post,
      status: 'success'
    });
    
  } catch (error) {
    console.error('🔥 Post handler error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      fallback_post: `✨ ${brand || 'สินค้า'} สวยด้วย AI #CrystalCastle`
    });
  }
}