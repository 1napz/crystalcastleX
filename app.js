import { CATEGORY_NAMES, HASHTAG_DB, PROMPT_TEMPLATES, HIGH_PERF_NEGATIVE } from './config.js';
import { uploadImageToStorage, generatePikaVideo, checkPikaStatus, getPikaCredits, fetchLogs } from './supabase-client.js';

let uploadedFiles = [];
let detectedProduct = { name: 'สินค้า', category: 'general' };
let generatedPrompts = [];
let selectedPromptIndex = 0;

// ฟังก์ชันทั้งหมดเหมือนเดิม แต่เรียกใช้ของจาก import แทน
//...วางโค้ดฟังก์ชันทั้งหมดจากไฟล์เก่ามาตรงนี้...
// แค่ลบ const พวก HASHTAG_DB, CATEGORY_NAMES ออก เพราะ import มาแล้ว

// ตัวอย่างฟังก์ชันที่แก้แล้ว
window.switchTab = function(tab) {
    ['image', 'video', 'tools', 'logs'].forEach(t => {
        document.getElementById(`tab-${t}`).className = tab === t? 'pb-3 tab-active whitespace-nowrap' : 'pb-3 tab-inactive whitespace-nowrap';
        document.getElementById(`content-${t}`).className = tab === t? '' : 'hidden';
    });
    if (tab === 'tools') updateToolsTab();
    if (tab === 'logs') loadLogs();
}

window.generateWithPika = async function() {
    if (generatedPrompts.length === 0) return alert('กด Generate Prompt ก่อน');
    if (uploadedFiles.length === 0) return alert('อัปรูปก่อน');
    const btn = document.getElementById('pikaApiBtn');
    const status = document.getElementById('pikaStatus');
    btn.disabled = true;
    status.classList.remove('hidden');
    status.innerText = 'กำลังอัปโหลดรูป...';
    try {
        const imageUrl = await uploadImageToStorage(uploadedFiles[0]);
        status.innerText = 'กำลังส่งให้ Pika สร้างวิดีโอ...';
        const data = await generatePikaVideo(generatedPrompts[selectedPromptIndex], imageUrl);
        document.getElementById('creditCount').innerText = data.credits;
        status.innerText = `กำลังสร้าง... Job ID: ${data.job_id}`;
        pollPikaStatus(data.job_id, btn, status);
    } catch (e) {
        status.innerText = 'ผิดพลาด: ' + e.message;
        btn.disabled = false;
    }
}

async function pollPikaStatus(jobId, btn, status) {
    const interval = setInterval(async () => {
        const data = await checkPikaStatus(jobId);
        if (data.status === 'completed') {
            clearInterval(interval);
            status.innerText = 'เสร็จแล้ว!';
            document.getElementById('pikaResult').classList.remove('hidden');
            document.getElementById('pikaVideo').src = data.video_url;
            document.getElementById('pikaDownload').href = data.video_url;
            btn.disabled = false;
            loadLogs();
        } else if (data.status === 'failed') {
            clearInterval(interval);
            status.innerText = 'Gen ไม่สำเร็จ: ' + data.error;
            btn.disabled = false;
        } else {
            status.innerText = `กำลังสร้าง... สถานะ: ${data.status}`;
        }
    }, 5000);
}

async function loadLogs() {
    const logs = await fetchLogs();
    document.getElementById('logList').innerHTML = logs.map(log => `
        <div class="bg-gray-900 p-3 rounded flex justify-between items-center">
            <div class="flex-1">
                <div class="truncate text-white">${log.prompt.substring(0, 50)}...</div>
                <div class="text-xs text-gray-500">${new Date(log.created_at).toLocaleString('th-TH')} | Credit เหลือ: ${log.credits_left}</div>
            </div>
            ${log.video_url? `<a href="${log.video_url}" target="_blank" class="text-xs bg-blue-600 px-2 py-1 rounded ml-2">ดูวิดีโอ</a>` : `<span class="text-xs text-yellow-500 ml-2">${log.status}</span>`}
        </div>
    `).join('');
}

// โหลด Credit ตอนเปิดเว็บ
window.onload = async () => {
    loadLogs();
    document.getElementById('creditCount').innerText = await getPikaCredits();
}

//...วางฟังก์ชันที่เหลือทั้งหมดต่อที่นี่...
// analyzeProduct, generateVideo, showResults, etc.
