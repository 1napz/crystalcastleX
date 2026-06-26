export default async function handler(req, res) {
  // ตั้งค่า CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // รับเฉพาะ POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // คืนค่า URL รูปตัวอย่าง
    const demoUrl = 'https://picsum.photos/id/1/800/600';
    
    return res.status(200).json({ 
      success: true,
      url: demoUrl,
      message: 'Upload demo mode (no actual storage)'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}