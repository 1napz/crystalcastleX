import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // ตั้งเป็น JSON ตั้งแต่แรก กัน Vercel ส่ง HTML
  res.setHeader('Content-Type', 'application/json');

  try {
    // รับเฉพาะ POST เท่านั้น
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    // เช็คว่ามี BLOB_READ_WRITE_TOKEN ไหม
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ 
        error: 'Vercel Blob not configured',
        message: 'ใส่ BLOB_READ_WRITE_TOKEN ใน Vercel Environment Variables ก่อน' 
      });
    }

    // อ่านชื่อไฟล์จาก Header ที่เราส่งมา
    const filename = req.headers['x-filename'] || 'image.jpg';
    const contentType = req.headers['content-type'] || 'image/jpeg';

    // เช็คขนาดไฟล์ กันยิงไฟล์ใหญ่จนบิลบาน Vercel Free จำกัด 4.5MB
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) {
      return res.status(413).json({ error: 'ไฟล์ใหญ่เกิน 4.5MB อัพโหลดไม่ได้' });
    }

    // อัพโหลดเข้า Vercel Blob ตั้งเป็น public ใครก็อ่านได้
    const blob = await put(filename, req, {
      access: 'public',
      contentType: contentType,
    });

    // ส่ง URL กลับไปให้หน้าเว็บ
    return res.status(200).json({ url: blob.url });

  } catch (error) {
    console.error('Upload API Error:', error);
    return res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message 
    });
  }
}

// ปิด bodyParser เพราะเราส่งไฟล์ดิบ ไม่ใช่ JSON
export const config = {
  api: { bodyParser: false }
};
