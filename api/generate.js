// api/generate.js - FAL + Supabase upload
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { image_url, prompt, filename } = req.body;
    if (!image_url || !prompt || !filename) {
      return res.status(400).json({ error: 'Missing params' });
    }
    const falRes = await fetch('https://fal.run/fal-ai/kling-video/v1/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_url, prompt, duration: 5, aspect_ratio: '9:16' })
    });
    const falData = await falRes.json();
    if (!falRes.ok) throw new Error(falData.detail || 'FAL failed');
    const tempVideoUrl = falData.video?.url || falData.video_url;
    if (!tempVideoUrl) throw new Error('No video URL from FAL');
    const videoBuffer = await fetch(tempVideoUrl).then(r => r.arrayBuffer());
    const filePath = `${filename}-FAL-${Date.now()}.mp4`;
    const { error: uploadError } = await supabase.storage.from('videos').upload(filePath, videoBuffer, {
      contentType: 'video/mp4', upsert: true
    });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
    return res.status(200).json({ video_url: data.publicUrl, temp_url: tempVideoUrl, filename: filePath });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
