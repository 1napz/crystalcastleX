import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const filename = req.headers['x-filename'];
    const fileBuffer = req.body;

    const { data, error } = await supabase.storage
      .from('vaulted')
      .upload(`photos/${filename}`, fileBuffer, {
        contentType: req.headers['content-type'],
        cacheControl: '3600'
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('vaulted')
      .getPublicUrl(`photos/${filename}`);

    res.status(200).json({ url: publicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}