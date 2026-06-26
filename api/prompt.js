// api/prompt.js
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const userPrompt = req.body.user_prompt || req.body.prompt;
  if (!userPrompt) return res.status(400).json({ error: 'Missing prompt' });

  const start = Date.now();
  let result = '';
  let model = 'groq/llama3-8b-8192';

  try {
    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: userPrompt }],
      model: 'llama3-8b-8192',
    });
    result = chat.choices[0]?.message?.content || '';

    // Log to Supabase
    await supabase.from('groq_logs').insert({
      request_id: chat.id,
      model,
      prompt: userPrompt,
      response: result,
      latency_ms: Date.now() - start,
    }).catch(e => console.error('Log insert error:', e));

  } catch (groqErr) {
    console.error('Groq failed:', groqErr.message);
    // Fallback: ยังไม่ทำ (แต่เตรียมไว้)
    return res.status(500).json({ error: `Groq failed: ${groqErr.message}` });
  }

  return res.status(200).json({ result, latency: Date.now() - start, model });
}