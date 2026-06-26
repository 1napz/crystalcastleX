import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).end();

  const { image_url, prompt } = req.body;
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

    // 2. เรียก Hugging Face Stable Video Diffusion ฟรี
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: Array.from(new Uint8Array(imgBuffer)),
          parameters: {
            num_frames: 25, // 3 วินาที
            fps: 7,
            motion_bucket_id: 127, // ความแรงของการเคลื่อนไหว
            noise_aug_strength: 0.02
          }
        })
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      if (hfRes.status === 503) {
        return res.status(503).json({ error: 'Model is loading, try again in 20s' });
      }
      throw new Error(`HF Error ${hfRes.status}: ${errText}`);
    }

    // 3. HF คืนวิดีโอมาเป็น binary อัพกลับเข้า Blob
    const videoBuffer = await hfRes.arrayBuffer();
    const filename = `hf-${Date.now()}.mp4`;
    const videoBlob = await put(filename, videoBuffer, {
      access: 'public',
      contentType: 'video/mp4'
    });

    return res.status(200).json({ 
      video_url: videoBlob.url,
      engine: 'HuggingFace',
      message: 'Generated free with HF - 3s video'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
