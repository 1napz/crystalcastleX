// api/generate-video.js
import { createClient } from '@supabase/supabase-js';

// ----------------------------------------------------------------------
// 1. Configuration & Environment Validation
// ----------------------------------------------------------------------
const SUPPORTED_ENGINES = ['fal', 'magic'];         // engines ที่เปิดใช้งานจริง
const FALLBACK_CHAIN = { fal: 'magic', magic: null }; // ถ้า fal ล้ม ให้ลอง magic
// Supported engines (เฉพาะที่ใช้งานได้จริง)
const SUPPORTED_ENGINES = ['fal', 'magic'];

const TIMEOUTS = {
  fal: 120000,   // 2 minutes
  magic: 120000,
  // runway: 180000,
  // pika: 180000,
  // nexa: 180000,
  // wavespeed: 180000,
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for server');
}
const supabase = createClient(supabaseUrl, supabaseServiceKey);
  magic: 120000, // 2 minutes
};

// ✅ ใช้ service role key สำหรับ API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ต้องมีใน env
);

// ----------------------------------------------------------------------
// 2. Main Handler
// ----------------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_url, prompt, filename, engine = 'fal' } = req.body;

  if (!image_url || !prompt) {
    return res.status(400).json({ error: 'Missing required fields: image_url, prompt' });
  }
  if (!SUPPORTED_ENGINES.includes(engine)) {
    return res.status(400).json({ error: `Unsupported engine: ${engine}. Supported: ${SUPPORTED_ENGINES.join(', ')}` });
    return res.status(400).json({ 
      error: `Unsupported engine: ${engine}. Use: ${SUPPORTED_ENGINES.join(', ')}` 
    });
  }

  // Fallback logic: ถ้า engine primary ล้ม ให้ลอง fallback engine
  const enginesToTry = [engine, FALLBACK_CHAIN[engine]].filter(Boolean);
  let lastError = null;

  for (const currentEngine of enginesToTry) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUTS[currentEngine]);
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
      let result;
      switch (currentEngine) {
        case 'fal':
          result = await generateWithFAL(image_url, prompt, controller.signal);
          break;
        case 'magic':
          result = await generateWithMagicHour(image_url, prompt, controller.signal);
          break;
        // ----- Engines ที่ยังไม่เปิดใช้งาน (comment ไว้) -----
        // case 'runway':
        //   result = await generateWithRunway(image_url, prompt, controller.signal);
        //   break;
        // case 'pika':
        //   result = await generateWithPika(image_url, prompt, controller.signal);
        //   break;
        // case 'nexa':
        //   result = await generateWithNexaAPI(image_url, prompt, controller.signal);
        //   break;
        // case 'wavespeed':
        //   result = await generateWithWaveSpeed(image_url, prompt, controller.signal);
        //   break;
        default:
          throw new Error(`Engine ${currentEngine} not implemented`);
      }

      // Log ลง Supabase (ไม่ให้กระทบ response)
      try {
        await supabase.from('video_logs').insert({
          engine: currentEngine,
          prompt,
          image_url,
          video_url: result.videoUrl,
          filename: filename || 'unknown',
          created_at: new Date().toISOString(),
        });
      } catch (logErr) {
        console.error('Log insert error:', logErr);
      }

      return res.status(200).json({
        success: true,
        videoUrl: result.videoUrl,
        taskId: result.taskId || null,
        engine: currentEngine,
        fallbackUsed: currentEngine !== engine,
      });
    } catch (err) {
      lastError = err;
      console.error(`[${currentEngine}] failed:`, err.message);
      // ถ้ามี fallback engine ต่อไป ให้ลองต่อ
      if (currentEngine === enginesToTry[enginesToTry.length - 1]) break;
      // else continue to next engine
    } finally {
      clearTimeout(timeout);
    }
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

  // ถ้าทุก engine ล้มเหลว
  return res.status(500).json({
    error: `All engines failed. Last error: ${lastError?.message || 'Unknown error'}`,
  });
}

// ----------------------------------------------------------------------
// 3. Engine Implementations (เฉพาะที่ใช้งานได้จริง + comment สำหรับอนาคต)
// ----------------------------------------------------------------------

// ---------- FAL (Kling) ----------
async function generateWithFAL(image_url, prompt, signal) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) throw new Error('FAL_KEY is missing');

// ==================== FAL Implementation (Kling) ====================
async function generateWithFAL(image_url, prompt, signal) {
  // ✅ ใช้ API endpoint ที่ถูกต้อง
  const response = await fetch('https://api.fal.ai/v1/kling/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${falKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url, prompt, duration: 6, aspect_ratio: '9:16' }),
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
    throw new Error(err.detail || err.message || `FAL API error: ${response.status}`);
    throw new Error(err.detail || err.message || 'FAL API request failed');
  }
  const data = await response.json();
  if (data.video_url) return { videoUrl: data.video_url };
  
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
  const falKey = process.env.FAL_KEY;
  for (let attempt = 0; attempt < 30; attempt++) {
    const res = await fetch(`https://api.fal.ai/v1/requests/${requestId}`, {
      headers: { 'Authorization': `Key ${falKey}` },
      signal,
    });
    if (!res.ok) throw new Error(`FAL polling failed: ${res.status}`);
    const data = await res.json();
    if (data.status === 'COMPLETED') {
      const videoUrl = data.output?.video_url || data.output?.video;
      if (videoUrl) return videoUrl;
      throw new Error('FAL completed but no video URL');
    }
    if (data.status === 'FAILED') throw new Error(`FAL task failed: ${data.error}`);
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('FAL polling timeout');
}

// ---------- Magic Hour ----------
async function generateWithMagicHour(image_url, prompt, signal) {
  const magicKey = process.env.MAGIC_HOUR_API_KEY;
  if (!magicKey) throw new Error('MAGIC_HOUR_API_KEY is missing');

  const response = await fetch('https://api.magichour.ai/v1/video/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${magicKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url, prompt, duration: 6, aspect_ratio: '9:16' }),
    signal,
  });
  if (!response.ok) throw new Error(`Magic Hour API error: ${response.status}`);
  const data = await response.json();
  const videoUrl = data.video_url || data.url || data.output?.video;
  if (!videoUrl) throw new Error('Magic Hour response missing video URL');
  return { videoUrl };
}

// ---------- Engines ในอนาคต (comment ไว้ พร้อมวิธีเปิดใช้งาน) ----------
/*
async function generateWithRunway(image_url, prompt, signal) { ... }
async function generateWithPika(image_url, prompt, signal) { ... }
async function generateWithNexaAPI(image_url, prompt, signal) { ... }
async function generateWithWaveSpeed(image_url, prompt, signal) { ... }
*/
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
