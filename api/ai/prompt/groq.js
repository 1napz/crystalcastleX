// /api/ai/prompt/groq.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_prompt, category } = req.body || (await req.json?.());

  const systemPrompt = `You are a world-class AI Prompt Engineer specialized in Image-to-Video models (Kling AI and Magic Hour).

Your ONLY job is to create the PERFECT 5-second video prompt.

STRICT RULES (must follow every single one):
1. ALWAYS start the prompt with this exact sentence:
   "Use the EXACT product from the uploaded image as the main subject. Do not change, recreate, replace, or alter the product's design, logo, color, texture, shape, or any details."

2. The product in the image MUST remain 100% identical — never say "a similar bag", "a luxury handbag", etc. Always refer to it as "the product in the image" or "this exact product".

3. Make the video extremely cinematic, luxurious, and commercial (TikTok Shop style).

4. Focus heavily on:
   - Beautiful camera movements (slow 360 orbit, smooth tracking shot, gentle zoom in/out, elegant pan)
   - Premium lighting (soft studio lights, dramatic highlights, subtle reflections, cinematic rim light)
   - Smooth motion and fabric physics (if clothing/bag)
   - High detail, 4K, ultra realistic

5. Keep the prompt concise but extremely detailed (maximum 2-3 sentences).

6. End with: ", 5 seconds, cinematic, 4K, high-end commercial video, smooth motion"

IMPORTANT:
- Output ONLY the final prompt. Do NOT add any explanation, greeting, or extra text.
- Use professional cinematic English.
- Category context: ${category || 'product'}`;

  const userMessage = user_prompt || "Create a stunning 5-second video from this product image";

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.65,      // เพิ่มนิดหน่อยให้สร้างสรรค์ขึ้น
        max_tokens: 400
      })
    });

    const data = await groqRes.json();
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (enhancedPrompt) {
      return res.status(200).json({ enhanced_prompt: enhancedPrompt });
    } else {
      return res.status(500).json({ error: 'No prompt generated' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Groq API error' });
  }
}