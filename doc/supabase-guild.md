# 🧱 Supabase Guide — ตั้งแต่เริ่มต้นจนถึงความปลอดภัย

คู่มือนี้ครอบคลุมทุกสิ่งที่คุณต้องรู้เกี่ยวกับ Supabase สำหรับโปรเจกต์ Crystal Castle รวมถึงการตั้งค่าฐานข้อมูล, RLS, Storage, Authentication และแนวทางปฏิบัติที่ดีสำหรับ Repository สาธารณะ

---

## 🔐 1. ทำความเข้าใจ Supabase Keys

Supabase มีคีย์สำคัญ 2 ตัวที่ใช้ในสถานการณ์ต่างกัน:

| คีย์ | เปิดเผยได้? | ใช้ที่ไหน | สิทธิ์ |
|------|------------|-----------|--------|
| `anon` (public) | ✅ ได้ (แต่ควรเป็น env) | Client-side (เบราว์เซอร์) | ต้องใช้ร่วมกับ RLS |
| `service_role` | ❌ ห้ามเด็ดขาด | API Routes / Edge Functions | ข้าม RLS ทั้งหมด |

**หลักการสำคัญ:**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → ใช้ใน Client และ API Route ที่ไม่ต้องการสิทธิ์สูง
- `SUPABASE_SERVICE_ROLE_KEY` → เฉพาะใน API Route ที่ต้องการ bypass RLS (ต้องระวัง)

---

## 🛡️ 2. Row Level Security (RLS) คือหัวใจ

RLS คือชั้นความปลอดภัยที่ควบคุมว่าใครเข้าถึงแถวใดได้บ้าง **ต้องเปิด RLS ทุกตารางที่ Client เข้าถึง**

### 2.1 เปิด/ปิด RLS
```sql
ALTER TABLE public.groq_logs ENABLE ROW LEVEL SECURITY;
```

### 2.2 ตัวอย่าง Policies ที่ใช้ในโปรเจกต์

#### ✅ ตาราง `groq_logs`
```sql
-- ทุกคนอ่านได้
CREATE POLICY "Public read access" ON public.groq_logs
FOR SELECT USING (true);

-- Server (API Route) เท่านั้นที่ insert ได้
CREATE POLICY "Server insert access" ON public.groq_logs
FOR INSERT WITH CHECK (true);
```

#### ✅ ตาราง `artifacts`
```sql
-- อ่านได้ทุกคน
CREATE POLICY "Anyone can view artifacts" ON public.artifacts
FOR SELECT USING (true);

-- API Route เป็นคนเพิ่ม
CREATE POLICY "Server insert artifacts" ON public.artifacts
FOR INSERT WITH CHECK (true);
```

#### ✅ Storage Bucket `videos`
```sql
-- อัปโหลด: ใครก็ได้ (หรือจำกัดด้วย auth)
CREATE POLICY "Allow upload to videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos');

-- อ่าน: ทุกคน (เพราะ bucket เป็น public)
CREATE POLICY "Public read videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');
```

---

## 🗃️ 3. ฐานข้อมูล — ตารางที่ใช้

### ตาราง `artifacts`
```sql
CREATE TABLE public.artifacts (
  id bigint generated always as identity primary key,
  video_url text not null,
  prompt text not null,
  filename text,
  category text,
  brand text,
  image_url text,
  engine text,
  created_at timestamptz default now()
);
```

### ตาราง `groq_logs`
```sql
CREATE TABLE public.groq_logs (
  id bigint generated always as identity primary key,
  request_id text,
  model text,
  prompt text,
  response text,
  latency_ms integer,
  created_at timestamptz default now()
);
```

---

## 📁 4. Supabase Storage

- **Bucket `videos`**: ใช้เก็บไฟล์วิดีโอที่สร้าง, รูปภาพอัปโหลด
- **Visibility**: Public (ให้คนอื่นดูไฟล์ได้ผ่าน URL)
- **Policies**: ต้องตั้งค่าให้ SELECT และ INSERT (ดูตัวอย่างด้านบน)

**ตัวอย่าง URL สาธารณะ:**
```
https://xxxx.supabase.co/storage/v1/object/public/videos/path-to-file.mp4
```

---

## 🧪 5. การใช้ Supabase ในโค้ด

### Client-side (Static HTML / JS)
```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabase = createClient(
  'https://your-project.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // anon key
)
```

### API Route (Next.js)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

### ใช้ Service Role Key ใน API Route
```javascript
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

---

## 🔄 6. Migration ด้วย Supabase CLI

```bash
supabase init
supabase login
supabase link --project-ref <ref>
supabase migration new add_policies
# แก้ไขไฟล์ SQL แล้ว push
supabase db push
```

---

## 💎 สรุปแนวปฏิบัติที่ดี
- ห้ามใช้ `service_role` ใน client เด็ดขาด
- เปิด RLS ทุกตารางที่ client อ่าน/เขียน
- ใช้ Environment Variables สำหรับคีย์
- ตั้ง Policies ให้จำกัดสิทธิ์น้อยที่สุด
- ทำ Migration แทนการแก้ผ่าน Dashboard เพื่อ version control