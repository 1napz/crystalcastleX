export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    const { user_prompt, category } = req.body;
    if (!user_prompt) return res.status(400).json({ error: 'Missing user_prompt' });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'Missing GROQ_API_KEY' });

    const system = `You are a fashion video prompt engineer. Enhance the user's prompt into cinematic English, 1-2 sentences, include lighting, camera movement, fabric detail. Category: ${category || 'fashion'}.`;

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user_prompt }
        ],
        temperature: 0.85,
        max_tokens: 180
      })
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: `Groq API ${r.status}: ${err}` });
    }

    const data = await r.json();
    const enhanced = data.choices?.[0]?.message?.content?.trim() || user_prompt;

    return res.status(200).json({ enhanced_prompt: enhanced });

  } catch (e) {
    console.error('prompt error:', e);
    return res.status(500).json({ error: e.message });
  }
}