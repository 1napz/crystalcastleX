// api/generate-video.js
import { createClient } from '@supabase/supabase-js';

// Supported engines
const SUPPORTED_ENGINES = ['fal', 'magic', 'runway', 'pika', 'nexa', 'wavespeed'];

// Timeouts per engine (milliseconds)
const TIMEOUTS = {
  fal: 120000,    // 2 minutes
  magic: 120000,
  runway: 180000, // 3 minutes
  pika: 180000,
  nexa: 180000,
  wavespeed: 180000,
};

// Supabase client for logging
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
      error: `Unsupported engine: ${engine}. Use one of: ${SUPPORTED_ENGINES.join(', ')}` 
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
        result = await generateWithFAL(image_url, prompt, controller.signal);
    }

    // Log to Supabase (optional - don't fail if logging fails)
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
    }

    return res.status(200).json({
      success: true,
      videoUrl: result.videoUrl,
      taskId: result.taskId || null,
      engine,
    });

  } catch (err) {
    console.error(`[generate-video] ${engine} error:`, err);
    
    // Handle timeout specifically
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

// -------------------- FAL Implementation --------------------
async function generateWithFAL(image_url, prompt, signal) {
  const response = await fetch('https://api.fal.ai/v1/image-to-video', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      image_url, 
      prompt,
      sync_mode: false // Use async mode
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'FAL API request failed');
  }

  const data = await response.json();
  
  // If video is ready immediately
  if (data.video_url) {
    return { videoUrl: data.video_url };
  }
  
  // Otherwise poll for completion
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

// -------------------- Magic Hour Implementation --------------------
async function generateWithMagicHour(image_url, prompt, signal) {
  const response = await fetch('https://api.magichour.ai/v1/video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      image_url, 
      prompt,
      duration: 6
    }),
    signal,
  });
  
  if (!response.ok) {
    throw new Error(`Magic Hour API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.url) {
    throw new Error('Magic Hour response missing video URL');
  }
  
  return { videoUrl: data.url };
}

// -------------------- Runway Implementation --------------------
async function generateWithRunway(image_url, prompt, signal) {
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
  
  if (!response.ok) {
    throw new Error(`Runway API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.id) {
    const videoUrl = await pollRunwayTask(data.id, signal);
    return { videoUrl, taskId: data.id };
  }
  
  throw new Error('Runway response missing task ID');
}

async function pollRunwayTask(taskId, signal) {
  const maxAttempts = 30;
  const pollInterval = 10000; // 10 seconds
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: { 'Authorization': `Bearer ${process.env.RUNWAYML_API_SECRET}` },
      signal,
    });
    
    if (!res.ok) {
      throw new Error(`Runway polling failed: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (data.status === 'SUCCEEDED') {
      const videoUrl = data.output?.video;
      if (videoUrl) return videoUrl;
      throw new Error('Runway completed but no video URL');
    }
    
    if (data.status === 'FAILED') {
      throw new Error('Runway task failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error('Runway polling timeout');
}

// -------------------- Pika Implementation --------------------
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
  
  if (!response.ok) {
    throw new Error(`Pika API error: ${response.status}`);
  }
  
  const data = await response.json();
  const videoUrl = data.video_url || data.url;
  
  if (!videoUrl) {
    throw new Error('Pika response missing video URL');
  }
  
  return { videoUrl };
}

// -------------------- NexaAPI Implementation --------------------
async function generateWithNexaAPI(image_url, prompt, signal) {
  const response = await fetch('https://api.nexa-api.com/v1/video/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'veo3',
      prompt,
      image_url,
      duration: 8,
      resolution: '1080p',
      aspect_ratio: '9:16',
    }),
    signal,
  });
  
  if (!response.ok) {
    throw new Error(`NexaAPI error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.url) {
    throw new Error('NexaAPI response missing video URL');
  }
  
  return { videoUrl: data.url };
}

// -------------------- WaveSpeed Implementation --------------------
async function generateWithWaveSpeed(image_url, prompt, signal) {
  const response = await fetch('https://api.wavespeed.ai/v1/image-to-video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WAVESPEED_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'wan-2.1',
      prompt,
      image: image_url,
    }),
    signal,
  });
  
  if (!response.ok) {
    throw new Error(`WaveSpeed API error: ${response.status}`);
  }
  
  const data = await response.json();
  const videoUrl = data.outputs?.[0] || data.url;
  
  if (!videoUrl) {
    throw new Error('WaveSpeed response missing video URL');
  }
  
  return { videoUrl };
}