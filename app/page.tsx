// app/page.tsx
export default function ProProfile() {
  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <div className="flex items-center gap-4">
          <img src="/avatar.png" className="w-24 h-24 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">ณัฐพงศ์ พรล้ำฟ้า</h1>
            <p className="text-gray-600">Full‑stack Developer & AI Creator</p>
          </div>
        </div>
        {/* ประสบการณ์ ฯลฯ */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded">📱 TikTok @snapzreview</div>
          <div className="bg-gray-100 p-3 rounded">🛍️ Shopee 1napz</div>
        </div>
        {/* ติดต่อ: ใช้ฟอร์มแทนอีเมลตรง */}
        <form action="/api/contact" method="POST" className="mt-8 space-y-3">
          <input type="email" name="from" placeholder="อีเมลของคุณ" required />
          <textarea name="message" placeholder="ข้อความ..." required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">ส่งข้อความ</button>
        </form>
        <p className="text-xs text-gray-400 mt-4">อีเมลของคุณจะถูกเก็บเป็นความลับ</p>
      </div>
    </main>
  );
}