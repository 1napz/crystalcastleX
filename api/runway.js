// api/video/runway.js
import RunwayML from '@runwayml/sdk';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image_url, prompt } = req.body;

  try {
    // ส่ง request สร้างวิดีโอจากรูปภาพ
    const result = await client.imageToVideo.create({
      model: 'gen4_turbo',
      promptImage: image_url,
      promptText: prompt,
      ratio: '9:16', // แนวตั้งสำหรับ TikTok/Shopee
    });

    // result.id ใช้ดึงวิดีโอเมื่อสร้างเสร็จ
    // Runway SDK มี retry ในตัว 2 ครั้ง
    return res.status(200).json({
      success: true,
      taskId: result.id,
      message: 'กำลังสร้าง... ใช้เวลาประมาณ 1-2 นาที',
    });
  } catch (err) {
    console.error('Runway error:', err);
    return res.status(500).json({ error: err.message });
  }
}
