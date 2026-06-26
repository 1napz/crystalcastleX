// api/nexa.js
import NexaAPI from 'nexaapi';

const client = new NexaAPI({
  apiKey: process.env.NEXA_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image_url, prompt, model = 'veo3' } = req.body;

  try {
    const response = await client.video.generate({
      model,           // 'veo3', 'kling-v3-pro', 'sora2'
      prompt,
      image_url,       // สำหรับ image-to-video
      duration: 8,
      resolution: '1080p',
      aspect_ratio: '9:16',
      audio: true,     // Veo รองรับ native audio
    });

    return res.status(200).json({
      success: true,
      videoUrl: response.url,
      cost: response.cost,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
