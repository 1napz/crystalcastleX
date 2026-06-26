// product.js — @snapzreview AI Video Studio (เวอร์ชันสมบูรณ์ + Accessibility Fixes)
// รวม generateVideo, generateIntro, generateCTA, generateThumbnail แบบเต็ม

// ========== อ้างอิง DOM Elements ==========
const $ = (id) => document.getElementById(id);

const fileInput = $('fileInput');
const uploadBtn = $('uploadBtn');
const previewGrid = $('previewGrid');
const filenameInput = $('filenameInput');
const promptInput = $('promptInput');
const genPromptBtn = $('genPromptBtn');

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

const videoEngineSelect = $('videoEngineSelect');
const engineInfo = $('engineInfo');

// ========== ตัวแปรกลาง ==========
let selectedFiles = [];
let lastUploadedFile = null;
let lastUploadedUrl = null;
let videoAbortController = null;
let promptAbortController = null;
let postAbortController = null;

// ========== Toast ==========
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  const colors = { info: 'bg-blue-600', error: 'bg-red-600', success: 'bg-green-600' };
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm shadow-lg ${colors[type] || colors.info}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ========== Accessible Status (ARIA Live Region) ==========
function showStatus(message, type = 'info') {
  if (!statusText) return;
  
  statusText.classList.remove('hidden', 'text-red-600', 'text-green-600', 'text-violet-600');
  
  if (type === 'error') statusText.classList.add('text-red-600');
  else if (type === 'success') statusText.classList.add('text-green-600');
  else statusText.classList.add('text-violet-600');

  statusText.textContent = message;
  statusText.classList.remove('hidden');

  setTimeout(() => statusText.classList.add('hidden'), 10000);
}

// ========== Utility ==========
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

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

function updateFilename() {
  const now = new Date();
  const yyyymmdd = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  if (dateInput) dateInput.value = yyyymmdd;
  const category = categorySelect?.value || 'Product';
  const brand = brandInput?.value.trim().replace(/\s+/g, '') || 'Brand';
  const count = selectedFiles.length;
  filenameInput.value = `\( {yyyymmdd}- \){category}-\( {brand}- \){count}img`;
}

// ========== Render Preview ==========
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

// ========== Upload Logic ==========
uploadBtn?.addEventListener('click', () => fileInput.click());

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

// ========== Generate Video (Logic เต็ม) ==========
async function generateVideo() {
  if (videoAbortController) videoAbortController.abort();
  videoAbortController = new AbortController();

  if (selectedFiles.length === 0) {
    showStatus('กรุณาอัปโหลดรูปสินค้าก่อน', 'error');
    return;
  }

  const prompt = promptInput.value.trim();
  if (!prompt) {
    showStatus('กรุณาใส่ Prompt หรือให้ AI ช่วยคิดก่อน', 'error');
    return;
  }

  const customFilename = filenameInput?.value.trim() || `video-${Date.now()}`;
  if (checkDuplicateName(customFilename)) {
    if (!confirm(`ชื่อ ${customFilename} เคยใช้แล้ว จะสร้างทับไหม?`)) return;
  }

  const selectedEngine = videoEngineSelect?.value || 'fal';

  generateBtn.disabled = true;
  showStatus(`📤 กำลังอัปโหลดรูป...`, 'info');

  try {
    const file = selectedFiles[0].file;
    let imageUrl;

    if (lastUploadedFile === file && lastUploadedUrl) {
      imageUrl = lastUploadedUrl;
      showStatus('📦 ใช้รูปที่อัปโหลดแล้ว', 'info');
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

    showStatus(`⚡ กำลังสร้างวิดีโอด้วย ${selectedEngine}...`, 'info');

    const genRes = await fetch('/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: prompt,
        filename: customFilename,
        engine: selectedEngine,
      }),
      signal: videoAbortController.signal,
    });

    const data = await genRes.json();
    if (!genRes.ok) throw new Error(data.error || 'สร้างวิดีโอไม่สำเร็จ');

    const videoUrl = data.videoUrl || data.taskId;
    if (!videoUrl) throw new Error('ไม่ได้รับลิงก์วิดีโอ');

    showStatus(`✅ สำเร็จ! <a href="${videoUrl}" target="_blank" class="underline">เปิดวิดีโอ</a> | <a href="/artifact.html" class="underline">ดูผลงาน</a>`, 'success');
    saveFilename(customFilename);

  } catch (err) {
    if (err.name === 'AbortError') {
      showStatus('⏹️ ยกเลิกแล้ว', 'info');
      return;
    }
    console.error('Generate error:', err);
    showStatus(`❌ เกิดข้อผิดพลาด: ${err.message}`, 'error');
  } finally {
    generateBtn.disabled = false;
    videoAbortController = null;
  }
}

// ========== Generate Intro ==========
async function generateIntro() {
  if (selectedFiles.length === 0) {
    showStatus('กรุณาอัปโหลดรูปก่อน', 'error');
    return;
  }
  const brand = brandInput?.value.trim() || 'สินค้า';
  const filename = filenameInput?.value || 'intro';

  showStatus('🎞️ กำลังสร้าง Intro...', 'info');

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
      showStatus('✅ Intro พร้อมแล้ว!', 'success');
    };

    recorder.start();

    for (let i = 0; i < selectedFiles.length; i++) {
      const img = new Image();
      img.src = selectedFiles[i].url;
      await new Promise(resolve => {
        img.onload = () => {
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
    showStatus('สร้าง Intro ไม่สำเร็จ', 'error');
  }
}

// ========== Generate CTA ==========
async function generateCTA() {
  if (selectedFiles.length === 0) {
    showStatus('กรุณาอัปโหลดรูปก่อน', 'error');
    return;
  }
  const brand = brandInput?.value.trim() || 'สินค้า';
  const filename = filenameInput?.value || 'cta';

  showStatus('🔥 กำลังสร้าง CTA...', 'info');

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
      showStatus('✅ CTA พร้อมแล้ว!', 'success');
    };

    recorder.start();

    for (let i = 0; i < selectedFiles.length; i++) {
      const img = new Image();
      img.src = selectedFiles[i].url;
      await new Promise(resolve => {
        img.onload = () => { drawCoverImage(ctx, img, canvas); resolve(); };
        img.onerror = resolve;
      });
      await new Promise(r => setTimeout(r, 1000));
    }

    // จอ CTA สุดท้าย
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
    showStatus('สร้าง CTA ไม่สำเร็จ', 'error');
  }
}

// ========== Generate Thumbnail ==========
async function generateThumbnail() {
  if (selectedFiles.length === 0) {
    showStatus('กรุณาอัปโหลดรูปก่อน', 'error');
    return;
  }

  const brand = brandInput?.value.trim() || 'สินค้า';
  const filename = filenameInput?.value || 'thumbnail';

  showStatus('🎨 กำลังสร้าง Thumbnail...', 'info');

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = selectedFiles[0].url;
    await new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawCoverImage(ctx, img, canvas);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 70px "Noto Sans Thai", sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 30;
        ctx.fillText(brand, canvas.width / 2, canvas.height - 250);
        ctx.font = '50px "Noto Sans Thai", sans-serif';
        ctx.fillText('@snapzreview', canvas.width / 2, canvas.height - 150);
        ctx.shadowBlur = 0;
        resolve();
      };
      img.onerror = () => reject(new Error('โหลดรูปไม่สำเร็จ'));
    });

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${filename}-thumbnail.png`; a.click();
      URL.revokeObjectURL(url);
      showStatus('✅ Thumbnail พร้อมแล้ว!', 'success');
    }, 'image/png');
  } catch (err) {
    console.error('Thumbnail error:', err);
    showStatus('สร้าง Thumbnail ไม่สำเร็จ', 'error');
  }
}

// ========== Helper drawCoverImage ==========
function drawCoverImage(ctx, img, canvas) {
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}

// ========== Event Listeners ==========
generateBtn?.addEventListener('click', debounce(generateVideo, 800));
genIntroBtn?.addEventListener('click', debounce(generateIntro, 800));
genCTABtn?.addEventListener('click', debounce(generateCTA, 800));
genThumbnailBtn?.addEventListener('click', debounce(generateThumbnail, 800));

// ========== Dropdown Handler ==========
if (videoEngineSelect && engineInfo) {
  videoEngineSelect.addEventListener('change', function(event) {
    const value = event.target.value;
    const descriptions = {
      'openai': '✨ OpenAI Sora: สร้างวิดีโอความยาวสูงสุด 60 วินาที',
      'runway': '🎬 Runway Gen-2: ควบคุมการเคลื่อนไหวละเอียด',
      'pika': '🎨 Pika Labs: อนิเมชันสวย',
      'fal': 'FAL Kling: คุณภาพสูง (จ่าย)',
      'magic': 'Magic Hour: ฟรี 400 เครดิต/วัน',
      '': 'กรุณาเลือก Video Engine'
    };
    engineInfo.textContent = descriptions[value] || '';
  });
  videoEngineSelect.dispatchEvent(new Event('change'));
}

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
  renderPreview();
  updateFilename();
  console.log('✅ product.js โหลดสำเร็จ (รวมทุก generate function + Accessibility)');
});
