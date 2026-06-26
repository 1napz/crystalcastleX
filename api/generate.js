// api/generate.js - FAL + Supabase upload
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ใช้ service key (ไม่ใช่ anon)
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { image_url, prompt, filename } = req.body;
    if (!image_url || !prompt || !filename) {
      return res.status(400).json({ error: 'Missing params' });
    }

    // 1. เรียก FAL Kling
    const falRes = await fetch('https://fal.run/fal-ai/kling-video/v1/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url,
        prompt,
        duration: 5,
        aspect_ratio: '9:16'
      })
    });

    const falData = await falRes.json();
    if (!falRes.ok) throw new Error(falData.detail || 'FAL failed');

    const tempVideoUrl = falData.video?.url || falData.video_url;
    if (!tempVideoUrl) throw new Error('No video URL from FAL');

    // 2. ดาวน์โหลดวิดีโอจาก FAL
    const videoBuffer = await fetch(tempVideoUrl).then(r => r.arrayBuffer());

    // 3. อัปขึ้น Supabase
    const filePath = `${filename}-FAL-${Date.now()}.mp4`;
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 4. สร้าง public URL ถาวร
    const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
    const permanentUrl = data.publicUrl;

    // 5. ส่งกลับ
    return res.status(200).json({
      video_url: permanentUrl,
      temp_url: tempVideoUrl,
      filename: filePath
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}