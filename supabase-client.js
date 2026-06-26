import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://wqkreaoqkunjhlzzdimd.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_g4wlvVA-eASs1SMRGSIatA_Gk4Nu13c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function uploadImageToStorage(file) {
  const filePath = `pika/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('vaulted').upload(filePath, file)
  if (error) throw error
  const { data } = supabase.storage.from('vaulted').getPublicUrl(filePath)
  return data.publicUrl
}

export async function generatePikaVideo(prompt, imageUrl) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-generate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, image_url: imageUrl })
  })
  return await res.json()
}

export async function checkPikaStatus(jobId) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-status?job_id=${jobId}`, {
    headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  })
  return await res.json()
}

export async function getPikaCredits() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/pika-status`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'get_credits' })
  })
  const data = await res.json()
  return data.credits || '-'
}

export async function fetchLogs() {
  const { data } = await supabase.from('filenames').select('*').order('created_at', { ascending: false }).limit(20)
  return data || []
}
