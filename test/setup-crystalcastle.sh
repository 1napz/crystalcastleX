#!/bin/bash
# setup-crystalcastle.sh
# สร้างโครงสร้างไฟล์ทั้งหมดสำหรับ PWA + Dark Theme (ดำ + น้ำเงิน)

set -e  # หยุดทันทีถ้ามี error

echo "🚀 เริ่มตั้งค่า Crystal Castle PWA (Dark Theme + Blue Accent)..."

# 1. สร้างโฟลเดอร์ icons
echo "📁 สร้างโฟลเดอร์ icons..."
mkdir -p icons

# 2. สร้าง manifest.json
echo "📄 สร้าง manifest.json..."
cat > manifest.json << 'EOF'
{
  "name": "Crystal Castle AI",
  "short_name": "CrystalCastle",
  "description": "สร้างวิดีโอ AI จากรูปสินค้า",
  "start_url": "/product.html",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#000000",
  "orientation": "portrait",
  "icons": [
    { "src": "icons/icon-72.png", "sizes": "72x72", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-96.png", "sizes": "96x96", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-128.png", "sizes": "128x128", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-144.png", "sizes": "144x144", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-152.png", "sizes": "152x152", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-384.png", "sizes": "384x384", "type": "image/png", "purpose": "any maskable" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
EOF

# 3. สร้าง Service Worker (sw.js)
echo "⚙️  สร้าง sw.js..."
cat > sw.js << 'EOF'
const CACHE_NAME = 'crystal-cache-v1';
const urlsToCache = [
  '/',
  '/product.html',
  '/product.js',
  '/manifest.json',
  '/dark-theme.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});
EOF

# 4. สร้าง dark-theme.css
echo "🎨 สร้าง dark-theme.css (ดำ + น้ำเงิน)..."
cat > dark-theme.css << 'EOF'
:root {
  --bg-primary: #000000;
  --bg-secondary: #0f0f0f;
  --bg-card: #1a1a1a;
  --border-color: #2a2a2a;
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --accent-blue: #3b82f6;
  --accent-blue-hover: #2563eb;
}

body {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}
.bg-white, .bg-slate-50, .bg-slate-100 {
  background-color: var(--bg-card) !important;
  border-color: var(--border-color) !important;
}
.bg-violet-600, .bg-slate-900 {
  background-color: var(--accent-blue) !important;
}
.bg-violet-600:hover, .bg-slate-900:hover {
  background-color: var(--accent-blue-hover) !important;
}
.text-slate-900, .text-slate-800, .text-slate-700 {
  color: var(--text-primary) !important;
}
.text-slate-500, .text-slate-400, .text-slate-300 {
  color: var(--text-secondary) !important;
}
input, select, textarea {
  background-color: #2a2a2a !important;
  border-color: var(--border-color) !important;
  color: var(--text-primary) !important;
}
input:focus, select:focus, textarea:focus {
  outline-color: var(--accent-blue) !important;
}
.border-slate-200, .border-slate-100, .border-slate-300 {
  border-color: var(--border-color) !important;
}
.bg-violet-100 {
  background-color: rgba(59, 130, 246, 0.2) !important;
}
.text-violet-600, .text-violet-700 {
  color: var(--accent-blue) !important;
}
EOF

# 5. สร้าง product.html (ตัวอย่างพร้อม PWA + Dark Theme)
echo "📄 สร้าง product.html..."
cat > product.html << 'EOF'
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>Crystal Castle AI – ผู้ช่วยสร้างวิดีโอ</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#000000">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/dark-theme.css">
  <style>
    :focus-visible { outline: 3px solid #3b82f6; outline-offset: 2px; border-radius: 0.5rem; }
    [aria-invalid="true"] { border-color: #ef4444 !important; background-color: #2a1a1a !important; }
  </style>
</head>
<body class="bg-black text-white p-4 pb-20">
  <main class="max-w-2xl mx-auto space-y-5">
    <section class="rounded-2xl shadow-sm border p-5" style="background-color:#0f0f0f; border-color:#2a2a2a;">
      <div class="flex items-center gap-2.5 mb-4">
        <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold" style="background-color:rgba(59,130,246,0.2); color:#3b82f6;">1</span>
        <h2 class="font-semibold">รูปสินค้า</h2>
      </div>
      <div id="previewGrid" class="grid grid-cols-3 gap-2">
        <div class="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center" style="border-color:#2a2a2a; background-color:#0f0f0f; color:#a0a0a0;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16l4-4 4-4 4 4M12 12v-2M12 8v-2M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
          <span class="text-[11px] mt-1">ยังไม่มีรูป</span>
        </div>
      </div>
      <p class="text-[11px] mt-2.5" style="color:#a0a0a0;">รองรับ JPG, PNG (สูงสุด 10 รูป)</p>
    </section>

    <section class="rounded-2xl shadow-sm border p-5" style="background-color:#0f0f0f; border-color:#2a2a2a;">
      <div class="flex items-center gap-2.5 mb-4">
        <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold" style="background-color:rgba(59,130,246,0.2); color:#3b82f6;">2</span>
        <h2 class="font-semibold">รายละเอียดสินค้า</h2>
      </div>
      <div>
        <label for="brandInput" class="text-xs block mb-1" style="color:#a0a0a0;">แบรนด์ / รุ่น</label>
        <input id="brandInput" placeholder="เช่น Uniqlo, Nike" class="w-full h-11 px-3 rounded-xl border text-sm" style="background-color:#2a2a2a; border-color:#2a2a2a; color:white;">
      </div>
    </section>

    <section class="rounded-2xl shadow-sm border p-5" style="background-color:#0f0f0f; border-color:#2a2a2a;">
      <div class="flex justify-between mb-3">
        <div class="flex gap-2.5">
          <span class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold" style="background-color:rgba(59,130,246,0.2); color:#3b82f6;">3</span>
          <h2 class="font-semibold">คำสั่งสร้างวิดีโอ</h2>
        </div>
        <button id="genPromptBtn" type="button" class="text-xs font-medium px-3 py-1.5 rounded-full" style="background-color:rgba(59,130,246,0.2); color:#3b82f6;">✨ AI ช่วยคิด</button>
      </div>
      <textarea id="promptInput" rows="3" placeholder="อธิบายลักษณะวิดีโอ..." class="w-full p-3.5 rounded-xl border text-sm" style="background-color:#2a2a2a; border-color:#2a2a2a; color:white;"></textarea>
    </section>

    <div class="sticky bottom-4 flex gap-3 p-4 rounded-2xl shadow-lg border" style="background-color:#0f0f0f; border-color:#2a2a2a;">
      <button id="submitBtn" type="button" class="flex-1 font-medium py-3 rounded-xl" style="background-color:#3b82f6; color:white;">💾 บันทึกสินค้า</button>
      <button id="logoutBtn" type="button" class="px-5 py-3 rounded-xl border" style="border-color:#2a2a2a; color:#a0a0a0;">🚪 ออกจากระบบ</button>
    </div>
  </main>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('✅ Service Worker registered', reg))
        .catch(err => console.log('❌ Service Worker error', err));
    }
    document.getElementById('genPromptBtn')?.addEventListener('click', () => {
      const brand = document.getElementById('brandInput')?.value || 'สินค้า';
      document.getElementById('promptInput').value = `สร้างวิดีโอแนะนำ ${brand} สไตล์โมเดิร์น สนุกสนาน`;
    });
    document.getElementById('submitBtn')?.addEventListener('click', () => alert('บันทึกข้อมูล (จำลอง)'));
    document.getElementById('logoutBtn')?.addEventListener('click', () => confirm('ออกจากระบบ?') && alert('ออกจากระบบแล้ว'));
  </script>
</body>
</html>
EOF

# 6. สร้างไฟล์ product.js เปล่า (หรือจะ copy ของเดิม)
echo "📜 สร้าง product.js (placeholder)..."
cat > product.js << 'EOF'
// product.js สำหรับ Crystal Castle
console.log("Crystal Castle AI ทำงานแล้ว");
EOF

# 7. สร้าง placeholder ไอคอน (ใช้ ImageMagick ถ้ามี)
echo "🖼️  สร้างไอคอน placeholder (ต้องมี ImageMagick หรือใช้ PNG เอง)..."
if command -v convert &> /dev/null; then
  # สร้างไอคอนสีน้ำเงินพื้นดำ ตัวอักษร "C"
  convert -size 512x512 xc:#000000 -fill white -gravity center -pointsize 200 -annotate 0 "C" icons/icon-512.png
  convert icons/icon-512.png -resize 192x192 icons/icon-192.png
  convert icons/icon-512.png -resize 144x144 icons/icon-144.png
  convert icons/icon-512.png -resize 128x128 icons/icon-128.png
  convert icons/icon-512.png -resize 96x96 icons/icon-96.png
  convert icons/icon-512.png -resize 72x72 icons/icon-72.png
  echo "   (สร้างไอคอนสำเร็จด้วย ImageMagick)"
else
  echo "   ⚠️ ไม่พบ ImageMagick (หรือ convert) กรุณาสร้างไอคอนเอง หรือติดตั้ง ImageMagick"
  echo "   ติดตั้งบน macOS: brew install imagemagick"
  echo "   ติดตั้งบน Ubuntu: sudo apt install imagemagick"
fi

# 8. สร้างไฟล์ README (แนะนำการติดตั้ง)
echo "📖 สร้าง README-PWA.md..."
cat > README-PWA.md << 'EOF'
# Crystal Castle PWA (Dark Theme + Blue)

## วิธีติดตั้งและทดสอบ
1. ใช้ live server หรือ `npx serve .`
2. เปิด product.html ในเบราว์เซอร์
3. ติดตั้งแอพ: Chrome → เมนูสามจุด → "ติดตั้งแอปพลิเคชัน"
4. สำหรับมือถือ: Safari → แชร์ → "เพิ่มลงหน้าจอโฮม"

## การพัฒนา
- dark-theme.css: ปรับแต่งสีดำ/น้ำเงิน
- manifest.json: เปลี่ยนชื่อ, ไอคอน
- sw.js: รูปแบบการแคช
EOF

echo ""
echo "✅ เสร็จสมบูรณ์! โครงสร้างไฟล์ทั้งหมดถูกสร้างแล้ว"
echo ""
echo "📌 ขั้นตอนต่อไป:"
echo "1. เปิด product.html ในเบราว์เซอร์ (ใช้ Live Server หรือ npx serve .)"
echo "2. ปรับแต่ง product.js ให้ตรงกับที่คุณต้องการ (หรือคัดลอกโค้ดเดิมมาใส่)"
echo "3. ถ้ายังไม่มีไอคอน ให้ใส่ไฟล์รูปในโฟลเดอร์ icons/ ตามขนาดใน manifest.json"
echo "4. deploy ขึ้น GitHub หรือ Vercel แล้วทดสอบ PWA"
echo ""
echo "🎉 ขอให้สนุกกับ Crystal Castle PWA ครับ!"
