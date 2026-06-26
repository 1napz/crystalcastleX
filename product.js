// product.js — Crystal Castle AI Video Studio
// ========== DOM REFS ==========
const $ = (id) => document.getElementById(id);
const fileInput = $('fileInput');
const uploadBtn = $('uploadBtn');
const previewGrid = $('previewGrid');
const filenameInput = $('filenameInput');
const promptInput = $('promptInput');
const genPromptBtn = $('genPromptBtn');
const genFALBtn = $('genFALBtn');
const genHFBtn = $('genHFBtn');
const genSlideshowBtn = $('genSlideshowBtn');
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

let selectedFiles = [];

// ========== UTILITY: Debounce ==========
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========== TOAST (แทน alert) ==========
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  const colors = { info: 'bg-blue-600', error: 'bg-red-600', success: 'bg-green-600' };
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm shadow-lg ${colors[type] || colors.info}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ========== DUPLICATE NAME CHECK ==========
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

// ========== AUTO FILENAME ==========
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

// ========== IMAGE UPLOAD & PREVIEW ==========
uploadBtn?.addEventListener('click', () => fileInput.click());

function renderPreview() {
  if (!previewGrid) return;
  previewGrid.querySelectorAll('img').forEach(img => {
    if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  });
  previewGrid.innerHTML = '';

  if (selectedFiles.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50';
    emptyDiv.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 16l4-4 4-4 4 4M12 12v-2M12 8v-2M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg><span class="text-[11px] mt-1">ยังไม่มีรูป</span>`;
    previewGrid.appendChild(emptyDiv);
    updateFilename();
    return;
  }

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

// ========== PROMPT TEMPLATES ==========
const promptTemplates = {
  'Menswear': 'Professional fashion video of {brand} menswear. Slow cinematic pan around male model, sharp focus on fabric texture and fit. Clean white studio background, soft natural lighting.',
  'Womenswear': 'Elegant fashion video of {brand} womenswear. Female model walking gracefully, flowy fabric movement in slow motion. Soft dramatic lighting, warm tone.',
  'Accessories': 'Luxury product video of {brand} accessory. 360-degree slow rotation on smooth surface. Close-up macro shots highlighting details.',
  'Shoes': 'Dynamic product showcase of {brand} shoes. Model walking on reflective surface. Focus on sole detail and material texture.',
  'Bags': 'Luxury handbag video of {brand} bag. Elegant hand interaction, slow orbit camera. Rich leather texture close-up.',
  'default': 'Professional product video of {brand}. Clean studio background, 360-degree slow rotation, sharp focus on product details.'
};

// ========== AI PROMPT ==========
let lastOriginalPrompt = '';
const handleGenPrompt = async () => {
  const brand = brandInput?.value.trim() || 'สินค้า';
  const category = categorySelect?.value || 'default';
  let baseTemplate = promptTemplates[category] || promptTemplates['default'];
  baseTemplate = baseTemplate.replace('{brand}', brand);
  lastOriginalPrompt = baseTemplate;
  promptInput.value = baseTemplate;

  genPromptBtn.disabled = true;
  genPromptBtn.innerHTML = '⚙️ AI กำลังแต่ง...';
  if (promptStatus) promptStatus.innerHTML = '⏳ กำลังเรียก AI...';
  
  try {
    const res = await fetch('/api/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: baseTemplate, category }),
    });
    const data = await res.json();
    if (res.ok && data.result) {
      promptInput.value = data.result;
      if (promptStatus) promptStatus.innerHTML = '✅ AI แต่งเสร็จ';
      if (copyPromptBtn) copyPromptBtn.classList.remove('hidden');
      if (undoPromptBtn) undoPromptBtn.classList.remove('hidden');
      genPromptBtn.innerHTML = '✨ แต่งใหม่';
    } else {
      throw new Error(data.error || 'error');
    }
  } catch (err) {
    console.error('Prompt error:', err);
    if (promptStatus) promptStatus.innerHTML = '⚠️ ใช้ต้นฉบับ (AI ไม่พร้อม)';
    genPromptBtn.innerHTML = '✨ ลองใหม่';
  } finally {
    genPromptBtn.disabled = false;
  }
};
genPromptBtn?.addEventListener('click', debounce(handleGenPrompt, 500));

// ========== COPY / UNDO PROMPT ==========
copyPromptBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(promptInput.value);
  if (promptStatus) promptStatus.innerHTML = '📋 คัดลอกแล้ว';
});
undoPromptBtn?.addEventListener('click', () => {
  if (lastOriginalPrompt) {
    promptInput.value = lastOriginalPrompt;
    if (promptStatus) promptStatus.innerHTML = '↶ กลับต้นฉบับ';
  }
});

// ========== AI CAPTION ==========
const handleGenPost = async () => {
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
  
  try {
    const res = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, brand, category }),
    });
    const data = await res.json();
    if (data.post) {
      postOutput.value = data.post;
      if (copyPostBtn) copyPostBtn.classList.remove('hidden');
      genPostBtn.innerHTML = '✅ เสร็จ';
    } else {
      throw new Error('Fallback');
    }
  } catch {
    postOutput.value = `✨ ${brand} สวยโดนใจ! พร้อมส่งจาก @snapzreview\n\n#snapzreview #แฟชั่น #AIvideo`;
    genPostBtn.innerHTML = '⚠️ แบบสำเร็จรูป';
    if (copyPostBtn) copyPostBtn.classList.remove('hidden');
  } finally {
    genPostBtn.disabled = false;
  }
};
genPostBtn?.addEventListener('click', debounce(handleGenPost, 500));
copyPostBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(postOutput.value);
  copyPostBtn.innerHTML = '✅ คัดลอกแล้ว';
  setTimeout(() => { copyPostBtn.innerHTML = '📋 คัดลอกแคปชั่น'; }, 2000);
});

// ========== GENERATE VIDEO ==========
let lastUploadedFile = null;
let lastUploadedUrl = null;

async function generateVideo(engine) {
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
  
  [genFALBtn, genHFBtn, generateBtn].forEach(b => { if (b) b.disabled = true; });
  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '📤 กำลังอัปโหลดรูป...';
  }
  
  const engineLabel = engine === 'FAL' ? 'FAL Kling' : 'Magic Hour';
  try {
    const file = selectedFiles[0].file;
    const fileExt = file.name.split('.').pop();
    const finalFilename = `${customFilename}.${fileExt}`;
    let imageUrl;
    
    if (lastUploadedFile === file && lastUploadedUrl) {
      imageUrl = lastUploadedUrl;
      if (statusText) statusText.innerHTML = '📦 ใช้รูปที่อัปโหลดแล้ว';
    } else {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-filename': finalFilename, 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
      const data = await uploadRes.json();
      imageUrl = data.url;
      lastUploadedFile = file;
      lastUploadedUrl = imageUrl;
    }
    
    if (statusText) {
      statusText.innerHTML = `⚡ กำลังสร้างวิดีโอ (${engineLabel})...`;
    }
    
    const apiUrl = engine === 'FAL' ? '/api/video' : '/api/magichour';
    const genRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, prompt, filename: customFilename }),
    });
    
    const data = await genRes.json();
    if (!genRes.ok) throw new Error(data.error || 'สร้างวิดีโอไม่สำเร็จ');
    if (!data.video_url) throw new Error('ไม่ได้รับลิงก์วิดีโอ');
    
    if (statusText) {
      statusText.innerHTML = `✅ สำเร็จ! <a href="${data.video_url}" target="_blank" class="underline text-purple-400">เปิดวิดีโอ</a> | <a href="/artifact.html" class="underline text-emerald-400">ดูผลงาน</a>`;
    }
    saveFilename(customFilename);
  } catch (err) {
    console.error('Generate error:', err);
    if (statusText) statusText.innerHTML = `❌ เกิดข้อผิดพลาด: ${err.message}`;
    showToast(`สร้างวิดีโอไม่สำเร็จ: ${err.message}`, 'error');
  } finally {
    [genFALBtn, genHFBtn, generateBtn].forEach(b => { if (b) b.disabled = false; });
    setTimeout(() => { if (statusText) statusText.classList.add('hidden'); }, 15000);
  }
}

genFALBtn?.addEventListener('click', debounce(() => generateVideo('FAL'), 1000));
genHFBtn?.addEventListener('click', debounce(() => generateVideo('HF'), 1000));

// ========== SLIDESHOW ==========
async function generateSlideshow() {
  if (selectedFiles.length < 2) {
    showToast('ต้องมีอย่างน้อย 2 รูป', 'error');
    return;
  }
  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '🎞️ กำลังสร้าง Slideshow...';
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    const chunks = [];
    const stream = canvas.captureStream(30);
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
    for (let i = 0; i < selectedFiles.length; i++) {
      const img = new Image();
      img.src = selectedFiles[i].url;
      await new Promise(resolve => {
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          ctx.drawImage(img, (canvas.width - img.width * scale) / 2, (canvas.height - img.height * scale) / 2, img.width * scale, img.height * scale);
          resolve();
        };
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
if (genSlideshowBtn) genSlideshowBtn.addEventListener('click', generateSlideshow);

// ========== INIT ==========
renderPreview();
updateFilename();