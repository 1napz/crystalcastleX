// app/studio/page.tsx
'use client'
import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import { generateIntro, generateCTA, generateThumbnail, generateVideo } from '@/lib/video'
import { buildFilename } from '@/lib/filename'
import { showStatus } from '@/components/StatusBar'

export default function StudioPage() {
  // 1) เก็บค่าจาก input เดิมของคุณ
  const [files, setFiles] = useState<{file: File, url: string}[]>([])
  const [brand, setBrand] = useState('Brand')
  const [category, setCategory] = useState('Product')
  const [prompt, setPrompt] = useState('')

  const filename = buildFilename(category, brand, files.length)

  // 2) ฟังก์ชันที่เคยอยู่ใน product.js
  const handleIntro = async () => {
    if (!files.length) return showStatus('กรุณาอัปโหลดรูปก่อน','error')
    showStatus('🎞️ กำลังสร้าง Intro...','loading')
    try {
      await generateIntro(files, brand, filename)
      showStatus('✅ Intro พร้อมดาวน์โหลด','success')
    } catch(e:any) { showStatus('❌ '+e.message,'error') }
  }

  const handleCTA = async () => {
    if (!files.length) return showStatus('กรุณาอัปโหลดรูปก่อน','error')
    showStatus('🔥 กำลังสร้าง CTA...','loading')
    try {
      await generateCTA(files, brand, filename)
      showStatus('✅ CTA พร้อมดาวน์โหลด','success')
    } catch(e:any) { showStatus('❌ '+e.message,'error') }
  }

  const handleThumb = async () => {
    if (!files.length) return showStatus('กรุณาอัปโหลดรูปก่อน','error')
    showStatus('🎨 กำลังสร้าง Thumbnail...','loading')
    try {
      await generateThumbnail(files[0], brand, filename)
      showStatus('✅ Thumbnail พร้อม','success')
    } catch(e:any) { showStatus('❌ '+e.message,'error') }
  }

  const handleVideo = async () => {
    if (!files.length ||!prompt) return showStatus('ใส่รูปและ prompt ก่อน','error')
    showStatus('⚡ กำลังสร้างวิดีโอ...','loading')
    try {
      await generateVideo({ file: files[0].file, prompt, filename, engine: 'fal' })
      showStatus('🎉 วิดีโอเสร็จแล้ว','success')
    } catch(e:any) { showStatus('❌ '+e.message,'error') }
  }

  return (
    <main className="grid md:grid-cols-2 gap-6 p-4">
      {/* คอลัมน์ซ้าย */}
      <div className="space-y-3">
        <UploadZone onChange={setFiles} />
        <input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="Brand" className="w-full border p-2 rounded" />
        <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full border p-2 rounded">
          <option>Product</option><option>Food</option><option>Fashion</option>
        </select>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Prompt" className="w-full border p-2 rounded h-24" />
      </div>

      {/* คอลัมน์ขวา */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button onClick={handleVideo} className="flex-1 bg-black text-white py-2 rounded">สร้างวิดีโอ</button>
        </div>
        <div className="flex gap-2">
          {/* 3 ปุ่มนี้คือที่ใส่โค้ดที่คุณถาม */}
          <button onClick={handleIntro} className="flex-1 border py-2 rounded">Intro</button>
          <button onClick={handleCTA} className="flex-1 border py-2 rounded">CTA</button>
          <button onClick={handleThumb} className="flex-1 border py-2 rounded">Thumbnail</button>
        </div>
        <div id="statusText" className="hidden"></div>
      </div>
    </main>
  )
}