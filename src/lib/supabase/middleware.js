// middleware.ts - Supabase Auth version
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // ตรวจสอบ session ปัจจุบัน
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ถ้ายังไม่ล็อกอิน และพยายามเข้า /product → ไป login
  if (!user && pathname === '/product') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ถ้าล็อกอินแล้ว และอยู่ที่ /login → ไป /product
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/product', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/product',
    '/login',
    '/api/protected/:path*',
  ],
};