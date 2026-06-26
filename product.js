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

// ออโต้ชื่อไฟล์ yyyymmdd-Category-Brand ตามเวลาจริง
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

// รันครั้งแรก + เวลาเปลี่ยน dropdown/input
document.addEventListener('DOMContentLoaded', updateFilename);
categorySelect?.addEventListener('change', updateFilename);
brandInput?.addEventListener('input', updateFilename);
// อัพเดททุกนาที เผื่อข้ามวัน
setInterval(updateFilename, 60000);

// LocalStorage เช็คชื่อซ้ำ
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
  if (!file ||!imagePreview) return;

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
  reader.onerror = () => alert('อ่านไฟล์รูปไม่ได้');
  reader.readAsDataURL(file);
});

// Template Prompt ตาม Category
const promptTemplates = {
  'Menswear': 'A male model confidently walking on a fashion runway, wearing this {item}, cinematic lighting, 4k, high fashion, smooth fabric movement',
  'Womenswear': 'A female model strutting on a catwalk, wearing this {item}, elegant pose, studio lighting, 4k, vogue style, fabric flowing naturally',
  'Accessories': 'Close-up product shot of this {item} on rotating platform, luxury studio lighting, 4k, slow motion, detailed texture',
  'Shoes': 'Model walking in this {item}, focus on footwear, runway floor reflection, 4k, dynamic camera movement',
  'Bags': 'Product showcase of this {item} on pedestal, luxury boutique lighting, 4k, 360 view, leather texture detail',
  'default': 'A professional model showcasing this {item}, clean studio background, 4k, commercial photography style'
};

// === ใหม่: กดปุ่ม Gen Prompt ใช้ Groq ===
genPromptBtn?.addEventListener('click', async () => {
  const filename = filenameInput.value.trim();
  if (!filename) {
    alert('ใส่ชื่อไฟล์ก่อนนะ จะได้รู้ว่าเป็นสินค้าอะไร');
    return;
  }

  const parts = filename.split('-');
  const category = parts[1] || 'default';
  const brand = parts[2] || 'item';

  let baseTemplate = promptTemplates[category] || promptTemplates['default'];
  baseTemplate = baseTemplate.replace('{item}', brand.toLowerCase());

  // UI loading
  genPromptBtn.disabled = true;
  const originalText = genPromptBtn.textContent;
  genPromptBtn.textContent = '🤖 Groq กำลังแต่ง...';
  promptInput.classList.add('ring-2', 'ring-purple-400');

  try {
    // เรียก Groq
    const res = await fetch('/api/ai/prompt/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_prompt: baseTemplate,
        category: category
      })
    });

    const data = await res.json();
    
    if (res.ok && data.enhanced_prompt) {
      promptInput.value = data.enhanced_prompt;
      genPromptBtn.textContent = '✅ AI แต่งเสร็จ!';
    } else {
      // fallback ใช้ template เดิม
      throw new Error(data.error || 'Groq failed');
    }

  } catch (err) {
    console.warn('Groq error, using template:', err.message);
    promptInput.value = baseTemplate;
    genPromptBtn.textContent = '⚠️ ใช้ template';
  } finally {
    setTimeout(() => {
      promptInput.classList.remove('ring-2', 'ring-purple-400');
      genPromptBtn.textContent = originalText;
      genPromptBtn.disabled = false;
    }, 1500);
  }
});

// ฟังก์ชันหลักเจนวิดีโอ (ยังใช้ของเดิมก่อน)
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
  statusText.textContent = engine === 'FAL' ? '🚀 กำลังส่งไป FAL...' : '🆓 กำลังส่งไป Hugging Face อาจนาน 3-10 นาที...';

  try {
    const fileExt = file.name.split('.').pop();
    const finalFilename = `${customFilename}.${fileExt}`;

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'x-filename': finalFilename,
        'Content-Type': file.type
      },
      body: file
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(err.error || 'Upload failed');
    }
    const { url: imageUrl } = await uploadRes.json();

    statusText.textContent = engine === 'FAL' ? '⚡️ FAL กำลังเจนคลิป 1-2 นาที...' : '⏳ HF กำลังเจน อาจนานถึง 10 นาที รอหน่อยนะ...';

    const apiUrl = engine === 'FAL' ? '/api/generate' : '/api/HuggingFace';
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
    document.body.appendChild(a);
    a.click();
    a.remove();

    saveFilename(customFilename);
    statusText.textContent = `✅ สำเร็จ! ใช้ ${data.engine || engine}`;

  } catch (err) {
    statusText.textContent = `❌ Error: ${err.message}`;
    if (err.message.includes('Model is loading') || err.message.includes('503')) {
      statusText.textContent += ' - โมเดลกำลังโหลด ลองกดใหม่ใน 20 วิ';
    }
    console.error(err);
  } finally {
    genFALBtn.disabled = false;
    genHFBtn.disabled = false;
    setTimeout(() => statusText.classList.add('hidden'), 8000);
  }
}

// ผูกปุ่ม
genFALBtn?.addEventListener('click', () => generateVideo('FAL'));
genHFBtn?.addEventListener('click', () => generateVideo('HF'));