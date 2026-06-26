// middleware.ts - ต้องอยู่ root project เท่านั้น
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // ถ้า set มาจาก Server Component จะ error ต้อง catch ไว้
          request.cookies.set({ name, value,...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value,...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '',...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '',...options })
        },
      },
    }
  )

  // สำคัญ: ต้องเรียก getUser เพื่อ refresh session
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ตัวอย่าง: กันหน้า /product ถ้าไม่ login
  if (!user && pathname.startsWith('/product')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ถ้า login แล้วเข้า /login ให้เด้งไป /product
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/product', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/product/:path*',
    '/login',
    '/api/protected/:path*',
  ],
}