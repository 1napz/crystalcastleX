// product.js - อัปเดตให้ใช้ API endpoints ใหม่ (/api/photo, /api/video, /api/prompt, /api/post)
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
const promptStatus = document.getElementById('promptStatus');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const undoPromptBtn = document.getElementById('undoPromptBtn');
const genPostBtn = document.getElementById('genPostBtn');
const postOutput = document.getElementById('postOutput');
const copyPostBtn = document.getElementById('copyPostBtn');

// ฟังก์ชันอัปเดตชื่อไฟล์อัตโนมัติ
function updateFilename(){
    const now = new Date();
    const yyyymmdd = now.getFullYear().toString() + 
                     String(now.getMonth() + 1).padStart(2, '0') + 
                     String(now.getDate()).padStart(2, '0');
    if(dateInput) dateInput.value = yyyymmdd;
    const category = categorySelect?.value || 'Product';
    const brand = brandInput?.value.trim().replace(/\s+/g, '') || 'Brand';
    filenameInput.value = `${yyyymmdd}-${category}-${brand}`;
}

document.addEventListener('DOMContentLoaded', updateFilename);
categorySelect?.addEventListener('change', updateFilename);
brandInput?.addEventListener('input', updateFilename);
setInterval(updateFilename, 60000);

// ฟังก์ชันตรวจสอบชื่อซ้ำ
function checkDuplicateName(name){
    const saved = JSON.parse(localStorage.getItem('filenames') || '[]');
    return saved.includes(name);
}

function saveFilename(name){
    const saved = JSON.parse(localStorage.getItem('filenames') || '[]');
    if(!saved.includes(name)){
        saved.push(name);
        localStorage.setItem('filenames', JSON.stringify(saved));
    }
}

// อัปโหลดรูปและแสดงตัวอย่าง
fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file || !imagePreview) return;
    if(!file.type.startsWith('image/')){
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

const promptTemplates = {
  'Menswear': 'Professional fashion video of {brand} menswear. Slow cinematic pan around male model, sharp focus on fabric texture and fit. Clean white studio background, soft natural lighting, slight fabric movement. 4K quality, premium commercial style.',
  
  'Womenswear': 'Elegant fashion video of {brand} womenswear. Female model walking gracefully, flowy fabric movement in slow motion. Soft dramatic lighting, warm tone, minimalist studio backdrop. Cinematic side tracking shot, luxury brand aesthetic.',
  
  'Accessories': 'Luxury product video of {brand} accessory. 360-degree slow rotation on smooth marble surface. Close-up macro shots highlighting details and craftsmanship. Premium studio lighting with soft reflections. High-end commercial.',
  
  'Shoes': 'Dynamic product showcase of {brand} shoes. Model walking on reflective runway surface. Focus on sole detail and material texture. Smooth tracking camera, dramatic shadows, cinematic lighting. 4K fashion video.',
  
  'Bags': 'Luxury handbag video of {brand} bag. Elegant hand interaction, slow orbit camera on clean pedestal. Rich leather texture close-up, soft studio lighting with highlights. Premium commercial quality.',
  
  'default': 'Professional product video of {brand}. Clean studio background, 360-degree slow rotation, sharp focus on product details. Soft even lighting, smooth motion, premium commercial quality. 4K resolution.'
};

let lastOriginalPrompt = '';

// สร้าง Prompt ด้วย AI (เรียก /api/prompt)
genPromptBtn?.addEventListener('click', async () => {
    const filename = filenameInput.value.trim();
    if(!filename){
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
        // เปลี่ยนเป็น /api/prompt
        const res = await fetch('/api/prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_prompt: baseTemplate, category })
        });
        const data = await res.json();
        if(res.ok && data.enhanced_prompt){
            promptInput.value = data.enhanced_prompt;
            promptStatus.textContent = '✅ AI แต่งเสร็จ';
            copyPromptBtn?.classList.remove('hidden');
            undoPromptBtn?.classList.remove('hidden');
            genPromptBtn.innerHTML = '✨ แต่งใหม่';
        } else {
            throw new Error(data.error || 'ไม่สามารถแต่ง Prompt ได้');
        }
    } catch(err) {
        console.error('Prompt error:', err);
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
    if(lastOriginalPrompt){
        promptInput.value = lastOriginalPrompt;
        promptStatus.textContent = '↶ กลับต้นฉบับ';
    }
});

// สร้างโพสต์ด้วย AI (เรียก /api/post)
genPostBtn?.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    const filename = filenameInput.value.trim();
    if(!prompt) return alert('เจน Prompt ก่อน');
    
    genPostBtn.disabled = true;
    genPostBtn.textContent = '✍️ กำลังเขียน...';
    postOutput.value = '';
    
    try {
        // เปลี่ยนเป็น /api/post
        const res = await fetch('/api/post', {
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
        if(data.post){
            postOutput.value = data.post;
            copyPostBtn.classList.remove('hidden');
            genPostBtn.textContent = '✅ เสร็จ';
        } else {
            throw new Error(data.error || 'สร้างโพสต์ไม่สำเร็จ');
        }
    } catch(err) {
        console.error('Post error:', err);
        postOutput.value = `ลุคใหม่ ${brandInput?.value || 'สินค้า'} พร้อมแล้ว ✨\n\n#CrystalCastle #${categorySelect?.value || 'แฟชั่น'}`;
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

// ฟังก์ชันหลักสร้างวิดีโอ (อัปโหลดรูป + สร้างวิดีโอ)
async function generateVideo(engine) {
    const file = fileInput.files[0];
    const customFilename = filenameInput.value.trim();
    const prompt = promptInput.value.trim();
    
    if(!file || !customFilename || !prompt){
        alert('อัพรูป ตั้งชื่อ และใส่ Prompt ให้ครบก่อน');
        return;
    }
    
    if(checkDuplicateName(customFilename)){
        if(!confirm(`ชื่อ ${customFilename} เคยใช้แล้ว จะเจนทับไหม?`)) return;
    }
    
    // Disable buttons
    genFALBtn.disabled = true;
    genHFBtn.disabled = true;
    statusText.classList.remove('hidden');
    statusText.textContent = engine === 'FAL' ? '🚀 กำลังส่งไป FAL...' : '🆓 กำลังส่งไป Magic Hour...';
    
    try {
        // ขั้นตอนที่ 1: อัปโหลดรูป (เรียก /api/photo แทน /api/upload)
        const fileExt = file.name.split('.').pop();
        const finalFilename = `${customFilename}.${fileExt}`;
        
        const uploadRes = await fetch('/api/photo', {
            method: 'POST',
            headers: {
                'x-filename': finalFilename,
                'Content-Type': file.type
            },
            body: file
        });
        
        if(!uploadRes.ok) {
            const errorData = await uploadRes.json().catch(() => ({}));
            throw new Error(errorData.error || 'อัปโหลดรูปไม่สำเร็จ');
        }
        
        const { url: imageUrl } = await uploadRes.json();
        
        // ขั้นตอนที่ 2: สร้างวิดีโอ (ใช้ /api/video แทน FAL, /api/magichour คงเดิม)
        statusText.textContent = engine === 'FAL' ? '⚡️ กำลังเจนวิดีโอ (FAL) 1-2 นาที...' : '⏳ กำลังเจนวิดีโอ (Magic Hour) 3-5 นาที...';
        
        const apiUrl = engine === 'FAL' ? '/api/video' : '/api/magichour';
        const genRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_url: imageUrl,
                prompt: prompt,
                filename: customFilename
            })
        });
        
        const data = await genRes.json();
        if(!genRes.ok) throw new Error(data.error || 'สร้างวิดีโอไม่สำเร็จ');
        if(!data.video_url) throw new Error('ไม่ได้รับลิงก์วิดีโอ');
        
        // สำเร็จ: แสดงผล
        statusText.innerHTML = `✅ สำเร็จ! <a href="${data.video_url}" target="_blank" class="underline text-blue-400">เปิดวิดีโอถาวร</a>`;
        
        const videoEl = document.createElement('video');
        videoEl.src = data.video_url;
        videoEl.controls = true;
        videoEl.autoplay = true;
        videoEl.loop = true;
        videoEl.className = 'w-full rounded-xl mt-3';
        
        // แทนที่รูปตัวอย่างด้วยวิดีโอ
        if(imagePreview.parentNode) {
            imagePreview.replaceWith(videoEl);
        }
        
        saveFilename(customFilename);
        statusText.textContent += ` บันทึกชื่อในเครื่องแล้ว`;
        
    } catch(err) {
        console.error('Generate error:', err);
        statusText.textContent = `❌ เกิดข้อผิดพลาด: ${err.message}`;
    } finally {
        genFALBtn.disabled = false;
        genHFBtn.disabled = false;
        setTimeout(() => {
            if(statusText.classList) statusText.classList.add('hidden');
        }, 15000);
    }
}

// ผูก Event ให้ปุ่ม
genFALBtn?.addEventListener('click', () => generateVideo('FAL'));
genHFBtn?.addEventListener('click', () => generateVideo('HF'));