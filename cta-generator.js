// cta-generator.js - แยกฟังก์ชัน Intro และ CTA
// เพิ่ม Popup แก้ไขชื่อสินค้า + Voice พูดชื่อสินค้า (เฉพาะ Intro)
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const introBtn = document.getElementById('genIntroBtn');
        const ctaBtn = document.getElementById('genCTABtn');

        if (!introBtn) console.warn('⚠️ ไม่พบปุ่ม genIntroBtn');
        if (!ctaBtn) console.warn('⚠️ ไม่พบปุ่ม genCTABtn');

        // ========== ฟังก์ชันสร้างวิดีโอ Intro (2.5 วินาที) ==========
        window.generateIntroVideo = async function() {
            if (typeof selectedFiles === 'undefined' || selectedFiles.length === 0) {
                alert('❌ กรุณาอัปโหลดรูปสินค้าก่อน');
                return;
            }

            // 1. ดึงชื่อสินค้าเริ่มต้นจากฟอร์ม (ถ้ามี)
            let productName = (typeof brandInput !== 'undefined' && brandInput) ? brandInput.value.trim() : 'สินค้า';
            
            // 2. Popup ให้แก้ไขชื่อสินค้า
            const inputName = prompt('📝 กรอกชื่อสินค้า (หรือกด OK เพื่อใช้ชื่อเดิม)', productName);
            if (inputName && inputName.trim()) productName = inputName.trim();
            
            // 3. ถามว่าให้มีเสียงพูดไหม (เสียงพูดจะออกทางลำโพง แต่ไม่ถูกบันทึกในไฟล์วิดีโอ)
            const withVoice = confirm('🎤 ต้องการให้มีเสียงพูดชื่อสินค้าไหม? (OK=มีเสียง, Cancel=ไม่มีเสียง)\n⚠️ เสียงจะไม่ถูกบันทึกลงในไฟล์วิดีโอ');

            const statusDiv = document.getElementById('statusText');
            const previewGridDiv = document.getElementById('previewGrid');
            const generateMainBtn = document.getElementById('generateBtn');
            const introBtnElem = document.getElementById('genIntroBtn');
            const ctaBtnElem = document.getElementById('genCTABtn');

            if (statusDiv) {
                statusDiv.classList.remove('hidden');
                statusDiv.innerHTML = '🎬 กำลังสร้าง Intro Video' + (withVoice ? ' พร้อมเสียงพูด...' : '...') + ' (2.5 วินาที)';
            }
            if (introBtnElem) introBtnElem.disabled = true;
            if (ctaBtnElem) ctaBtnElem.disabled = true;
            if (generateMainBtn) generateMainBtn.disabled = true;

            const durationMs = 2500;   // 2.5 วินาที
            const startTime = performance.now();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1080;
            canvas.height = 1920;      // อัตราส่วน 9:16 สำหรับ TikTok

            const stream = canvas.captureStream(30);  // 30 fps
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];

            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                const videoUrl = URL.createObjectURL(blob);
                if (statusDiv) {
                    statusDiv.innerHTML = `
                        ✅ สร้าง Intro สำเร็จ! 
                        <a href="${videoUrl}" target="_blank" class="underline text-blue-400">▶ เปิดดู</a> | 
                        <a href="${videoUrl}" download="intro-${Date.now()}.mp4" class="underline text-purple-400">💾 ดาวน์โหลด</a>
                        <br><span class="text-xs">🕒 ความยาว 2.5 วินาที</span>
                    `;
                }
                if (previewGridDiv) {
                    const videoEl = document.createElement('video');
                    videoEl.src = videoUrl;
                    videoEl.controls = true;
                    videoEl.autoplay = true;
                    videoEl.loop = true;
                    videoEl.className = 'w-full rounded-xl mt-3 col-span-3';
                    previewGridDiv.innerHTML = '';
                    previewGridDiv.appendChild(videoEl);
                }
                if (typeof saveFilename === 'function') saveFilename(`intro-${productName}-${Date.now()}`);
                if (introBtnElem) introBtnElem.disabled = false;
                if (ctaBtnElem) ctaBtnElem.disabled = false;
                if (generateMainBtn) generateMainBtn.disabled = false;
            };

            recorder.start();

            // โหลดรูปสินค้า
            const productImg = new Image();
            productImg.src = selectedFiles[0].url;
            await productImg.decode();

            // ---------- เริ่ม Voice (ถ้าต้องการ) ----------
            let utterance = null;
            if (withVoice) {
                utterance = new SpeechSynthesisUtterance(productName);
                utterance.lang = 'th-TH';       // ภาษาไทย
                utterance.rate = 0.9;           // ความเร็วพูด (0.9 = ช้ากว่าปกติเล็กน้อย)
                utterance.pitch = 1.0;
                // เลื่อนเสียงพูดเริ่มหลังจากกดปุ่ม 0.2 วินาที ให้ sync กับ animation
                setTimeout(() => {
                    window.speechSynthesis.speak(utterance);
                }, 200);
            }

            // ---------- ฟังก์ชันวาด Intro Frame ----------
            function drawIntroFrame(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / durationMs, 1);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#f8f9fa';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // โลโก้จาง ๆ มุมบนซ้าย
                ctx.font = 'bold 28px "Noto Sans Thai"';
                ctx.fillStyle = `rgba(0,0,0,0.4)`;
                ctx.fillText('Crystal Castle', 30, 70);

                // รูปสินค้า ซูม + หมุนเบา
                const scale = 0.55 + progress * 0.35;
                const rotate = progress * Math.PI * 0.08;
                const w = canvas.width * scale;
                const h = canvas.height * scale;
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(rotate);
                ctx.drawImage(productImg, -w / 2, -h / 2, w, h);
                ctx.restore();

                // ชื่อสินค้าเลื่อนขึ้นจากล่าง
                if (elapsed > 400) {
                    const slideProgress = Math.min((elapsed - 400) / 1600, 1);
                    const y = canvas.height - 150 * (1 - slideProgress);
                    ctx.font = 'bold 64px "Noto Sans Thai"';
                    ctx.fillStyle = '#000000';
                    ctx.fillText(productName, 60, y);
                }

                if (progress >= 1) {
                    recorder.stop();
                    // หยุดเสียงพูด (ถ้ายังพูดค้าง)
                    if (utterance && window.speechSynthesis.speaking) {
                        window.speechSynthesis.cancel();
                    }
                } else {
                    requestAnimationFrame(drawIntroFrame);
                }
            }

            requestAnimationFrame(drawIntroFrame);
        };

        // ========== ฟังก์ชันสร้างวิดีโอ CTA (5.5 วินาที) ==========
        window.generateCTAVideo = async function() {
            if (typeof selectedFiles === 'undefined' || selectedFiles.length === 0) {
                alert('❌ กรุณาอัปโหลดรูปสินค้าก่อน');
                return;
            }

            const productName = (typeof brandInput !== 'undefined' && brandInput) ? brandInput.value.trim() : 'สินค้า';
            const price = prompt('💰 กรอกราคาสินค้า (บาท)', '299');
            if (!price) return;
            const discount = prompt('🔥 ส่วนลด (%) (ถ้ามี, ไม่มีกดยกเลิก)', '');
            const discountPercent = discount ? parseInt(discount) : 0;
            const ctaText = prompt('📢 ข้อความ Call to Action', '⚡ สินค้าจำกัด! ⚡');

            const statusDiv = document.getElementById('statusText');
            const previewGridDiv = document.getElementById('previewGrid');
            const generateMainBtn = document.getElementById('generateBtn');
            const introBtnElem = document.getElementById('genIntroBtn');
            const ctaBtnElem = document.getElementById('genCTABtn');

            if (statusDiv) {
                statusDiv.classList.remove('hidden');
                statusDiv.innerHTML = '🎬 กำลังสร้าง CTA Video... (5.5 วินาที)';
            }
            if (introBtnElem) introBtnElem.disabled = true;
            if (ctaBtnElem) ctaBtnElem.disabled = true;
            if (generateMainBtn) generateMainBtn.disabled = true;

            const durationMs = 5500;
            const startTime = performance.now();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1080;
            canvas.height = 1920;

            const stream = canvas.captureStream(30);
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];

            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                const videoUrl = URL.createObjectURL(blob);
                if (statusDiv) {
                    statusDiv.innerHTML = `
                        ✅ สร้าง CTA สำเร็จ! 
                        <a href="${videoUrl}" target="_blank" class="underline text-blue-400">▶ เปิดดู</a> | 
                        <a href="${videoUrl}" download="cta-${Date.now()}.mp4" class="underline text-purple-400">💾 ดาวน์โหลด</a>
                        <br><span class="text-xs">🎯 ความยาว 5.5 วินาที</span>
                    `;
                }
                if (previewGridDiv) {
                    const videoEl = document.createElement('video');
                    videoEl.src = videoUrl;
                    videoEl.controls = true;
                    videoEl.autoplay = true;
                    videoEl.loop = true;
                    videoEl.className = 'w-full rounded-xl mt-3 col-span-3';
                    previewGridDiv.innerHTML = '';
                    previewGridDiv.appendChild(videoEl);
                }
                if (typeof saveFilename === 'function') saveFilename(`cta-${productName}-${Date.now()}`);
                if (introBtnElem) introBtnElem.disabled = false;
                if (ctaBtnElem) ctaBtnElem.disabled = false;
                if (generateMainBtn) generateMainBtn.disabled = false;
            };

            recorder.start();

            const productImg = new Image();
            productImg.src = selectedFiles[0].url;
            await productImg.decode();

            function drawCTAFrame(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / durationMs, 1);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#ff6b6b');
                grad.addColorStop(1, '#ff4757');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // รูปสินค้า sway + zoom
                const scale = 0.65 + progress * 0.3;
                const sway = Math.sin(elapsed / 100 * 1.5) * 5;
                const w = canvas.width * scale;
                const h = canvas.height * scale;
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(sway * Math.PI / 180);
                ctx.drawImage(productImg, -w / 2, -h / 2, w, h);
                ctx.restore();

                // Overlay ด้านล่าง
                const overlayGrad = ctx.createLinearGradient(0, canvas.height - 450, 0, canvas.height);
                overlayGrad.addColorStop(0, 'rgba(0,0,0,0)');
                overlayGrad.addColorStop(1, 'rgba(0,0,0,0.8)');
                ctx.fillStyle = overlayGrad;
                ctx.fillRect(0, canvas.height - 450, canvas.width, 450);

                ctx.font = 'bold 58px "Noto Sans Thai"';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(productName, 60, canvas.height - 250);

                const bounce = Math.sin(elapsed / 100 * 15) * 8;
                ctx.font = 'bold 94px "Noto Sans Thai"';
                ctx.fillStyle = '#f9ca24';
                ctx.fillText(`฿${price}`, 70, canvas.height - 120 + bounce);

                if (discountPercent > 0 && Math.sin(elapsed / 100 * 18) > 0) {
                    ctx.font = 'bold 48px "Noto Sans Thai"';
                    ctx.fillStyle = '#ff4757';
                    ctx.fillText(`🔥 ลด ${discountPercent}% 🔥`, 150, canvas.height - 50);
                }

                if (Math.sin(elapsed / 100 * 8) > 0 && elapsed > 1000) {
                    ctx.font = 'bold 58px "Noto Sans Thai"';
                    ctx.fillStyle = '#ffeb3b';
                    ctx.fillText(ctaText, 80, canvas.height - 320);
                }

                ctx.font = '42px "Noto Sans Thai"';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('👇 กดเลย 👇', canvas.width / 2 - 120, canvas.height - 190);

                if (progress >= 1) {
                    recorder.stop();
                } else {
                    requestAnimationFrame(drawCTAFrame);
                }
            }
            requestAnimationFrame(drawCTAFrame);
        };

        // ผูก event ให้ปุ่ม
        if (introBtn) introBtn.addEventListener('click', () => window.generateIntroVideo());
        if (ctaBtn) ctaBtn.addEventListener('click', () => window.generateCTAVideo());
    });
})();