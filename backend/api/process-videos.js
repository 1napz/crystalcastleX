// pages/api/process-video.js
import { createClient } from '@supabase/supabase-js';
import { generateWithFAL, generateWithMagicHour } from '../../lib/video-engines';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // ตรวจสอบ authorization จาก QStash (optional แต่แนะนำ)
  // if (req.headers['upstash-signature'] !== expected) return 401;

  const { taskId } = req.body;
  if (!taskId) return res.status(400).json({ error: 'Missing taskId' });

  // 1. ดึง task และ mark as processing
  const { data: task, error } = await supabase
    .from('video_tasks')
    .update({ status: 'processing', updated_at: new Date() })
    .eq('id', taskId)
    .select()
    .single();

  if (error || !task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  try {
    let videoUrl;
    if (task.engine === 'fal') {
      videoUrl = await generateWithFAL(task.image_url, task.prompt);
    } else if (task.engine === 'magic') {
      videoUrl = await generateWithMagicHour(task.image_url, task.prompt);
    } else {
      throw new Error(`Unsupported engine: ${task.engine}`);
    }

    // 2. Update task as completed
    await supabase
      .from('video_tasks')
      .update({
        status: 'completed',
        video_url: videoUrl,
        updated_at: new Date(),
      })
      .eq('id', taskId);

    // Optional: log to video_logs table
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    await supabase
      .from('video_tasks')
      .update({
        status: 'failed',
        error: err.message,
        updated_at: new Date(),
      })
      .eq('id', taskId);
    return res.status(500).json({ error: err.message });
  }
}