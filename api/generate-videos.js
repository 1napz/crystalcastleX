// api/generate-video.js
import { createClient } from '@supabase/supabase-js';

// Supported engines (เฉพาะที่ใช้งานได้จริง)
const SUPPORTED_ENGINES = ['fal', 'magic'];

// Timeouts per engine (milliseconds)
const TIMEOUTS = {
  fal: 120000,   // 2 minutes
  magic: 120000, // 2 minutes
};

// ✅ ใช้ service role key สำหรับ API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ต้องมีใน env
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_url, prompt, filename, engine = 'fal' } = req.body;

  // Validate required fields
  if (!image_url || !prompt) {
    return res.status(400).json({ 
      error: 'Missing required fields: image_url, prompt' 
    });
  }

  // Validate engine
  if (!SUPPORTED_ENGINES.includes(engine)) {
    return res.status(400).json({ 
      error: `Unsupported engine: ${engine}. Use: ${SUPPORTED_ENGINES.join(', ')}` 
    });
  }

  // Setup timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUTS[engine] || 120000);

  try {
    let result;

    // Route to appropriate engine
    switch (engine) {
      case 'fal':
        result = await generateWithFAL(image_url, prompt, controller.signal);
        break;
      case 'magic':
        result = await generateWithMagicHour(image_url, prompt, controller.signal);
        break;
      default:
        result = await generateWithFAL(image_url, prompt, controller.signal);
    }

    // ✅ Log to Supabase (use try-catch to prevent breaking)
    try {
      await supabase.from('video_logs').insert({
        engine,
        prompt,
        image_url,
        video_url: result.videoUrl,
        filename: filename || 'unknown',
        created_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error('Log insert error:', logError);
      // Don't fail the request if logging fails
    }

    return res.status(200).json({
      success: true,
      videoUrl: result.videoUrl,
      taskId: result.taskId || null,
      engine,
    });

  } catch (err) {
    console.error(`[generate-video] ${engine} error:`, err);
    
    if (err.name === 'AbortError') {
      return res.status(504).json({ 
        error: `Request timeout after ${TIMEOUTS[engine] / 1000} seconds` 
      });
    }
    
    return res.status(500).json({ 
      error: err.message || 'Video generation failed' 
    });
  } finally {
    clearTimeout(timeout);
  }
}

// ==================== FAL Implementation (Kling) ====================
async function generateWithFAL(image_url, prompt, signal) {
  // ✅ ใช้ API endpoint ที่ถูกต้อง
  const response = await fetch('https://api.fal.ai/v1/kling/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      image_url, 
      prompt,
      duration: 6,
      aspect_ratio: '9:16',
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.message || 'FAL API request failed');
  }

  const data = await response.json();
  
  // Check if video is ready immediately
  if (data.video_url) {
    return { videoUrl: data.video_url };
  }
  
  // Otherwise get request_id for polling
  if (data.request_id) {
    const videoUrl = await pollFALTask(data.request_id, signal);
    return { videoUrl, taskId: data.request_id };
  }
  
  throw new Error('Unexpected FAL response format');
}

async function pollFALTask(requestId, signal) {
  const maxAttempts = 30;
  const pollInterval = 5000; // 5 seconds
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(`https://api.fal.ai/v1/requests/${requestId}`, {
      headers: { 'Authorization': `Key ${process.env.FAL_KEY}` },
      signal,
    });
    
    if (!res.ok) {
      throw new Error(`FAL polling failed: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (data.status === 'COMPLETED') {
      const videoUrl = data.output?.video_url || data.output?.video;
      if (videoUrl) return videoUrl;
      throw new Error('FAL completed but no video URL found');
    }
    
    if (data.status === 'FAILED') {
      throw new Error(`FAL task failed: ${data.error || 'Unknown error'}`);
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error('FAL polling timeout after 30 attempts');
}

// ==================== Magic Hour Implementation ====================
async function generateWithMagicHour(image_url, prompt, signal) {
  const response = await fetch('https://api.magichour.ai/v1/video/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      image_url, 
      prompt,
      duration: 6,
      aspect_ratio: '9:16',
    }),
    signal,
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Magic Hour API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Magic Hour might return video_url or url
  const videoUrl = data.video_url || data.url || data.output?.video;
  
  if (!videoUrl) {
    throw new Error('Magic Hour response missing video URL');
  }
  
  return { videoUrl };
}