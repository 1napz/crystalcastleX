// src/config/index.js

// ตรวจจับ environment
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';

// ตรวจจับ localhost ฝั่ง client
export const IS_LOCAL = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname === '0.0.0.0');

// เปิด mock mode เมื่อ dev/local และเปิด flag
export const USE_MOCK_API = (IS_DEV || IS_LOCAL) && 
  process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// API Base URL (relative path สำหรับ Next.js)
export const API_BASE = '';

// Mock URLs
export const MOCK_VIDEO_URL = '/mocks/sample-video.mp4';
export const MOCK_IMAGE_URL = '/mocks/sample-image.jpg';

// Feature flags
export const FEATURES = {
  enableVideoGeneration: !USE_MOCK_API,
  enableWebhook: IS_PROD,
  enableAnalytics: IS_PROD,
  enableEmail: IS_PROD || (IS_DEV && process.env.SMTP_HOST),
};

// Log environment บน console (เฉพาะ dev)
if (IS_DEV) {
  console.log('🔧 Environment Config:', {
    IS_DEV,
    IS_PROD,
    IS_LOCAL,
    USE_MOCK_API,
    FEATURES,
  });
}