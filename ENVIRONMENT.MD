### 3.2 Supabase - Auth + Database
```bash
# Public - ใช้ได้ทั้ง Client/Server
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-only - ห้ามใช้ใน Client Components
# ใช้ใน: API Routes, Server Actions, middleware.ts
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...