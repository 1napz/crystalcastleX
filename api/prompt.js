// api/prompt.js (เฉพาะส่วนที่เกี่ยวข้อง)
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk'; // หรือใช้ OpenAI SDK กับ Groq baseURL

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  const start = Date.now();

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    const latency = Date.now() - start;
    const responseText = chatCompletion.choices[0]?.message?.content || '';

    // 💾 บันทึก Log ลง Supabase
    const { error: logError } = await supabase.from('groq_logs').insert({
      request_id: chatCompletion.id,  // ID จาก Groq
      model: 'llama3-8b-8192',
      prompt,
      response: responseText,
      latency_ms: latency,
    });
    if (logError) console.error('Log insert error:', logError);

    return res.status(200).json({ result: responseText, latency });
  } catch (err) {
    console.error('Groq error:', err);
    return res.status(500).json({ error: err.message });
  }
}