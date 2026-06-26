// api/wavespeed.js
import wavespeed from 'wavespeed';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image_url, prompt } = req.body;

  try {
    // อัปโหลดรูปก่อน (ถ้ามี)
    let imageInput = {};
    if (image_url) {
      const uploadedImageUrl = await wavespeed.upload(image_url);
      imageInput = { image: uploadedImageUrl };
    }

    // สร้างวิดีโอด้วย Wan 2.1 (รองรับ text-to-video และ image-to-video)
    const video = await wavespeed.run('wavespeed-ai/wan-2.1/image-to-video', {
      ...imageInput,
      prompt,
    });

    return res.status(200).json({
      success: true,
      videoUrl: video.outputs[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
