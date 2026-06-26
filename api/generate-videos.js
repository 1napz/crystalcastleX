// api/generate-video.js
import { createClient } from '@supabase/supabase-js';

// Supabase client สำหรับบันทึก Log (ถ้าต้องการ)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_url, prompt, filename, engine } = req.body;

  if (!image_url || !prompt) {
    return res.status(400).json({ error: 'Missing required fields: image_url, prompt' });
  }

  // ตั้งค่า timeout ตาม engine (บางตัวใช้เวลานาน)
  const TIMEOUTS = {
    fal: 120000,    // 2 นาที
    magic: 120000,
    runway: 180000, // 3 นาที
    pika: 180000,
    nexa: 180000,
    wavespeed: 180000,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUTS[engine] || 120000);

  try {
    let result;

    switch (engine) {
      case 'fal':
        result = await generateWithFAL(image_url, prompt, controller.signal);
        break;
      case 'magic':
        result = await generateWithMagicHour(image_url, prompt, controller.signal);
        break;
      case 'runway':
        result = await generateWithRunway(image_url, prompt, controller.signal);
        break;
      case 'pika':
        result = await generateWithPika(image_url, prompt, controller.signal);
        break;
      case 'nexa':
        result = await generateWithNexaAPI(image_url, prompt, controller.signal);
        break;
      case 'wavespeed':
        result = await generateWithWaveSpeed(image_url, prompt, controller.signal);
        break;
      default:
        // fallback ไปใช้ FAL
        result = await generateWithFAL(image_url, prompt, controller.signal);
    }

    // (Optional) บันทึก log ลง Supabase
    await supabase.from('video_logs').insert({
      engine,
      prompt,
      image_url,
      video_url: result.videoUrl,
      filename,
      created_at: new Date().toISOString(),
    }).catch(e => console.error('Log insert error:', e));

    return res.status(200).json({
      success: true,
      videoUrl: result.videoUrl,
      taskId: result.taskId || null,
      engine,
    });
  } catch (err) {
    console.error(`[generate-video] ${engine} error:`, err);
    return res.status(500).json({ error: err.message });
  } finally {
    clearTimeout(timeout);
  }
}

// -------------------- Engine Implementations --------------------

async function generateWithFAL(image_url, prompt, signal) {
  // ใช้ REST API เรียก FAL Kling
  const response = await fetch('https://api.fal.ai/v1/image-to-video', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url, prompt }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'FAL image-to-video failed');
  }

  const data = await response.json();
  // FAL อาจ return video_url โดยตรงหรือ taskId สำหรับ polling
  if (data.video_url) return { videoUrl: data.video_url };
  if (data.task_id) {
    // รอผลลัพธ์ (สมมุติว่ารอเล็กน้อย)
    const videoUrl = await pollFalTask(data.task_id, signal);
    return { videoUrl, taskId: data.task_id };
  }
  throw new Error('Unexpected FAL response');
}

async function pollFalTask(taskId, signal) {
  // ตัวอย่าง polling จนกว่า video_url จะพร้อม
  let attempts = 0;
  while (attempts < 15) {
    const res = await fetch(`https://api.fal.ai/v1/tasks/${taskId}`, {
      headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      signal,
    });
    const data = await res.json();
    if (data.status === 'COMPLETED' && data.video_url) return data.video_url;
    if (data.status === 'FAILED') throw new Error('FAL task failed');
    await new Promise(r => setTimeout(r, 10000));
    attempts++;
  }
  throw new Error('FAL polling timeout');
}

async function generateWithMagicHour(image_url, prompt, signal) {
  const response = await fetch('https://api.magichour.ai/v1/video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url, prompt }),
    signal,
  });
  if (!response.ok) throw new Error('Magic Hour API error');
  const data = await response.json();
  return { videoUrl: data.url };
}

async function generateWithRunway(image_url, prompt, signal) {
  // ถ้ามี SDK ให้ import ที่ด้านบน: import RunwayML from '@runwayml/sdk';
  // สำหรับตัวอย่างนี้ใช้ fetch ตรงๆ เพื่อไม่ต้อง import SDK (ลดการ limit)
  const response = await fetch('https://api.runwayml.com/v1/image-to-video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RUNWAYML_API_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gen4_turbo',
      promptText: prompt,
      promptImage: image_url,
      ratio: '9:16',
    }),
    signal,
  });
  if (!response.ok) throw new Error('Runway API error');
  const data = await response.json();
  // Runway คืน task id
  if (data.id) {
    // polling อย่างง่าย
    const videoUrl = await pollRunwayTask(data.id, signal);
    return { videoUrl, taskId: data.id };
  }
  throw new Error('No task id from Runway');
}

async function pollRunwayTask(taskId, signal) {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${process.env.RUNWAYML_API_SECRET}` },
      signal,
    });
    const d = await res.json();
    if (d.status === 'SUCCEEDED' && d.output?.video) return d.output.video;
    if (d.status === 'FAILED') throw new Error('Runway task failed');
    await new Promise(r => setTimeout(r, 10000));
  }
  throw new Error('Runway polling timeout');
}

async function generateWithPika(image_url, prompt, signal) {
  const response = await fetch('https://api.pika.art/v1/image-to-video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PIKA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_url,
      duration: 6,
      aspect_ratio: '9:16',
    }),
    signal,
  });
  if (!response.ok) throw new Error('Pika API error');
  const data = await response.json();
  // Pika ปกติคืนวิดีโอเมื่อพร้อม (บางทีอาจต้อง polling)
  return { videoUrl: data.video_url || data.url };
}

async function generateWithNexaAPI(image_url, prompt, signal) {
  // ใช้ NexaAPI aggregator
  const response = await fetch('https://api.nexa-api.com/v1/video/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'veo3', // หรือให้ผู้ใช้เลือก
      prompt,
      image_url,
      duration: 8,
      resolution: '1080p',
      aspect_ratio: '9:16',
    }),
    signal,
  });
  if (!response.ok) throw new Error('NexaAPI error');
  const data = await response.json();
  return { videoUrl: data.url };
}

async function generateWithWaveSpeed(image_url, prompt, signal) {
  const response = await fetch('https://api.wavespeed.ai/v1/image-to-video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WAVESPEED_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'wan-2.1', // หรือให้เลือก
      prompt,
      image: image_url,
    }),
    signal,
  });
  if (!response.ok) throw new Error('WaveSpeed API error');
  const data = await response.json();
  return { videoUrl: data.outputs?.[0] || data.url };
}
