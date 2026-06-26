// src/services/video-service.js
import { USE_MOCK_API, API_BASE } from '../config';
import { 
  mockGenerateVideo, 
  mockUploadImage, 
  mockGeneratePrompt,
  mockGeneratePost 
} from '../mocks/mock-api';

// ============ Real API Calls ============

async function realUploadImage(file, filename) {
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: { 
      'x-filename': filename || file.name,
      'Content-Type': file.type 
    },
    body: file,
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`อัปโหลดไม่สำเร็จ: ${error}`);
  }
  
  return res.json();
}

async function realGenerateVideo(imageUrl, prompt, filename, engine) {
  const res = await fetch(`${API_BASE}/api/generate-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      image_url: imageUrl, 
      prompt, 
      filename, 
      engine 
    }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'สร้างวิดีโอไม่สำเร็จ');
  }
  
  return res.json();
}

async function realGeneratePrompt(productName, category, brand) {
  const res = await fetch(`${API_BASE}/api/generate-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productName, category, brand }),
  });
  
  if (!res.ok) {
    throw new Error('สร้าง Prompt ไม่สำเร็จ');
  }
  
  return res.json();
}

async function realGeneratePost(productName, category, brand, promptText) {
  const res = await fetch(`${API_BASE}/api/generate-post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productName, category, brand, prompt: promptText }),
  });
  
  if (!res.ok) {
    throw new Error('สร้างโพสต์ไม่สำเร็จ');
  }
  
  return res.json();
}

// ============ Exports (อัตโนมัติ switch mock/real) ============

export const uploadImage = USE_MOCK_API ? mockUploadImage : realUploadImage;
export const generateVideo = USE_MOCK_API ? mockGenerateVideo : realGenerateVideo;
export const generatePrompt = USE_MOCK_API ? mockGeneratePrompt : realGeneratePrompt;
export const generatePost = USE_MOCK_API ? mockGeneratePost : realGeneratePost;

// Helper functions
export const isMockMode = () => USE_MOCK_API;

export function getMockStatusMessage() {
  if (USE_MOCK_API) {
    return '🔮 [MOCK MODE] ใช้วิดีโอตัวอย่าง ไม่เสียเครดิต API เหมาะสำหรับทดสอบเท่านั้น';
  }
  return '🎬 [REAL MODE] เรียกใช้ API จริง (FAL/Groq) มีค่าใช้จ่าย';
}