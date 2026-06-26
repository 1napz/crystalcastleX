// api/video/pika.js
import { fal } from '@fal-ai/client';

// ตั้งค่า API Key (ครั้งเดียวตอนเริ่ม server)
fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image_url, prompt } = req.body;

  try {
    // Image-to-Video ด้วย Pika 2.2
    const result = await fal.subscribe('fal-ai/pika/v2.2/image-to-video', {
      input: {
        prompt,
        image_url,
        duration: 6,
        aspect_ratio: '9:16',
      },
    });

    return res.status(200).json({
      success: true,
      videoUrl: result.data.video.url,
    });
  } catch (err) {
    console.error('Pika error:', err);
    return res.status(500).json({ error: err.message });
  }
}
