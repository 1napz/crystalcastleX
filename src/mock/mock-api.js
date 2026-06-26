// src/mocks/mock-api.js
import { MOCK_VIDEO_URL, MOCK_IMAGE_URL } from '../config';

// สุ่ม delay เพื่อจำลอง network latency
const randomDelay = (min = 500, max = 2000) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

// จำลองการสร้างวิดีโอ
export async function mockGenerateVideo(imageUrl, prompt, filename, engine) {
  console.log(`[MOCK] generateVideo:`, { imageUrl, prompt: prompt.slice(0, 50), filename, engine });
  
  await randomDelay(1000, 2500);
  
  // จำลองความล้มเหลว 10% เพื่อทดสอบ error handling
  const shouldFail = Math.random() < 0.1;
  if (shouldFail) {
    throw new Error('[MOCK] Random error - ทดสอบการจัดการข้อผิดพลาด');
  }
  
  return {
    success: true,
    videoUrl: MOCK_VIDEO_URL,
    taskId: `mock-task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    duration: 5,
    message: '[MOCK] ใช้วิดีโอตัวอย่าง (ไม่เสียเครดิต API)',
    engine,
  };
}

// จำลองการอัปโหลดรูป
export async function mockUploadImage(file, filename) {
  console.log(`[MOCK] uploadImage: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  
  await randomDelay(300, 800);
  
  // สร้าง object URL สำหรับแสดงผล
  const objectUrl = URL.createObjectURL(file);
  
  return {
    success: true,
    url: objectUrl,
    filename: filename || file.name,
    size: file.size,
    message: '[MOCK] อัปโหลดเสร็จสิ้น (local only)',
  };
}

// จำลองการสร้าง Prompt ด้วย AI
export async function mockGeneratePrompt(productName, category, brand) {
  console.log(`[MOCK] generatePrompt: ${productName}, ${category}, ${brand}`);
  
  await randomDelay(400, 1200);
  
  const prompts = {
    skincare: `✨ Glowing skin transformation with ${productName}. Beautiful before-after smooth transition, soft natural lighting, elegant and clean aesthetic. Slow zoom in on radiant skin, dewy finish, 4K quality. Hashtags: #skincare #glowup`,
    
    electronics: `⚡ Futuristic ${productName} showcase. Sleek 360-degree rotation, neon light trails, holographic effects, cyberpunk aesthetic. Dynamic camera movement with slow-motion details. Premium tech vibe. #tech #innovation`,
    
    fashion: `👗 Elegant ${productName} on moving model. Fabric flowing in gentle breeze, golden hour lighting, cinematic B-roll shots. Soft focus background transitions, luxury lifestyle aesthetic. #fashion #style`,
    
    food: `🍜 Delicious ${productName} cooking process. Steam rising, sizzling sounds implied, warm lighting, overhead shots with smooth panning. Fresh ingredients, mouth-watering close-ups. #food #cooking`,
    
    default: `Beautiful showcase of ${productName}. Smooth cinematic transitions, professional product photography lighting, soft shadows, clean background. Engaging movement for social media, 4K quality, viral-ready.`,
  };
  
  const selectedPrompt = prompts[category] || prompts.default;
  const withBrand = brand ? selectedPrompt.replace(productName, `${brand} ${productName}`) : selectedPrompt;
  
  return {
    success: true,
    prompt: withBrand,
    category,
    message: '[MOCK] Prompt สร้างจาก template (ไม่เรียก Groq)',
  };
}

// จำลองการสร้าง Caption/Post
export async function mockGeneratePost(productName, category, brand, promptText) {
  console.log(`[MOCK] generatePost: ${productName}`);
  
  await randomDelay(300, 700);
  
  return {
    success: true,
    caption: `✨ พบกับสินค้าใหม่สุดปัง! ${productName}${brand ? ` by ${brand}` : ''}\n\nคุณภาพเยี่ยม ราคาสุดคุ้ม สั่งซื้อวันนี้รับโปรโมชั่นพิเศษ! 🎉\n\n#${productName.replace(/\s/g, '')} #รีวิวสินค้า #ของดีบอกต่อ`,
    hashtags: ['#รีวิวสินค้า', '#ของดีบอกต่อ', '#โปรโมชั่น', '#CrystalCastle'],
    message: '[MOCK] Caption สร้างจาก template',
  };
}