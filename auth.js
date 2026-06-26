// auth.js - ฟังก์ชันเกี่ยวกับการยืนยันตัวตน
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://wqkreaoqkunjhlzzdimd.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_g4wlvVA-eASs1SMRGSIatA_Gk4Nu13c'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ตรวจสอบสถานะผู้ใช้ และ redirect ถ้ายังไม่ login
export async function requireAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        window.location.href = '/login.html'
        return null
    }
    return session.user
}

// รับข้อมูลผู้ใช้ปัจจุบัน
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// logout
export async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/login.html'
}

// แสดงชื่อผู้ใช้ (ถ้ามี)
export function getUserDisplayName(user) {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
}
