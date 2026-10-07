// api/video.js - FAL Kling Integration + Logging to Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // ตั้งค่า CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // รับเฉพาะ POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_url, prompt, filename } = req.body;
  
  // ตรวจสอบข้อมูลที่จำเป็น
  if (!image_url || !prompt) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'ต้องการ image_url และ prompt'
    });
  }

  // ========== 1. บันทึก Log ก่อนเริ่มสร้างวิดีโอ ==========
  let logId = null;
  try {
    const { data: logData, error: logError } = await supabase
      .from('video_logs')
      .insert([{ 
        engine: 'FAL',
        prompt: prompt,
        image_url: image_url,
        filename: filename || null,
        status: 'pending',
        user_email: req.headers['x-user-email'] || 'anonymous',
        created_at: new Date().toISOString()
      }])
      .select();
      
    if (!logError && logData && logData[0]) {
      logId = logData[0].id;
      console.log(`📝 Log created: ${logId}`);
    } else {
      console.warn('⚠️ Could not create log:', logError);
    }
  } catch (err) {
    console.warn('Log insert warning:', err.message);
  }

  // ========== 2. ตรวจสอบ API Key ==========
  if (!process.env.FAL_API_KEY) {
    console.warn('⚠️ FAL_API_KEY not set, using sample video');
    
    // อัปเดต Log เป็น success (แต่ใช้ sample)
    if (logId) {
      await supabase
        .from('video_logs')
        .update({ 
          status: 'success', 
          video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
          note: 'sample video - no API key'
        })
        .eq('id', logId);
    }
    
    return res.status(200).json({ 
      success: true,
      video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
      message: 'Video demo mode (configure FAL_API_KEY for real generation)'
    });
  }

  // ========== 3. เรียก FAL Kling API จริง ==========
  try {
    console.log(`🎬 Calling FAL Kling API with prompt: ${prompt.substring(0, 50)}...`);
    
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
      
      // อัปเดต Log เป็น failed
      if (logId) {
        await supabase
          .from('video_logs')
          .update({ 
            status: 'failed',
            error_message: `HTTP ${response.status}: ${errorText.substring(0, 200)}`
          })
          .eq('id', logId);
      }
      
      // ส่ง fallback sample video แทน error 500
      return res.status(200).json({ 
        success: true,
        video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
        warning: 'FAL API failed, using sample video',
        error: errorText
      });
    }

    const data = await response.json();
    const videoUrl = data.video_url || data.output?.video_url;
    
    if (!videoUrl) {
      console.error('❌ No video_url in FAL response', data);
      
      if (logId) {
        await supabase
          .from('video_logs')
          .update({ 
            status: 'failed',
            error_message: 'No video_url in response'
          })
          .eq('id', logId);
      }
      
      return res.status(200).json({ 
        success: true,
        video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
        warning: 'Invalid FAL response, using sample video'
      });
    }
    
    // ========== 4. สำเร็จ: อัปเดต Log ==========
    if (logId) {
      await supabase
        .from('video_logs')
        .update({ 
          status: 'success', 
          video_url: videoUrl,
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);
      console.log(`✅ Log updated: ${logId} - success`);
    }
    
    console.log('✅ Video generated successfully');
    res.status(200).json({ 
      success: true,
      video_url: videoUrl,
      message: 'Video generated with FAL Kling'
    });
    
  } catch (error) {
    console.error('🔥 FAL handler error:', error.message);
    
    // อัปเดต Log เป็น failed
    if (logId) {
      await supabase
        .from('video_logs')
        .update({ 
          status: 'failed',
          error_message: error.message
        })
        .eq('id', logId);
    }
    
    // fallback สำคัญ: คืน sample video แทน error 500
    res.status(200).json({ 
      success: true,
      video_url: 'https://cdn.coverr.co/videos/coverr-fashion-model-walking-8175/1080p.mp4',
      error: error.message,
      note: 'Using sample video due to error'
    });
  }
}