// auth.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Verify session token
export async function verifySession(token) {
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

// Check if user has required role
export async function hasRole(userId, role) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  if (error) return false
  return data?.role === role
}

// Middleware-compatible auth check
export async function requireAuth(req) {
  const token = req.headers?.authorization?.split(' ')[1]
  if (!token) throw new Error('Unauthorized')
  const user = await verifySession(token)
  if (!token) throw new Error('Invalid session')
  return user
}
