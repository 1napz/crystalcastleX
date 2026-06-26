// supabase-client.js = สายโทรศัพท์หา DB เวอร์ชัน HTML ธรรมดา
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// 1. ที่อยู่ฐานข้อมูล - ก็อปมาจาก Supabase > Settings > API > Project URL
const SUPABASE_URL = 'https://1napzfwrdmsgnwpmctzv.supabase.co'

// 2. กุญแจคนทั่วไป - ก็อปมาจาก Supabase > Settings > API > anon public
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 

// 3. สร้างตัวเชื่อม DB ให้ไฟล์ app.js ใช้
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// --- ฟังก์ชันที่เหลือใช้เหมือนเดิมได้เลย ---
export async function uploadImageToStorage(file) {
  const filePath = `pika/${Date.now()}-${file.name}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/vaulted/${filePath}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': file.type },
    body: file
  });
  if (!res.ok) throw new Error('Upload failed');
  return `${SUPABASE_URL}/storage/v1/object/public/vaulted/${filePath}`;
}

export async function generatePikaVideo(prompt, imageUrl) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-generate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, image_url: imageUrl })
  });
  return await res.json();
}

export async function checkPikaStatus(jobId) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-status?job_id=${jobId}`, {
    headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  });
  return await res.json();
}

export async function getPikaCredits() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-status`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'get_credits' })
  });
  const data = await res.json();
  return data.credits || '-';
}
