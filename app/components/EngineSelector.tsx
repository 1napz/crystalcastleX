// components/EngineSelector.tsx
'use client'
import { useState } from 'react'

const engines = [
  { id: 'fal', name: 'FAL Kling', desc: 'เร็ว คม' },
  { id: 'magichour', name: 'Magic Hour', desc: 'สไตล์ซินิมาติก' },
]

export default function EngineSelector() {
  const [selected, setSelected] = useState('fal')
  return (
    <div className="grid grid-cols-2 gap-3">
      {engines.map(e => (
        <button key={e.id} onClick={()=>setSelected(e.id)}
          className={`p-4 border rounded-lg text-left ${selected===e.id? 'ring-2 ring-blue-500' : ''}`}>
          <div className="font-medium">{e.name}</div>
          <div className="text-xs text-zinc-500">{e.desc}</div>
        </button>
      ))}
    </div>
  )
}