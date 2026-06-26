// /api/tiktok-scrape.js - Vercel Serverless
export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Invalid TikTok URL' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
      }
    });
    
    const html = await response.text();
    const images = [];
    
    // Extract from SIGI_STATE JSON
    const jsonMatch = html.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        const itemList = data.ItemModule || {};
        for (const key in itemList) {
          const item = itemList[key];
          if (item.video?.cover) images.push(item.video.cover);
          if (item.imagePost?.images) {
            item.imagePost.images.forEach(img => {
              if (img.displayImage?.urlList?.[0]) {
                images.push(img.displayImage.urlList[0]);
              }
            });
          }
        }
      } catch(e) {}
    }
    
    // Fallback to og:image
    if (images.length === 0) {
      const ogMatch = html.match(/<meta property="og:image" content="(.*?)"/);
      if (ogMatch) images.push(ogMatch[1]);
    }
    
    const uniqueImages = [...new Set(images)].map(img => 
      img.split('?')[0] // remove params for highest quality
    );
    
    res.status(200).json({ 
      success: true,
      images: uniqueImages,
      count: uniqueImages.length 
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
