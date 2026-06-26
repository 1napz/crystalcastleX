// api/get-logs.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // รับเฉพาะ GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ดึงข้อมูล logs จาก database (เรียงล่าสุดก่อน)
    const { data, error } = await supabase
      .from('video_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // จำกัด 100 รายการล่าสุด

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      logs: data,
      count: data.length 
    });
  } catch (err) {
    console.error('Get logs error:', err);
    res.status(500).json({ error: err.message });
  }
}