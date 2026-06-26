// Elements
const fileInput = document.getElementById('fileInput');
const filenameInput = document.getElementById('filenameInput');
const promptInput = document.getElementById('promptInput');
const genPromptBtn = document.getElementById('genPromptBtn');
const genFALBtn = document.getElementById('genFALBtn');
const genHFBtn = document.getElementById('genHFBtn');
const statusText = document.getElementById('statusText');
const imagePreview = document.getElementById('imagePreview');
const categorySelect = document.getElementById('categorySelect');
const brandInput = document.getElementById('brandInput');
const dateInput = document.getElementById('dateInput');

// ใหม่
const promptStatus = document.getElementById('promptStatus');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const undoPromptBtn = document.getElementById('undoPromptBtn');
const genPostBtn = document.getElementById('genPostBtn');
const postOutput = document.getElementById('postOutput');
const copyPostBtn = document.getElementById('copyPostBtn');

// ออโต้ชื่อไฟล์
function updateFilename() {
  const now = new Date();
  const yyyymmdd = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  if (dateInput) dateInput.value = yyyymmdd;
  const category = categorySelect?.value || 'Product';
  const brand = brandInput?.value.trim().replace(/\s+/g, '') || 'Brand';
  filenameInput.value = `${yyyymmdd}-${category}-${brand}`;
}
document.addEventListener('DOMContentLoaded', updateFilename);
categorySelect?.addEventListener('change', updateFilename);
brandInput?.addEventListener('input', updateFilename);
setInterval(updateFilename, 60000);

// LocalStorage
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

// พรีวิวรูป
fileInput?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file || !imagePreview) return;
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
    fileInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.src = event.target.result;
    imagePreview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

// Templates (อัพเกรดใหม่ - เน้นวิดีโอ 5 วินาที)
const promptTemplates = {
  'Menswear': 'A confident male model walking powerfully on a luxury fashion runway, wearing this {item}, dynamic tracking shot, smooth fabric movement, dramatic cinematic lighting, sharp shadows, 4K, high-end commercial video',
  'Womenswear': 'Elegant female model strutting on a high-end catwalk, wearing this {item}, flowing fabric in slow motion, cinematic side pan camera, soft dramatic lighting with highlights, 4K, vogue fashion film style',
  'Accessories': 'Close-up luxury product shot of this {item} on a glossy rotating platform, sparkling details, slow smooth 360 orbit camera, premium studio lighting with beautiful reflections, 4K, high-end commercial',
  'Shoes': 'Dynamic shot of model walking in this {item}, sharp focus on foot movement and sole detail, runway reflection, smooth tracking camera, cinematic lighting, 4K, luxury fashion video',
  'Bags': 'Luxury handbag showcase, this {item} on a marble pedestal with elegant hand interaction, slow cinematic camera orbit, rich leather texture close-up, soft dramatic lighting, 4K, premium product commercial',
  'default': 'Professional luxury product showcase of this {item}, clean modern studio, dynamic camera movement, smooth motion, premium cinematic lighting, 4K, high-end commercial video style'
};

let lastOriginalPrompt = '';

// === Gen Prompt ใหม่ ===
genPromptBtn?.addEventListener('click', async () => {
  const filename = filenameInput.value.trim();
  if (!filename) {
    alert('ใส่ชื่อไฟล์ก่อนนะ');
    return;
  }
  const parts = filename.split('-');
  const category = parts[1] || 'default';
  const brand = parts[2] || 'item';
  let baseTemplate = promptTemplates[category] || promptTemplates['default'];
  baseTemplate = baseTemplate.replace('{item}', brand.toLowerCase());
  lastOriginalPrompt = baseTemplate;
  promptInput.value = baseTemplate;

  genPromptBtn.disabled = true;
  genPromptBtn.innerHTML = '<span class="spin inline-block mr-1">⚙️</span> AI กำลังแต่ง...';
  promptStatus.textContent = 'กำลังเรียก Groq...';
  promptInput.classList.add('ring-2', 'ring-purple-400');

  try {
    const res = await fetch('/api/ai/prompt/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_prompt: baseTemplate, category })
    });
    const data = await res.json();
    if (res.ok && data.enhanced_prompt) {
      promptInput.value = data.enhanced_prompt;
      promptStatus.textContent = '✅ AI แต่งเสร็จ';
      copyPromptBtn?.classList.remove('hidden');
      undoPromptBtn?.classList.remove('hidden');
      genPromptBtn.innerHTML = '✨ แต่งใหม่';
    } else throw new Error(data.error);
  } catch (err) {
    promptInput.value = baseTemplate;
    promptStatus.textContent = '⚠️ ใช้ต้นฉบับ (Groq ยังไม่พร้อม)';
    genPromptBtn.innerHTML = '✨ ลองใหม่';
  } finally {
    genPromptBtn.disabled = false;
    setTimeout(() => promptInput.classList.remove('ring-2', 'ring-purple-400'), 1000);
  }
});

copyPromptBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(promptInput.value);
  promptStatus.textContent = '📋 คัดลอกแล้ว';
});
undoPromptBtn?.addEventListener('click', () => {
  if (lastOriginalPrompt) {
    promptInput.value = lastOriginalPrompt;
    promptStatus.textContent = '↶ กลับต้นฉบับ';
  }
});

// === Generate Post ===
genPostBtn?.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  const filename = filenameInput.value.trim();
  if (!prompt) return alert('เจน Prompt ก่อน');

  genPostBtn.disabled = true;
  genPostBtn.textContent = '✍️ กำลังเขียน...';
  postOutput.value = '';

  try {
    const res = await fetch('/api/ai/post/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        prompt,
        brand: brandInput?.value || '',
        category: categorySelect?.value || ''
      })
    });
    const data = await res.json();
    if (data.post) {
      postOutput.value = data.post;
      copyPostBtn.classList.remove('hidden');
      genPostBtn.textContent = '✅ เสร็จ';
    } else throw new Error(data.error);
  } catch {
    postOutput.value = `ลุคใหม่ ${brandInput.value} พร้อมแล้ว ✨\n\n#CrystalCastle #${categorySelect.value}`;
    genPostBtn.textContent = '⚠️ แบบง่าย';
  } finally {
    setTimeout(() => {
      genPostBtn.disabled = false;
      genPostBtn.textContent = '📝 Generate Post';
    }, 1500);
  }
});
copyPostBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(postOutput.value);
  copyPostBtn.textContent = '✅ คัดลอกแล้ว';
  setTimeout(() => copyPostBtn.textContent = '📋 คัดลอกแคปชั่น', 2000);
});

// === Generate Video ===
async function generateVideo(engine) {
  const file = fileInput.files[0];
  const customFilename = filenameInput.value.trim();
  const prompt = promptInput.value.trim();
  if (!file || !customFilename || !prompt) {
    alert('อัพรูป ตั้งชื่อ และใส่ Prompt ให้ครบก่อน');
    return;
  }
  if (checkDuplicateName(customFilename)) {
    if (!confirm(`ชื่อ ${customFilename} เคยใช้แล้ว จะเจนทับไหม?`)) return;
  }

  genFALBtn.disabled = true;
  genHFBtn.disabled = true;
  statusText.classList.remove('hidden');
  statusText.textContent = engine === 'FAL' ? '🚀 กำลังส่งไป FAL...' : '🆓 กำลังส่งไป Magic Hour...';

  try {
    const fileExt = file.name.split('.').pop();
    const finalFilename = `${customFilename}.${fileExt}`;
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-filename': finalFilename, 'Content-Type': file.type },
      body: file
    });
    if (!uploadRes.ok) throw new Error('Upload failed');
    const { url: imageUrl } = await uploadRes.json();

    statusText.textContent = engine === 'FAL' ? '⚡️ FAL กำลังเจน 1-2 นาที...' : '⏳ Magic Hour กำลังเจน 3-5 นาที...';

    const apiUrl = engine === 'FAL' ? '/api/generate' : '/api/magichour';
    const genRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, prompt, filename: customFilename })
    });
    const data = await genRes.json();
    if (!genRes.ok) throw new Error(data.error || 'Generate failed');

    statusText.textContent = '✅ เจนเสร็จ กำลังโหลด...';
    const a = document.createElement('a');
    a.href = data.video_url;
    a.download = `${customFilename}-${engine}.mp4`;
    a.click();
    saveFilename(customFilename);
    statusText.textContent = `✅ สำเร็จ!`;
  } catch (err) {
    statusText.textContent = `❌ ${err.message}`;
  } finally {
    genFALBtn.disabled = false;
    genHFBtn.disabled = false;
    setTimeout(() => statusText.classList.add('hidden'), 8000);
  }
}

genFALBtn?.addEventListener('click', () => generateVideo('FAL'));
genHFBtn?.addEventListener('click', () => generateVideo('HF'));