export default async function handler(req, res) {
  const { image_url, prompt } = req.body;
  const r = await fetch('https://api.magichour.ai/v1/image-to-video', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.MAGIC_HOUR_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url, prompt, duration: 5 })
  });
  const d = await r.json();
  res.json({ video_url: d.video_url });
}