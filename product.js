// product.js — ฉบับ Optimize (Error Recovery + AbortController + Memory Safety)
// Crystal Castle AI Video Studio

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

// ========== GLOBAL ERROR RECOVERY ==========
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = `⚠️ เกิดข้อผิดพลาด: ${event.reason?.message || 'ไม่ทราบสาเหตุ'}`;
    setTimeout(() => statusText.classList.add('hidden'), 5000);
  }
  event.preventDefault();
});

// ========== TOAST (แทน alert) ==========
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  const colors = { info: 'bg-blue-600', error: 'bg-red-600', success: 'bg-green-600' };
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm shadow-lg ${colors[type] || colors.info}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ========== UTILITY: Debounce ==========
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========== UTILITY: Cache (sessionStorage) ==========
function getCache(key) { return sessionStorage.getItem(key); }
function setCache(key, value) { sessionStorage.setItem(key, value); }

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

// ========== MEMORY-SAFE OBJECT URL TRACKING ==========
const objectURLs = new Set();
function createSafeObjectURL(file) {
  const url = URL.createObjectURL(file);
  objectURLs.add(url);
  return url;
}
function revokeAllObjectURLs() {
  objectURLs.forEach(url => URL.revokeObjectURL(url));
  objectURLs.clear();
}
// Revoke all on page unload to prevent memory leak
window.addEventListener('pagehide', revokeAllObjectURLs);
window.addEventListener('beforeunload', revokeAllObjectURLs);

// ========== IMAGE UPLOAD & PREVIEW ==========
uploadBtn?.addEventListener('click', () => fileInput.click());

function renderPreview() {
  if (!previewGrid) return;

  // Revoke old URLs before re-render
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
    img.src = createSafeObjectURL(fileObj.file);
    img.alt = 'Product image';
    img.className = 'w-full h-full object-cover';
    img.setAttribute('loading', 'lazy');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition';
    btn.textContent = '×';
    btn.setAttribute('aria-label', 'Remove image');
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

// ========== FILE INPUT ==========
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 6;
fileInput?.addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []);
  files.forEach(f => {
    if (selectedFiles.length >= MAX_FILES) {
      showToast(`อัปโหลดได้สูงสุด ${MAX_FILES} รูป`, 'error');
      return;
    }
    if (!f.type.startsWith('image/')) {
      showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'error');
      return;
    }
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showToast(`ไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE_MB}MB (${(f.size / 1024 / 1024).toFixed(1)}MB)`, 'error');
      return;
    }
    selectedFiles.push({ url: createSafeObjectURL(f), file: f });
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

// ========== AI PROMPT (with AbortController + cache + retry) ==========
let lastOriginalPrompt = '';
let promptAbortController = null;

const handleGenPrompt = async () => {
  // Abort previous request if still pending
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

  // Check cache
  const cacheKey = `prompt_${brand}_${category}`;
  const cached = getCache(cacheKey);
  if (cached) {
    promptInput.value = cached;
    if (promptStatus) promptStatus.innerHTML = '📦 ใช้จาก cache (ไม่เรียก AI)';
    if (copyPromptBtn) copyPromptBtn.classList.remove('hidden');
    if (undoPromptBtn) undoPromptBtn.classList.remove('hidden');
    genPromptBtn.innerHTML = '✨ แต่งใหม่';
    return;
  }

  genPromptBtn.disabled = true;
  genPromptBtn.innerHTML = '⚙️ AI กำลังแต่ง...';
  if (promptStatus) promptStatus.innerHTML = '⏳ กำลังเรียก AI...';
  promptInput.classList.add('ring-2', 'ring-purple-400');

  promptAbortController = new AbortController();

  const MAX_RETRIES = 2;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: baseTemplate, category }),
        signal: promptAbortController.signal,
      });

      const data = await res.json();
      if (res.ok && data.result) {
        promptInput.value = data.result;
        setCache(cacheKey, data.result);
        if (promptStatus) promptStatus.innerHTML = '✅ AI แต่งเสร็จ (cached)';
        if (copyPromptBtn) copyPromptBtn.classList.remove('hidden');
        if (undoPromptBtn) undoPromptBtn.classList.remove('hidden');
        genPromptBtn.innerHTML = '✨ แต่งใหม่';
        break;
      }
      throw new Error(data.error || 'ไม่สามารถแต่ง Prompt ได้');
    } catch (err) {
      if (err.name === 'AbortError') {
        if (promptStatus) promptStatus.innerHTML = '⏹️ ยกเลิกแล้ว';
        break;
      }
      if (attempt === MAX_RETRIES) {
        console.error('Prompt error after retries:', err);
        promptInput.value = baseTemplate;
        if (promptStatus) promptStatus.innerHTML = '⚠️ ใช้ต้นฉบับ (AI ไม่พร้อม)';
        genPromptBtn.innerHTML = '✨ ลองใหม่';
      } else {
        if (promptStatus) promptStatus.innerHTML = `🔄 กำลังลองใหม่ (${attempt + 1}/${MAX_RETRIES})...`;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  genPromptBtn.disabled = false;
  promptAbortController = null;
  setTimeout(() => promptInput.classList.remove('ring-2', 'ring-purple-400'), 1000);
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

// ========== AI CAPTION (with AbortController + cache) ==========
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
  const cacheKey = `post_${brand}_${category}_${prompt.substring(0, 50)}`;

  const cached = getCache(cacheKey);
  if (cached) {
    postOutput.value = cached;
    if (copyPostBtn) copyPostBtn.classList.remove('hidden');
    genPostBtn.innerHTML = '✅ เสร็จ (cache)';
    return;
  }

  genPostBtn.disabled = true;
  genPostBtn.innerHTML = '✍️ กำลังเขียน...';
  postOutput.value = '';
  postAbortController = new AbortController();

  const fallbackPost = `✨ ${brand} สวยโดนใจ! พร้อมส่งจาก Crystal Castle\n\n#CrystalCastle #แฟชั่น #AIvideo`;

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
      setCache(cacheKey, data.post);
      if (copyPostBtn) copyPostBtn.classList.remove('hidden');
      genPostBtn.innerHTML = '✅ เสร็จ';
    } else {
      throw new Error('Fallback');
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      genPostBtn.innerHTML = '⏹️ ยกเลิก';
      return;
    }
    postOutput.value = fallbackPost;
    genPostBtn.innerHTML = '⚠️ แบบสำเร็จรูป';
    if (copyPostBtn) copyPostBtn.classList.remove('hidden');
  } finally {
    genPostBtn.disabled = false;
    postAbortController = null;
    setTimeout(() => { if (genPostBtn.innerHTML.includes('เสร็จ') || genPostBtn.innerHTML.includes('สำเร็จรูป')) genPostBtn.innerHTML = '📝 Generate Post'; }, 1500);
  }
};

genPostBtn?.addEventListener('click', debounce(handleGenPost, 500));
copyPostBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(postOutput.value);
  copyPostBtn.innerHTML = '✅ คัดลอกแล้ว';
  setTimeout(() => { copyPostBtn.innerHTML = '📋 คัดลอกแคปชั่น'; }, 2000);
});

// ========== GENERATE VIDEO (with reuse upload + progress) ==========
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

  // Disable all generate buttons
  [genFALBtn, genHFBtn, generateBtn].forEach(b => { if (b) b.disabled = true; });

  if (statusText) {
    statusText.classList.remove('hidden');
    statusText.innerHTML = '📤 กำลังอัปโหลดรูป...';
  }

  const engineLabel = engine === 'FAL' ? 'FAL Kling' : 'Magic Hour';
  const waitTime = engine === 'FAL' ? '1-2 นาที' : '3-5 นาที';

  try {
    const file = selectedFiles[0].file;
    const fileExt = file.name.split('.').pop();
    const finalFilename = `${customFilename}.${fileExt}`;
    let imageUrl;

    // Reuse upload if same file
    if (lastUploadedFile === file && lastUploadedUrl) {
      imageUrl = lastUploadedUrl;
      if (statusText) statusText.innerHTML = '📦 ใช้รูปที่อัปโหลดแล้ว (cache)';
    } else {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-filename': finalFilename, 'Content-Type': file.type },
        body: file,
        signal: AbortSignal.timeout(30000),
      });
      if (!uploadRes.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
      const data = await uploadRes.json();
      imageUrl = data.url;
      lastUploadedFile = file;
      lastUploadedUrl = imageUrl;
    }

    if (statusText) {
      statusText.innerHTML = `⚡ กำลังสร้างวิดีโอ (${engineLabel}) ประมาณ ${waitTime}...`;
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

// ========== SLIDESHOW GENERATOR (FREE, NO API) ==========
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
    // Create slideshow from selected images using Canvas API (client-side only)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const chunks = [];
    const stream = canvas.captureStream(60); // 60 FPS
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
        statusText.innerHTML = '✅ Slideshow พร้อม! ดาวน์โหลดเริ่มแล้ว';
        setTimeout(() => statusText.classList.add('hidden'), 5000);
      }
    };

    recorder.start();

    // Draw each image for ~1.5 seconds
    for (let i = 0; i < selectedFiles.length; i++) {
      const img = new Image();
      img.src = selectedFiles[i].url;
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Cover-fit
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          ctx.drawImage(img, x, y, w, h);
          resolve();
        };
        img.onerror = resolve;
      });
      await new Promise(r => setTimeout(r, 1500));
    }

    recorder.stop();
  } catch (err) {
    console.error('Slideshow error:', err);
    if (statusText) statusText.innerHTML = `❌ สร้าง Slideshow ไม่สำเร็จ: ${err.message}`;
  }
}

if (genSlideshowBtn) {
  genSlideshowBtn.addEventListener('click', generateSlideshow);
}

// ========== INITIAL RENDER ==========
renderPreview();
updateFilename();
document.addEventListener('DOMContentLoaded', () => {
  renderPreview();
  updateFilename();
});