// api/artifacts.js - รวม GET (ดึงข้อมูล) และ POST (บันทึกข้อมูล)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // ตั้งค่า CORS
  res.setHeader('Access-Control-Allow-Origin', '*');

  // GET: ดึงข้อมูล artifacts
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return res.status(200).json({ success: true, artifacts: data });
    } catch (err) {
      console.error('GET artifacts error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: บันทึก artifact ใหม่
  if (req.method === 'POST') {
    const { video_url, prompt, filename, category, brand, image_url, engine } = req.body;

    if (!video_url || !prompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { data, error } = await supabase
        .from('artifacts')
        .insert([
          {
            video_url,
            prompt,
            filename,
            category,
            brand,
            image_url,
            engine,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      return res.status(200).json({ success: true, message: 'Artifact saved' });
    } catch (err) {
      console.error('POST artifact error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}