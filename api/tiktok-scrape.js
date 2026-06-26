// /api/tiktok-scrape.js - v3 แก้ vt.tiktok.com
export default async function handler(req, res) {
  let { url } = req.query;
  if (!url) return res.status(400).json({ error: 'no url' });

  try {
    // 1. ตาม redirect ก่อน (vt.tiktok.com → www.tiktok.com)
    let finalUrl = url;
    if (url.includes('vt.tiktok.com') || url.includes('vm.tiktok.com')) {
      const r = await fetch(url, { redirect: 'follow' });
      finalUrl = r.url;
    }

    // 2. ดึงหน้าเว็บด้วย header มือถือ
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept-Language': 'th-TH,th;q=0.9',
        'Referer': 'https://www.tiktok.com/'
      }
    });

    const html = await response.text();
    const images = [];

    // วิธีที่ 1: SIGI_STATE
    const match = html.match(/<script id="SIGI_STATE"[^>]*>(.*?)<\/script>/s);
    if (match) {
      const data = JSON.parse(match[1]);
      Object.values(data.ItemModule || {}).forEach(item => {
        if (item.video?.originCover) images.push(item.video.originCover);
        if (item.video?.cover) images.push(item.video.cover);
        item.imagePost?.images?.forEach(i => images.push(i.displayImage?.urlList?.[0]));
      });
    }

    // วิธีที่ 2: __NEXT_DATA__
    if (images.length === 0) {
      const nextMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (nextMatch) {
        const data = JSON.parse(nextMatch[1]);
        const str = JSON.stringify(data);
        const urls = str.match(/https:\/\/[^"]+tiktokcdn[^"]+\.(?:jpg|jpeg|png|webp)/g) || [];
        images.push(...urls);
      }
    }

    // วิธีที่ 3: oEmbed fallback
    if (images.length === 0) {
      try {
        const oembed = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(finalUrl)}`).then(r => r.json());
        if (oembed.thumbnail_url) images.push(oembed.thumbnail_url);
      } catch {}
    }

    const unique = [...new Set(images.filter(Boolean))].map(u => u.split('?')[0]);

    // ส่ง Telegram
    if (process.env.TELEGRAM_BOT_TOKEN) {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `🔗 TikTok scrape\nURL: ${finalUrl}\nรูป: ${unique.length} รูป\n${unique.length? '✅ สำเร็จ' : '❌ ไม่พบ'}`
        })
      }).catch(()=>{});
    }

    res.status(200).json({ success: true, images: unique, count: unique.length, finalUrl });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}