// product.js - ฉบับสมบูรณ์ (แก้ไขซ้ำซ้อน + เพิ่ม Slideshow)
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

// ========== AI PROMPT ==========
genPromptBtn?.addEventListener('click', async () => {
    const brand = brandInput?.value.trim() || 'สินค้า';
    const category = categorySelect?.value || 'default';
    let baseTemplate = promptTemplates[category] || promptTemplates['default'];
    baseTemplate = baseTemplate.replace('{brand}', brand);
    lastOriginalPrompt = baseTemplate;
    promptInput.value = baseTemplate;
    
    genPromptBtn.disabled = true;
    genPromptBtn.innerHTML = '⚙️ AI กำลังแต่ง...';
    if (promptStatus) promptStatus.innerHTML = 'กำลังเรียก AI...';
    
    try {
        const res = await fetch('/api/prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_prompt: baseTemplate, category })
        });
        const data = await res.json();
        if (res.ok && data.enhanced_prompt) {
            promptInput.value = data.enhanced_prompt;
            if (promptStatus) promptStatus.innerHTML = '✅ AI แต่งเสร็จ';
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
    }
});

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
genPostBtn?.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return alert('สร้าง Prompt ก่อน');
    
    genPostBtn.disabled = true;
    genPostBtn.innerHTML = '✍️ กำลังเขียน...';
    postOutput.value = '';
    
    const brand = brandInput?.value.trim() || 'สินค้า';
    const category = categorySelect?.value || 'default';
    
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
});

copyPostBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(postOutput.value);
    copyPostBtn.innerHTML = '✅ คัดลอกแล้ว';
    setTimeout(() => {
        copyPostBtn.innerHTML = '📋 คัดลอกแคปชั่น';
    }, 2000);
});

// ========== GENERATE VIDEO (AI) ==========
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
        
        const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'x-filename': finalFilename, 'Content-Type': file.type },
            body: file
        });
        
        if (!uploadRes.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ');
        const { url: imageUrl } = await uploadRes.json();
        
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

genFALBtn?.addEventListener('click', () => generateVideo('FAL'));
genHFBtn?.addEventListener('click', () => generateVideo('HF'));

// ========== SLIDESHOW GENERATOR (FREE, NO API) ==========
async function generateSlideshow() {
    if (selectedFiles.length === 0) {
        alert('กรุณาอัปโหลดรูปสินค้าก่อน');
        return;
    }
    
    if (genSlideshowBtn) genSlideshowBtn.disabled = true;
    if (generateBtn) generateBtn.disabled = true;
    if (statusText) {
        statusText.classList.remove('hidden');
        statusText.innerHTML = '🎬 กำลังสร้างสไลด์โชว์ กรุณารอสักครู่...';
    }
    
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 1080;
        const height = 1920; // 9:16 aspect ratio for TikTok
        canvas.width = width;
        canvas.height = height;
        
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks = [];
        
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };
        
        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(blob);
            
            if (statusText) {
                statusText.innerHTML = `✅ สร้างสไลด์โชว์สำเร็จ! <a href="${videoUrl}" target="_blank" class="underline text-blue-400">เปิดวิดีโอ</a> | <a href="${videoUrl}" download="slideshow.mp4" class="underline text-purple-400">ดาวน์โหลด</a>`;
            }
            
            const videoEl = document.createElement('video');
            videoEl.src = videoUrl;
            videoEl.controls = true;
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.className = 'w-full rounded-xl mt-3 col-span-3';
            
            if (previewGrid) {
                previewGrid.innerHTML = '';
                previewGrid.appendChild(videoEl);
            }
            
            if (genSlideshowBtn) genSlideshowBtn.disabled = false;
            if (generateBtn) generateBtn.disabled = false;
        };
        
        recorder.start();
        
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const displayTime = 2500; // 2.5 seconds per image
        
        for (let i = 0; i < selectedFiles.length; i++) {
            const img = new Image();
            img.src = URL.createObjectURL(selectedFiles[i].file);
            await img.decode();
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            
            const scale = Math.max(width / img.width, height / img.height);
            const x = (width - img.width * scale) / 2;
            const y = (height - img.height * scale) / 2;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            const brandText = brandInput?.value.trim() || 'สินค้า';
            const categoryText = categorySelect?.value || '';
            
            ctx.font = 'bold 56px "Noto Sans Thai"';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowBlur = 12;
            ctx.fillText(brandText, 50, height - 100);
            
            if (categoryText) {
                ctx.font = '42px "Noto Sans Thai"';
                ctx.fillStyle = '#f0f0f0';
                ctx.fillText(categoryText, 50, height - 40);
            }
            ctx.shadowBlur = 0;
            
            if (statusText) {
                statusText.innerHTML = `🎬 กำลังสร้าง... (รูปที่ ${i+1}/${selectedFiles.length})`;
            }
            
            await delay(displayTime);
            URL.revokeObjectURL(img.src);
        }
        
        recorder.stop();
        
    } catch (err) {
        console.error('Slideshow error:', err);
        if (statusText) statusText.textContent = `❌ เกิดข้อผิดพลาด: ${err.message}`;
        if (genSlideshowBtn) genSlideshowBtn.disabled = false;
        if (generateBtn) generateBtn.disabled = false;
    }
}

if (genSlideshowBtn) {
    genSlideshowBtn.addEventListener('click', generateSlideshow);
}

// ========== INITIAL RENDER ==========
renderPreview();
updateFilename();

// เพิ่ม event listener สำหรับ DOMContentLoaded (เผื่อกรณี)
document.addEventListener('DOMContentLoaded', () => {
    renderPreview();
    updateFilename();
});