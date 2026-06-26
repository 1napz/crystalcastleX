// api/save-artifact.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { video_url, prompt, filename, category, brand, image_url, engine } = req.body;

  if (!video_url || !prompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabase
      .from('artifacts')  // สร้างตารางนี้ใน Supabase ก่อน
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

    res.status(200).json({ success: true, message: 'บันทึกข้อมูลเรียบร้อย' });
  } catch (error) {
    console.error('Save artifact error:', error);
    res.status(500).json({ error: error.message });
  }
}
