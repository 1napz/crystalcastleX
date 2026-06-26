// supabase-client.js — Client-side Supabase helper
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ✅ กำหนดค่า Supabase โดยตรง (Public values — เปิดเผยได้)
const SUPABASE_URL = 'https://wqkreaoqkunjhlzzdimd.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_F1WgU32_YKoD...' // ใส่ anon key จริงของคุณ

// สร้าง Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// อัปโหลดรูปไป Storage bucket 'videos'
export async function uploadImageToStorage(file, customFilename) {
  const fileExt = file.name.split('.').pop()
  const fileName = customFilename ? `${customFilename}.${fileExt}` : `uploads/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('videos').upload(fileName, file)
  if (error) throw error
  const { data } = supabase.storage.from('videos').getPublicUrl(fileName)
  return data.publicUrl
}

// ดึง Logs จากตาราง groq_logs
export async function fetchLogs(limit = 20) {
  const { data, error } = await supabase
    .from('groq_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// ดึง Artifacts ทั้งหมด
export async function fetchArtifacts(limit = 50) {
  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}