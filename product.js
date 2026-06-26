// product.js - ฉบับปรับปรุง debounce + cache + reuse upload
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const previewGrid = document.getElementById('previewGrid');
const filenameInput = document.getElementById('filenameInput');
const promptInput = document.getElementById('promptInput');
const genPromptBtn = document.getElementById('genPromptBtn');
const genFALBtn = document.getElementById('genFALBtn');
const genHFBtn = document.getElementById('genHFBtn');
const genSlideshowBtn = document.getElementById('genSlideshowBtn');
const statusText = document.getElementById('statusText');
const categorySelect = document.getElementById('categorySelect');
const brandInput = document.getElementById('brandInput');
const dateInput = document.getElementById('dateInput');
const promptStatus = document.getElementById('promptStatus');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const undoPromptBtn = document.getElementById('undoPromptBtn');
const genPostBtn = document.getElementById('genPostBtn');
const postOutput = document.getElementById('postOutput');
const copyPostBtn = document.getElementById('copyPostBtn');
const generateBtn = document.getElementById('generateBtn');

let selectedFiles = [];

// ========== UTILITY FUNCTIONS ==========
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
    if(dateInput) dateInput.value = yyyymmdd;
    const category = categorySelect?.value || 'Product';
    const brand = brandInput?.value.trim().replace(/\s+/g, '') || 'Brand';
    const count = selectedFiles.length;
    filenameInput.value = `${yyyymmdd}-${category}-${brand}-${count}img`;
}

// ---------- Debounce ----------
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ---------- Cache sessionStorage ----------
function getCache(key) {
    return sessionStorage.getItem(key);
}
function setCache(key, value) {
    sessionStorage.setItem(key, value);
}

// ========== IMAGE UPLOAD & PREVIEW ==========
uploadBtn?.addEventListener('click', () => fileInput.click());

function renderPreview() {
    if (!previewGrid) return;
    previewGrid.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '28');
        svg.setAttribute('height', '28');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.5');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M4 16l4-4 4-4 4 4M12 12v-2M12 8v-2M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z');
        svg.appendChild(path);
        
        const span = document.createElement('span');
        span.className = 'text-[11px] mt-1';
        span.textContent = 'ยังไม่มีรูป';
        
        emptyDiv.appendChild(svg);
        emptyDiv.appendChild(span);
        previewGrid.appendChild(emptyDiv);
        updateFilename();
        return;
    }

    selectedFiles.forEach((fileObj, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'relative aspect-square bg-slate-100 rounded-xl overflow-hidden group';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(fileObj.file);
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

fileInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
        if (selectedFiles.length >= 10) return;
        if (!f.type.startsWith('image/')) {
            alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
            return;
        }
        const url = URL.createObjectURL(f);
        selectedFiles.push({ url, file: f });
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

let lastOriginalPrompt = '';

// ========== AI PROMPT (พร้อม cache) ==========
const handleGenPrompt = async () => {
    const brand = brandInput?.value.trim() || 'สินค้า';
    const category = categorySelect?.value || 'default';
    let baseTemplate = promptTemplates[category] || promptTemplates['default'];
    baseTemplate = baseTemplate.replace('{brand}', brand);
    lastOriginalPrompt = baseTemplate;
    promptInput.value = baseTemplate;
    
    // ตรวจสอบ cache
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
    if (promptStatus) promptStatus.innerHTML = 'กำลังเรียก AI...';
    promptInput.classList.add('ring-2', 'ring-purple-400');
    
    try {
        const res = await fetch('/api/prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_prompt: baseTemplate, category })
        });
        const data = await res.json();
        if (res.ok && data.enhanced_prompt) {
            promptInput.value = data.enhanced_prompt;
            setCache(cacheKey, data.enhanced_prompt);
            if (promptStatus) promptStatus.innerHTML = '✅ AI แต่งเสร็จ (cached)';
            if (copyPromptBtn) copyPromptBtn.classList.remove('hidden');
            if (undoPromptBtn) undoPromptBtn.classList.remove('hidden');
            genPromptBtn.innerHTML = '✨ แต่งใหม่';
        } else {
            throw new Error(data.error || 'ไม่สามารถแต่ง Prompt ได้');
        }
    } catch(err) {
        console.error('Prompt error:', err);
        promptInput.value = baseTemplate;
        if (promptStatus) promptStatus.innerHTML = '⚠️ ใช้ต้นฉบับ (AI ไม่พร้อม)';
        genPromptBtn.innerHTML = '✨ ลองใหม่';
    } finally {
        genPromptBtn.disabled = false;
        setTimeout(() => promptInput.classList.remove('ring-2', 'ring-purple-400'), 1000);
    }
};

genPromptBtn?.addEventListener('click', debounce(handleGenPrompt, 500));

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

// ========== AI CAPTION (พร้อม cache) ==========
const handleGenPost = async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return alert('สร้าง Prompt ก่อน');
    
    const brand = brandInput?.value.trim() || 'สินค้า';
    const category = categorySelect?.value || 'default';
    
    const cacheKey = `post_${brand}_${category}_${prompt.substring(0, 50)}`;
    const cached = getCache(cacheKey);
    if (cached) {
        postOutput.value = cached;
        if (copyPostBtn) copyPostBtn.classList.remove('hidden');
        genPostBtn.innerHTML = '✅ เสร็จ (cache)';
        if (promptStatus) promptStatus.innerHTML = '📦 แคปชั่นจาก cache';
        return;
    }
    
    genPostBtn.disabled = true;
    genPostBtn.innerHTML = '✍️ กำลังเขียน...';
    postOutput.value = '';
    
    const fallbackPost = `✨ ${brand} สวยโดนใจ! พร้อมส่งจาก Crystal Castle\n\n#CrystalCastle #แฟชั่น #AIvideo`;
    
    try {
        const res = await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, brand, category })
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
    } catch(err) {
        postOutput.value = fallbackPost;
        genPostBtn.innerHTML = '⚠️ แบบสำเร็จรูป';
        if (copyPostBtn) copyPostBtn.classList.remove('hidden');
    } finally {
        setTimeout(() => {
            genPostBtn.disabled = false;
            genPostBtn.innerHTML = '📝 Generate Post';
        }, 1500);
    }
};

genPostBtn?.addEventListener('click', debounce(handleGenPost, 500));

copyPostBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(postOutput.value);
    copyPostBtn.innerHTML = '✅ คัดลอกแล้ว';
    setTimeout(() => {
        copyPostBtn.innerHTML = '📋 คัดลอกแคปชั่น';
    }, 2000);
});

// ========== GENERATE VIDEO (AI) พร้อม reuse upload ==========
let lastUploadedFile = null;
let lastUploadedUrl = null;

async function generateVideo(engine) {
    if (selectedFiles.length === 0) {
        alert('กรุณาอัปโหลดรูปสินค้าก่อน');
        return;
    }
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('กรุณาใส่ Prompt หรือให้ AI ช่วยคิดก่อน');
        return;
    }
    
    const customFilename = filenameInput?.value.trim() || `video-${Date.now()}`;
    
    if (checkDuplicateName(customFilename)) {
        if (!confirm(`ชื่อ ${customFilename} เคยใช้แล้ว จะสร้างทับไหม?`)) return;
    }
    
    if (genFALBtn) genFALBtn.disabled = true;
    if (genHFBtn) genHFBtn.disabled = true;
    if (generateBtn) generateBtn.disabled = true;
    if (statusText) {
        statusText.classList.remove('hidden');
        statusText.innerHTML = engine === 'FAL' ? '🚀 กำลังอัปโหลดรูป...' : '🆓 กำลังอัปโหลดรูป...';
    }
    
    try {
        const file = selectedFiles[0].file;
        const fileExt = file.name.split('.').pop();
        const finalFilename = `${customFilename}.${fileExt}`;
        
        let imageUrl;
        // reuse ถ้ารูปไฟล์เดิม
        if (lastUploadedFile === file && lastUploadedUrl) {
            imageUrl = lastUploadedUrl;
            if (statusText) statusText.innerHTML = '📦 ใช้รูปที่อัปโหลดแล้ว (cache)';
        } else {
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'x-filename': finalFilename, 'Content-Type': file.type },
                body: file
            });
            if (!uploadRes.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
            const data = await uploadRes.json();
            imageUrl = data.url;
            lastUploadedFile = file;
            lastUploadedUrl = imageUrl;
        }
        
        if (statusText) {
            statusText.innerHTML = engine === 'FAL' ? '⚡️ กำลังสร้างวิดีโอ (FAL) ประมาณ 1-2 นาที...' : '⏳ กำลังสร้างวิดีโอ (Magic Hour) ประมาณ 3-5 นาที...';
        }
        
        const apiUrl = engine === 'FAL' ? '/api/video' : '/api/magichour';
        const genRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: imageUrl, prompt, filename: customFilename })
        });
        
        const data = await genRes.json();
        if (!genRes.ok) throw new Error(data.error || 'สร้างวิดีโอไม่สำเร็จ');
        if (!data.video_url) throw new Error('ไม่ได้รับลิงก์วิดีโอ');
        
        if (statusText) {
            statusText.innerHTML = `✅ สำเร็จ! <a href="${data.video_url}" target="_blank" class="underline text-blue-400">เปิดวิดีโอ</a> | <a href="/artifact.html" class="underline text-purple-400">ดูผลงาน</a>`;
        }
        
        saveFilename(customFilename);
        
    } catch(err) {
        console.error('Generate error:', err);
        if (statusText) statusText.innerHTML = `❌ เกิดข้อผิดพลาด: ${err.message}`;
    } finally {
        if (genFALBtn) genFALBtn.disabled = false;
        if (genHFBtn) genHFBtn.disabled = false;
        if (generateBtn) generateBtn.disabled = false;
        setTimeout(() => {
            if (statusText) statusText.classList.add('hidden');
        }, 10000);
    }
}

genFALBtn?.addEventListener('click', debounce(() => generateVideo('FAL'), 1000));
genHFBtn?.addEventListener('click', debounce(() => generateVideo('HF'), 1000));

// ========== SLIDESHOW GENERATOR (FREE, NO API) ==========
async function generateSlideshow() {
    // ... (คงเดิม ไม่มีการเรียก API)
}
// ... (ส่วนที่เหลือของ generateSlideshow และอื่นๆ เหมือนเดิม)

// ผูก event slideshow (ไม่ต้อง debounce เพราะไม่มี API)
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