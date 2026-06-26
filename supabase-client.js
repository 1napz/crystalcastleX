// supabase-client.js - เวอร์ชันปลอดภัยสำหรับ crystalcastle v2
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ดึงค่าจาก Vercel Environment Variables ตอน build
// ถ้าใช้ GitHub Pages ธรรมดา ให้เปลี่ยนเป็นค่าตรงๆ ชั่วคราว แล้วค่อยย้ายไป Vercel
const SUPABASE_URL = 'https://wqkreaoqkunjhlzzdimd.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_g4wlVVA-eASs1SMRGSIatA_Gk4Nu13c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// --- ฟังก์ชันเดิม ใช้ได้เลย ---
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
