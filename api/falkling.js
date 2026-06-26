export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'ใช้เฉพาะ POST เท่านั้น'
    });
  }

  const { image_url, prompt, filename } = req.body;

  if (!image_url || !prompt) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'ต้องการ image_url และ prompt',
      received: { image_url: !!image_url, prompt: !!prompt }
    });
  }

  try {
    // ตรวจสอบ API key
    if (!process.env.FAL_API_KEY) {
      console.warn('⚠️ FAL_API_KEY not set, using sample video');
      return res.status(200).json({ 
        video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
        warning: 'FAL_API_KEY not configured, using sample video',
        status: 'fallback'
      });
    }

    console.log(`🎬 Calling FAL Kling API, filename: ${filename}`);

    // FAL API call (ปรับ endpoint ให้ตรงกับเอกสารของ FAL)
    const response = await fetch('https://api.fal.ai/v1/kling/video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        image_url, 
        prompt, 
        duration: 5,
        cfg_scale: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ FAL API error: ${response.status}`, errorText);
      return res.status(502).json({ 
        error: 'FAL API failed',
        status: response.status,
        details: errorText,
        video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
        fallback: true
      });
    }

    const data = await response.json();
    const videoUrl = data.video_url || data.output?.video_url;
    
    if (!videoUrl) {
      console.error('❌ No video_url in FAL response', data);
      return res.status(502).json({ 
        error: 'Invalid response from FAL',
        details: 'ไม่พบ video_url ใน response',
        video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
        fallback: true
      });
    }
    
    console.log('✅ Video generated successfully');
    res.status(200).json({ 
      video_url: videoUrl,
      status: 'success'
    });
    
  } catch (error) {
    console.error('🔥 FAL handler error:', error.message);
    // สำคัญ: fallback เป็น sample video แทน error 500
    res.status(200).json({ 
      video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
      error: error.message,
      status: 'fallback',
      note: 'Using sample video due to error'
    });
  }
}