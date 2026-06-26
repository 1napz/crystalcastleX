export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  return res.status(200).json({ 
    video_url: "https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4"
  });
}