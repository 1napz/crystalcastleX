export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image_url, prompt } = req.body;

  try {
    const response = await fetch('https://api.magichour.ai/v1/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_url, prompt, duration: 5 })
    });

    const data = await response.json();
    res.status(200).json({ video_url: data.video_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}