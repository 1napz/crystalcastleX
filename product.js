// product.js — @snapzreview AI Video Studio
// รวบรวมทุกฟังก์ชันหลัก: อัปโหลดรูป, Gen Prompt, Gen Caption, สร้างวิดีโอ, Slideshow, Intro, CTA, Thumbnail

// ========== STEP 1: อ้างอิง DOM Elements ==========
const $ = (id) => document.getElementById(id);
const fileInput = $('fileInput');
const uploadBtn = $('uploadBtn');
const previewGrid = $('previewGrid');
const filenameInput = $('filenameInput');
const promptInput = $('promptInput');
const genPromptBtn = $('genPromptBtn');
// ปุ่ม Kling / Magic Hour เดิม ถูกแทนที่ด้วย Dropdown
// const genFALBtn = $('genFALBtn');
// const genHFBtn = $('genHFBtn');
const genIntroBtn = $('genIntroBtn');
const genCTABtn = $('genCTABtn');
const genThumbnailBtn = $('genThumbnailBtn');
const statusText = $('statusText');
const categorySelect = $('categorySelect');
const brandInput = $('brandInput');
const dateInput = $('dateInput');
const promptStatus = $('promptStatus');
const copyPromptBtn = $('copyPromptBtn');
const undoPromptBtn = $('undoPromptBtn');
const genPostBtn = $('genPostBtn');
const postOutput = $('postOutput');
const copyPostBtn = $('copyPostBtn');
const generateBtn = $('generateBtn');
const tiktokBtn = $('tiktokBtn');
const tiktokInputWrap = $('tiktokInputWrap');

// ========== อ้างอิง Dropdown สำหรับเลือก Video Engine และข้อความอธิบาย ==========
const videoEngineSelect = $('videoEngineSelect');
const engineInfo = $('engineInfo');

// ========== STEP 2: ตัวแปรกลาง ==========
let selectedFiles = [];   // เก็บ list ของรูปที่เลือก { url, file }

// ========== STEP 3: Global Error Handler ==========
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  showToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
  event.preventDefault();
});

// ========== STEP 4: Toast Notification (แทน alert) ==========
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  const colors = { info: 'bg-blue-600', error: 'bg-red-600', success: 'bg-green-600' };
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm shadow-lg ${colors[type] || colors.info}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ========== STEP 5: Utility – Debounce (กันกดซ้ำ) ==========
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========== STEP 6: ตรวจสอบชื่อไฟล์ซ้ำ + บันทึกชื่อ ==========
function checkDuplicateName(name) {
  const saved = JSON.parse(localStorage.getItem('filenames') || '[]');
  return saved.includes(name);
}
function saveFilename(name) {
  const saved = JSON.parse(localStorage.getItem('filenames') || '[]');
  if (!saved.includes(name)) {
    saved.push(name);
    localStorage.setItem('filenames', JSON.stringify(saved));
  }
}

// ========== STEP 7: อัปเดตชื่อไฟล์อัตโนมัติจากวันที่/หมวดหมู่/แบรนด์ ==========
function updateFilename() {
  const now = new Date();
  const yyyymmdd = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  if (dateInput) dateInput.value = yyyymmdd;
  const category = categorySelect?.value || 'Product';
  const brand = brandInput?.value.trim().replace(/\s+/g, '') || 'Brand';
  const count = selectedFiles.length;
  filenameInput.value = `${yyyymmdd}-${category}-${brand}-${count}img`;
}

// ========== STEP 8: แสดงตัวอย่างรูปที่อัปโหลดใน Grid ==========
function renderPreview() {
  if (!previewGrid) return;

  // ล้างรูปเก่าและ revoke URL
  previewGrid.querySelectorAll('img').forEach(img => {
    if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  });
  previewGrid.innerHTML = '';

  // ถ้ายังไม่มีรูป แสดง placeholder
  if (selectedFiles.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50';
    emptyDiv.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16l4-4 4-4 4 4M12 12v-2M12 8v-2M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg><span class="text-[11px] mt-1">ยังไม่มีรูป</span>`;
    previewGrid.appendChild(emptyDiv);
    updateFilename();
    return;
  }

  // วาดรูปทีละใบ พร้อมปุ่มลบ
  selectedFiles.forEach((fileObj, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'relative aspect-square bg-slate-100 rounded-xl overflow-hidden group';
    const img = document.createElement('img');
    img.src = fileObj.url;
    img.alt = 'Product image';
    img.className = 'w-full h-full object-cover';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition';
    btn.textContent = '×';
    btn.onclick = () => {
      URL.revokeObjectURL(img.src);
      selectedFiles.splice(idx, 1);
      renderPreview();
    };
    wrap.appendChild(img);
    wrap.appendChild(btn);
    previewGrid.appendChild(wrap);
  });
  updateFilename();
}

// ========== STEP 9: Event เปิด File Selector ==========
uploadBtn?.addEventListener('click', () => fileInput.click());

// ========== STEP 10: จัดการเมื่อผู้ใช้เลือกไฟล์ ==========
fileInput?.addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []);
  if (selectedFiles.length + files.length > 10) {
    showToast('อัปโหลดได้สูงสุด 10 รูป', 'error');
    return;
  }
  files.forEach(f => {
    if (!f.type.startsWith('image/')) {
      showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'error');
      return;
    }
    if (f.size > 6 * 1024 * 1024) {
      showToast('ไฟล์ต้องไม่เกิน 6MB', 'error');
      return;
    }
    selectedFiles.push({ url: URL.createObjectURL(f), file: f });
  });
  fileInput.value = '';
  renderPreview();
});

// ========== STEP 11: Toggle ช่องใส่ TikTok URL ==========
tiktokBtn?.addEventListener('click', () => {
  tiktokInputWrap.classList.toggle('hidden');
  tiktokInputWrap.querySelector('input')?.focus();
});

// ========== STEP 12: Prompt Templates สำหรับแต่ละ Category ==========
const promptTemplates = {
  'Menswear': 'Professional fashion video of {brand} menswear. Slow cinematic pan around male model, sharp focus on fabric texture and fit. Clean white studio background, soft natural lighting.',
  'Womenswear': 'Elegant fashion video of {brand} womenswear. Female model walking gracefully, flowy fabric movement in slow motion. Soft dramatic lighting, warm tone.',
  'Accessories': 'Luxury product video of {brand} accessory. 360-degree slow rotation on smooth surface. Close-up macro shots highlighting details.',
  'Shoes': 'Dynamic product showcase of {brand} shoes. Model walking on reflective surface. Focus on sole detail and material texture.',
  'Bags': 'Luxury handbag video of {brand} bag. Elegant hand interaction, slow orbit camera. Rich leather texture close-up.',
  'default': 'Professional product video of {brand}. Clean studio background, 360-degree slow rotation, sharp focus on product details.'
};

// ========== STEP 13: AI สร้าง Prompt (Gen Prompt) ==========
let lastOriginalPrompt = '';
let promptAbortController = null;

const handleGenPrompt = async () => {
  // ยกเลิก request เดิมถ้ามี
  if (promptAbortController) {
    promptAbortController.abort();
    promptAbortController = null;
  }

  const brand = brandInput?.value.trim() || 'สินค้า';
  const category = categorySelect?.value || 'default';
  let baseTemplate = promptTemplates[category] || promptTemplates['default'];
  baseTemplate = baseTemplate.replace('{brand}', brand);
  lastOriginalPrompt = baseTemplate;
  promptInput.value = baseTemplate;

  genPromptBtn.disabled = true;
  genPromptBtn.innerHTML = '⚙️ AI กำลังแต่ง...';
  if (promptStatus) promptStatus.innerHTML = '⏳ กำลังเรียก AI...';

  promptAbortController = new AbortController();

  // ลอง 2 ครั้ง เผื่อ network error
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: baseTemplate, category }),
        signal: promptAbortController.signal,
      });
      const data = await res.json();
      if (res.ok && data.result) {
        promptInput.value = data.result;
        if (promptStatus) promptStatus.innerHTML = '✅ AI แต่งเสร็จ';
        copyPromptBtn?.classList.remove('hidden');
        undoPromptBtn?.classList.remove('hidden');
        genPromptBtn.innerHTML = '✨ แต่งใหม่';
        break;
      }
      throw new Error(data.error || 'AI error');
    } catch (err) {
      if (err.name === 'AbortError') break;
      if (attempt === 1) {
        console.error('Prompt error after retry:', err);
        if (promptStatus) promptStatus.innerHTML = '⚠️ ใช้ต้นฉบับ (AI ไม่พร้อม)';
        genPromptBtn.innerHTML = '✨ ลองใหม่';
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  genPromptBtn.disabled = false;
  promptAbortController = null;
};
genPromptBtn?.addEventListener('click', debounce(handleGenPrompt, 500));

// ========== STEP 14: คัดลอก / ย้อนกลับ Prompt ==========
copyPromptBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(promptInput.value).then(() => showToast('คัดลอกแล้ว', 'success'));
});
undoPromptBtn?.addEventListener('click', () => {
  if (lastOriginalPrompt) {
    promptInput.value = lastOriginalPrompt;
    if (promptStatus) promptStatus.innerHTML = '↶ กลับต้นฉบับ';
  }
});

// ========== STEP 15: AI สร้างแคปชั่น (Gen Post) ==========
let postAbortController = null;

const handleGenPost = async () => {
  if (postAbortController) {
    postAbortController.abort();
    postAbortController = null;
  }

  const prompt = promptInput.value.trim();
  if (!prompt) {
    showToast('สร้าง Prompt ก่อน', 'error');
    return;
  }
  const brand = brandInput?.value.trim() || 'สินค้า';
  const category = categorySelect?.value || 'default';

  genPostBtn.disabled = true;
  genPostBtn.innerHTML = '✍️ กำลังเขียน...';
  postOutput.value = '';
  postAbortController = new AbortController();

  try {
    const res = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, brand, category }),
      signal: postAbortController.signal,
    });
    const data = await res.json();
    if (data.post) {
      postOutput.value = data.post;
      copyPostBtn?.classList.remove('hidden');
      genPostBtn.innerHTML = '✅ เสร็จ';
    } else {
      throw new Error('No post');
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    postOutput.value = `✨ ${brand} สวยโดนใจ! พร้อมส่งจาก @snapzreview\n\n#snapzreview #แฟชั่น #AIvideo`;
    genPostBtn.innerHTML = '⚠️ แบบสำเร็จรูป';
    copyPostBtn?.classList.remove('hidden');
  } finally {
    genPostBtn.disabled = false;
    postAbortController = null;
  }
};
genPostBtn?.addEventListener('click', debounce(handleGenPost, 500));

copyPostBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(postOutput.value).then(() => showToast('คัดลอกแล้ว', 'success'));
});

// ========== STEP 16: Helper – วาดรูปเต็ม Canvas แบบ cover ==========
function drawCoverImage(ctx, img, canvas) {
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}

// ========== STEP 17: สร้างวิดีโอด้วย AI Engine ใหม่ (ผ่าน /api/generate-video) ==========
let lastUploadedFile = null;
let lastUploadedUrl = null;
let videoAbortController = null;

async function generateVideo(engine) {
  if (videoAbortController) {
    videoAbortController.abort();
  }
  videoAbortController = new AbortController();

  if (selectedFiles.length === 0) {
    showToast('กรุณาอัปโหลดรูปสินค้าก่อน', 'error');
    return;
  }
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showToast('กรุณาใส่ Prompt หรือให้ AI ช่วยคิดก่อน', 'error');
    return;
  }
  const customFilename = filenameInput?.value.trim() || `video-${Date.now()}`;
  if (checkDuplicateName(customFilename)) {
    if (!confirm(`ชื่อ ${customFilename} เคยใช้แล้ว จะสร้างทับไหม?`)) return;
  }

  // ปิดปุ่ม Generate ชั่วคราว
  generateBtn.disabled = true;
  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '📤 กำลังอัปโหลดรูป...';
  }

  // เลือก engine จาก dropdown หรือใช้ 'fal' เป็นค่าเริ่มต้น
  const selectedEngine = engine || videoEngineSelect?.value || 'fal';

  try {
    // อัปโหลดรูป (หรือ reuse)
    const file = selectedFiles[0].file;
    let imageUrl;
    if (lastUploadedFile === file && lastUploadedUrl) {
      imageUrl = lastUploadedUrl;
      if (statusText) statusText.innerHTML = '📦 ใช้รูปที่อัปโหลดแล้ว';
    } else {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-filename': customFilename, 'Content-Type': file.type },
        body: file,
        signal: videoAbortController.signal,
      });
      if (!uploadRes.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
      const data = await uploadRes.json();
      imageUrl = data.url;
      lastUploadedFile = file;
      lastUploadedUrl = imageUrl;
    }

    if (statusText) {
      statusText.innerHTML = `⚡ กำลังสร้างวิดีโอด้วย ${selectedEngine}...`;
    }

    // เรียก API endpoint ที่รวมทุก engine
    const genRes = await fetch('/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt,
        filename: customFilename,
        engine: selectedEngine,
      }),
      signal: videoAbortController.signal,
    });

    const data = await genRes.json();
    if (!genRes.ok) throw new Error(data.error || 'สร้างวิดีโอไม่สำเร็จ');

    const videoUrl = data.videoUrl || data.taskId;
    if (!videoUrl) throw new Error('ไม่ได้รับลิงก์วิดีโอ');

    if (statusText) {
      statusText.innerHTML = `✅ สำเร็จ! <a href="${videoUrl}" target="_blank" class="underline text-purple-400">เปิดวิดีโอ</a> | <a href="/artifact.html" class="underline text-emerald-400">ดูผลงาน</a>`;
    }
    saveFilename(customFilename);
  } catch (err) {
    if (err.name === 'AbortError') {
      if (statusText) statusText.innerHTML = '⏹️ ยกเลิกแล้ว';
      return;
    }
    console.error('Generate error:', err);
    if (statusText) statusText.innerHTML = `❌ เกิดข้อผิดพลาด: ${err.message}`;
    showToast(`สร้างวิดีโอไม่สำเร็จ: ${err.message}`, 'error');
  } finally {
    generateBtn.disabled = false;
    videoAbortController = null;
    setTimeout(() => { if (statusText) statusText.classList.add('hidden'); }, 15000);
  }
}

// ปุ่ม Generate เรียกใช้งานจาก dropdown
generateBtn?.addEventListener('click', debounce(() => generateVideo(), 1000));

// ========== STEP 18: แสดงข้อมูล engine เมื่อเปลี่ยน dropdown ==========
if (videoEngineSelect) {
  videoEngineSelect.addEventListener('change', () => {
    const descriptions = {
      'fal': 'FAL Kling: คุณภาพระดับมืออาชีพ, ใช้ API Key, ราคาสูง',
      'magic': 'Magic Hour: ฟรี 400 เครดิต/วัน, เอฟเฟกต์หวือหวา',
      'runway': '🚀 Runway Gen-4: Motion Brush, Camera Control, ทดลองฟรี 125 ครั้ง',
      'pika': '🎨 Pika 2.2: เอฟเฟกต์สร้างสรรค์, ฟรี ~80 เครดิต/เดือน',
      'nexa': '🔮 NexaAPI: รวมหลายโมเดล (Veo, Kling, Sora), ฟรี 100 ครั้ง',
      'wavespeed': '⚡ WaveSpeedAI: รวม 700+ โมเดล, มี Free Tier',
    };
    if (engineInfo) engineInfo.textContent = descriptions[this.value] || '';
  });
  // เรียกครั้งแรกให้แสดงข้อความ
  videoEngineSelect.dispatchEvent(new Event('change'));
}

// ========== STEP 19: Slideshow Generator ==========
async function generateSlideshow() {
  if (selectedFiles.length < 2) {
    showToast('ต้องมีอย่างน้อย 2 รูปสำหรับ Slideshow', 'error');
    return;
  }
  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '🎞️ กำลังสร้าง Slideshow...';
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // ใช้ MediaRecorder บันทึก canvas เป็นวิดีโอ
    const chunks = [];
    const stream = canvas.captureStream(60);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filenameInput?.value || 'slideshow'}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      if (statusText) {
        statusText.innerHTML = '✅ Slideshow พร้อม!';
        setTimeout(() => statusText.classList.add('hidden'), 5000);
      }
    };

    recorder.start();
    // แสดงรูปแต่ละใบ 1.5 วินาที
    for (let i = 0; i < selectedFiles.length; i++) {
      const img = new Image();
      img.src = selectedFiles[i].url;
      await new Promise(resolve => {
        img.onload = () => { drawCoverImage(ctx, img, canvas); resolve(); };
        img.onerror = resolve;
      });
      await new Promise(r => setTimeout(r, 1500));
    }
    recorder.stop();
  } catch (err) {
    console.error('Slideshow error:', err);
    showToast('สร้าง Slideshow ไม่สำเร็จ', 'error');
  }
}

// ========== STEP 20: Intro Generator (Fade-in + แบรนด์) ==========
async function generateIntro() {
  if (selectedFiles.length === 0) {
    showToast('กรุณาอัปโหลดรูปก่อน', 'error');
    return;
  }
  const brand = brandInput?.value.trim() || 'สินค้า';
  const filename = filenameInput?.value || 'intro';

  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '🎞️ กำลังสร้าง Intro...';
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const chunks = [];
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${filename}.webm`; a.click();
      URL.revokeObjectURL(url);
      if (statusText) {
        statusText.innerHTML = '✅ Intro พร้อม!';
        setTimeout(() => statusText.classList.add('hidden'), 5000);
      }
    };

    recorder.start();
    // แสดงภาพทีละภาพ พร้อม fade-in และข้อความแบรนด์
    for (let i = 0; i < selectedFiles.length; i++) {
      const img = new Image();
      img.src = selectedFiles[i].url;
      await new Promise(resolve => {
        img.onload = () => {
          // 30 เฟรม fade-in
          for (let frame = 0; frame < 30; frame++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = frame / 30;
            drawCoverImage(ctx, img, canvas);
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'white';
            ctx.font = 'bold 60px "Noto Sans Thai", sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowBlur = 20;
            ctx.fillText(brand, canvas.width / 2, canvas.height - 200);
            ctx.shadowBlur = 0;
          }
          resolve();
        };
        img.onerror = resolve;
      });
      await new Promise(r => setTimeout(r, 500));
    }
    recorder.stop();
  } catch (err) {
    console.error('Intro error:', err);
    showToast('สร้าง Intro ไม่สำเร็จ', 'error');
  }
}

// ========== STEP 21: CTA Generator (สินค้า + จอ Call-to-Action) ==========
async function generateCTA() {
  if (selectedFiles.length === 0) {
    showToast('กรุณาอัปโหลดรูปก่อน', 'error');
    return;
  }
  const brand = brandInput?.value.trim() || 'สินค้า';
  const filename = filenameInput?.value || 'cta';

  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '🔥 กำลังสร้าง CTA...';
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const chunks = [];
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${filename}.webm`; a.click();
      URL.revokeObjectURL(url);
      if (statusText) {
        statusText.innerHTML = '✅ CTA พร้อม!';
        setTimeout(() => statusText.classList.add('hidden'), 5000);
      }
    };

    recorder.start();
    // แสดงสินค้าแต่ละภาพ 1 วินาที
    for (let i = 0; i < selectedFiles.length; i++) {
      const img = new Image();
      img.src = selectedFiles[i].url;
      await new Promise(resolve => {
        img.onload = () => { drawCoverImage(ctx, img, canvas); resolve(); };
        img.onerror = resolve;
      });
      await new Promise(r => setTimeout(r, 1000));
    }

    // จอสุดท้าย (CTA)
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px "Noto Sans Thai", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 สั่งซื้อเลย!', canvas.width / 2, canvas.height / 2 - 100);
    ctx.font = '50px "Noto Sans Thai", sans-serif';
    ctx.fillText('@snapzreview', canvas.width / 2, canvas.height / 2 + 100);
    await new Promise(r => setTimeout(r, 2000));

    recorder.stop();
  } catch (err) {
    console.error('CTA error:', err);
    showToast('สร้าง CTA ไม่สำเร็จ', 'error');
  }
}

// ========== STEP 22: Thumbnail Generator (ภาพปก PNG) ==========
async function generateThumbnail() {
  if (selectedFiles.length === 0) {
    showToast('กรุณาอัปโหลดรูปก่อน', 'error');
    return;
  }

  const brand = brandInput?.value.trim() || 'สินค้า';
  const filename = filenameInput?.value || 'thumbnail';

  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '🎨 กำลังสร้าง Thumbnail...';
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = selectedFiles[0].url;
    await new Promise((resolve, reject) => {
      img.onload = () => {
        // พื้นหลังดำ
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // วาดภาพสินค้า
        drawCoverImage(ctx, img, canvas);
        // ข้อความแบรนด์
        ctx.fillStyle = 'white';
        ctx.font = 'bold 70px "Noto Sans Thai", sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 30;
        ctx.fillText(brand, canvas.width / 2, canvas.height - 250);
        ctx.font = '50px "Noto Sans Thai", sans-serif';
        ctx.fillText('@snapzreview', canvas.width / 2, canvas.height - 150);
        ctx.shadowBlur = 0;
        resolve();
      };
      img.onerror = () => reject(new Error('โหลดรูปไม่สำเร็จ'));
    });

    // Export เป็น PNG
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${filename}-thumbnail.png`; a.click();
      URL.revokeObjectURL(url);
      if (statusText) {
        statusText.innerHTML = '✅ Thumbnail พร้อม!';
        setTimeout(() => statusText.classList.add('hidden'), 5000);
      }
    }, 'image/png');
  } catch (err) {
    console.error('Thumbnail error:', err);
    showToast('สร้าง Thumbnail ไม่สำเร็จ', 'error');
    if (statusText) statusText.classList.add('hidden');
  }
}

// ========== STEP 23: ผูก Event สำหรับปุ่มฟรี (Intro, CTA, Thumb) ==========
genIntroBtn?.addEventListener('click', debounce(generateIntro, 1000));
genCTABtn?.addEventListener('click', debounce(generateCTA, 1000));
genThumbnailBtn?.addEventListener('click', debounce(generateThumbnail, 1000));

// ========== STEP 24: เริ่มต้นเมื่อโหลดหน้า ==========
renderPreview();
updateFilename();
