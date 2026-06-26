// src/utils/helpers.js

// Debounce function (จาก product.js ย้ายมา)
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate unique ID
export function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate image file
export function isValidImageFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const maxSize = 6 * 1024 * 1024; // 6MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('กรุณาเลือกไฟล์ JPEG, PNG หรือ WEBP เท่านั้น');
  }
  if (file.size > maxSize) {
    throw new Error('ไฟล์ต้องไม่เกิน 6MB');
  }
  return true;
}

// Save to localStorage with limit
export function saveToHistory(key, value, maxItems = 50) {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  if (!saved.includes(value)) {
    saved.unshift(value);
    if (saved.length > maxItems) saved.pop();
    localStorage.setItem(key, JSON.stringify(saved));
  }
}

// Check duplicate
export function isDuplicate(key, value) {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  return saved.includes(value);
}