// lib/video.ts
export async function generateVideo({ file, prompt, filename, engine }: {
  file: File, prompt: string, filename: string, engine: string
}) {
  const form = new FormData()
  form.append('file', file)
  form.append('filename', filename)

  const upload = await fetch('/api/upload', { method: 'POST', body: form })
  if (!upload.ok) throw new Error('อัปโหลดไม่สำเร็จ')
  const { url } = await upload.json()

  const res = await fetch('/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: url, prompt, filename, engine })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'สร้างวิดีโอไม่สำเร็จ')
  return data.videoUrl || data.taskId
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) {
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
  const w = img.width * scale
  const h = img.height * scale
  const x = (canvas.width - w) / 2
  const y = (canvas.height - h) / 2
  ctx.drawImage(img, x, y, w, h)
}

function getRecorder(stream: MediaStream) {
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return new MediaRecorder(stream, { mimeType: t })
  }
  return new MediaRecorder(stream)
}

export async function generateIntro(files: {url:string}[], brand: string, filename: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080; canvas.height = 1920
  const ctx = canvas.getContext('2d')!
  const stream = canvas.captureStream(30)
  const recorder = getRecorder(stream)
  const chunks: Blob[] = []

  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }
  const done = new Promise<Blob>(res => recorder.onstop = () => res(new Blob(chunks, { type: 'video/webm' })))
  recorder.start()

  for (const f of files) {
    const img = new Image()
    img.src = f.url
    await new Promise<void>(r => { img.onload = () => r(); img.onerror = () => r() })
    for (let frame = 0; frame < 30; frame++) {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      ctx.globalAlpha = frame / 30
      drawCover(ctx, img, canvas)
      ctx.globalAlpha = 1
      ctx.fillStyle = 'white'
      ctx.font = 'bold 60px "Noto Sans Thai", sans-serif'
      ctx.textAlign = 'center'
      ctx.shadowColor = 'black'; ctx.shadowBlur = 20
      ctx.fillText(brand, canvas.width/2, canvas.height - 200)
      ctx.shadowBlur = 0
    }
    await new Promise(r => setTimeout(r, 300))
  }
  recorder.stop()
  const blob = await done
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: `${filename}-intro.webm` })
  a.click(); URL.revokeObjectURL(url)
}

export async function generateCTA(files: {url:string}[], brand: string, filename: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080; canvas.height = 1920
  const ctx = canvas.getContext('2d')!
  const stream = canvas.captureStream(30)
  const recorder = getRecorder(stream)
  const chunks: Blob[] = []

  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }
  const done = new Promise<Blob>(res => recorder.onstop = () => res(new Blob(chunks, { type: 'video/webm' })))
  recorder.start()

  for (const f of files) {
    const img = new Image(); img.src = f.url
    await new Promise<void>(r => { img.onload = () => { drawCover(ctx, img, canvas); r() }; img.onerror = () => r() })
    await new Promise(r => setTimeout(r, 800))
  }

  ctx.fillStyle = '#1e1e2e'; ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = 'white'; ctx.textAlign = 'center'
  ctx.font = 'bold 80px "Noto Sans Thai", sans-serif'
  ctx.fillText('🔥 สั่งซื้อเลย!', canvas.width/2, canvas.height/2 - 80)
  ctx.font = '50px "Noto Sans Thai", sans-serif'
  ctx.fillText(brand, canvas.width/2, canvas.height/2 + 80)
  await new Promise(r => setTimeout(r, 1500))

  recorder.stop()
  const blob = await done
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: `${filename}-cta.webm` })
  a.click(); URL.revokeObjectURL(url)
}

export async function generateThumbnail(file: {url:string}, brand: string, filename: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080; canvas.height = 1920
  const ctx = canvas.getContext('2d')!

  const img = new Image(); img.src = file.url
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error('โหลดรูปไม่สำเร็จ')) })

  ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height)
  drawCover(ctx, img, canvas)
  ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.shadowColor = 'black'; ctx.shadowBlur = 30
  ctx.font = 'bold 70px "Noto Sans Thai", sans-serif'
  ctx.fillText(brand, canvas.width/2, canvas.height - 250)
  ctx.font = '50px "Noto Sans Thai", sans-serif'
  ctx.fillText(brand, canvas.width/2, canvas.height - 160)

  return new Promise<void>(res => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob!)
      const a = Object.assign(document.createElement('a'), { href: url, download: `${filename}-thumb.png` })
      a.click(); URL.revokeObjectURL(url); res()
    }, 'image/png')
  })
}