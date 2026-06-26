// api/prompt.js
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // รองรับทั้ง user_prompt (จาก index.html) และ prompt (จาก client อื่น)
  const userPrompt = req.body.user_prompt || req.body.prompt;
  if (!userPrompt) {
    return res.status(400).json({ error: 'Missing prompt (send as user_prompt or prompt)' });
  }

  const start = Date.now();

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: userPrompt }],
      model: 'llama3-8b-8192',
    });

    const latency = Date.now() - start;
    const responseText = chatCompletion.choices[0]?.message?.content || '';

    // บันทึก Log ลงตาราง groq_logs
    const { error: logError } = await supabase.from('groq_logs').insert({
      request_id: chatCompletion.id,
      model: 'llama3-8b-8192',
      prompt: userPrompt,
      response: responseText,
      latency_ms: latency,
    });

    if (logError) {
      console.error('Log insert error:', logError);
    }

    return res.status(200).json({ result: responseText, latency });
  } catch (err) {
    console.error('Groq API error:', err);
    return res.status(500).json({ error: err.message });
  }
}