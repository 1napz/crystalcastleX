import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_url, filename } = req.body;
  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({
      error: 'HF_TOKEN not set. Get free token at huggingface.co/settings/tokens'
    });
  }

  try {
    // 1. โหลดรูปจาก Vercel Blob
    const imgRes = await fetch(image_url);
    if (!imgRes.ok) throw new Error('Failed to fetch image from Blob');
    const imgBuffer = await imgRes.arrayBuffer();

    // 2. เรียก Hugging Face - ส่งรูปเป็น binary ตรงๆ
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'image/jpeg'
        },
        body: imgBuffer
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      if (hfRes.status === 503) {
        return res.status(503).json({ error: 'Model is loading, try again in 20s' });
      }
      // ถ้า HF พัง ให้ส่ง Error กลับเป็น JSON
      return res.status(hfRes.status).json({ error: `HF Error: ${errText}` });
    }

    // 3. อัพวิดีโอกลับเข้า Blob
    const videoBuffer = await hfRes.arrayBuffer();
    const videoFilename = `${filename || 'hf'}-${Date.now()}.mp4`;
    
    const videoBlob = await put(videoFilename, videoBuffer, {
      access: 'public',
      contentType: 'video/mp4'
    });

    return res.status(200).json({
      video_url: videoBlob.url,
      engine: 'HuggingFace',
      message: 'Generated free with HF - 3s video'
    });

  } catch (error) {
    // สำคัญ: ต้อง return JSON เสมอ ห้าม crash
    return res.status(500).json({ error: error.message });
  }
}
