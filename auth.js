// auth.js - เพิ่ม Admin Bypass
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://wqkreaoqkunjhlzzdimd.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_g4wlvVA-eASs1SMRGSIatA_Gk4Nu13c'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 🔥 กำหนดอีเมล Admin (ไม่ต้อง Login)
const ADMIN_EMAILS = [
    'your-email@gmail.com',      // <-- ใส่อีเมลคุณตรงนี้
    'team@crystalcastle.com'     // <-- เพิ่มอีเมลทีมได้
]

// ตรวจสอบว่าเป็น Admin ไหม (ไม่ต้อง Login)
export function isAdmin(email) {
    return ADMIN_EMAILS.includes(email)
}

// ตรวจสอบสถานะผู้ใช้ + Admin Bypass
export async function requireAuth() {
    // 🔥 ตรวจสอบ Admin จาก localStorage ก่อน
    const adminEmail = localStorage.getItem('admin_email')
    if (adminEmail && isAdmin(adminEmail)) {
        return { user: { email: adminEmail, role: 'admin' }, isAdmin: true }
    }
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        window.location.href = '/login.html'
        return null
    }
    return { user: session.user, isAdmin: false }
}

// Login แบบ Admin (ไม่ต้องใช้ Supabase)
export function loginAsAdmin(email) {
    if (isAdmin(email)) {
        localStorage.setItem('admin_email', email)
        window.location.href = '/product.html'
        return true
    }
    return false
}

// Logout (รวม Admin)
export async function logout() {
    localStorage.removeItem('admin_email')
    await supabase.auth.signOut()
    window.location.href = '/login.html'
}

// แสดงชื่อผู้ใช้
export function getUserDisplayName(user) {
    if (user?.role === 'admin') return `Admin (${user.email})`
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
}
