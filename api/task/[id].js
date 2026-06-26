// pages/api/task/[id].js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;
  const { data: task, error } = await supabase
    .from('video_tasks')
    .select('status, video_url, error')
    .eq('id', id)
    .single();

  if (error || !task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  return res.status(200).json({
    status: task.status,
    videoUrl: task.video_url,
    error: task.error,
  });
}