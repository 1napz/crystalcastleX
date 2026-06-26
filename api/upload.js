import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // รับเฉพาะ POST เท่านั้น
  if (req.method !== 'POST') return res.status(405).end();

  // อ่านชื่อไฟล์จาก Header ที่เราส่งมา
  const filename = req.headers['x-filename'] || 'image.jpg';
  
  // อัพโหลดเข้า Vercel Blob ตั้งเป็น public ใครก็อ่านได้
  const blob = await put(filename, req, { access: 'public' });
  
  // ส่ง URL กลับไปให้หน้าเว็บ
  return res.status(200).json({ url: blob.url });
}

// ปิด bodyParser เพราะเราส่งไฟล์ดิบ ไม่ใช่ JSON
export const config = {
  api: { bodyParser: false }
};
