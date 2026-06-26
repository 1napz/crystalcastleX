// components/UploadZone.tsx
'use client'
import { useState } from 'react'
import { uploadImages } from '@/lib/api'

export default function UploadZone({ maxFiles, maxSizeMB }) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).slice(0, maxFiles)
    const valid = dropped.filter(f => f.size <= maxSizeMB * 1024 * 1024)
    setFiles(valid)
    await uploadImages(valid) // ยิงไป /api/upload
  }

  return (
    <div onDrop={onDrop} onDragOver={e=>e.preventDefault()}
      className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800">
      ลากรูปมาวางที่นี่ (สูงสุด {maxFiles} รูป)
      <p className="text-sm text-zinc-500">{files.length} ไฟล์ที่เลือก</p>
    </div>
  )
}