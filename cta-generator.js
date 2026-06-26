// ========== GENERATE THUMBNAIL ==========
const thumbBtn = document.getElementById('genThumbnailBtn');

window.generateThumbnail = async function() {
    if (typeof selectedFiles === 'undefined' || selectedFiles.length === 0) {
        alert('❌ กรุณาอัปโหลดรูปสินค้าก่อน');
        return;
    }

    // 1. เลือกขนาด Thumbnail
    const sizeChoice = prompt(
        '📐 เลือกขนาด Thumbnail:\n' +
        '1 = สี่เหลี่ยมจัตุรัส (1:1) - เหมาะกับ TikTok/Shopee/IG Feed\n' +
        '2 = แนวนอน (16:9) - เหมาะกับ YouTube Thumbnail\n' +
        '3 = แนวตั้ง (9:16) - เหมาะกับ TikTok/IG Stories/Shorts\n\n' +
        'พิมพ์ 1, 2 หรือ 3 (ค่าเริ่มต้น 1)',
        '1'
    );
    
    let width, height;
    switch (sizeChoice) {
        case '2':
            width = 1920; height = 1080;
            break;
        case '3':
            width = 1080; height = 1920;
            break;
        default:
            width = 1080; height = 1080;
    }

    // 2. ดึงข้อมูลสินค้า (ถ้ามี)
    const productName = (typeof brandInput !== 'undefined' && brandInput) ? brandInput.value.trim() : 'สินค้า';
    const price = prompt('💰 กรอกราคาสินค้า (บาท)', '299') || '299';
    const discount = prompt('🔥 ส่วนลด (%) (ถ้ามี)', '');
    const discountPercent = discount ? parseInt(discount) : 0;
    const ctaText = prompt('📢 ข้อความ Call to Action (สั้นๆ)', '⚡ สินค้าจำกัด! ⚡') || '⚡ สินค้าจำกัด! ⚡';

    const statusDiv = document.getElementById('statusText');
    if (statusDiv) {
        statusDiv.classList.remove('hidden');
        statusDiv.innerHTML = '🎨 กำลังสร้าง Thumbnail...';
    }

    // 3. สร้าง Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // 4. โหลดรูปสินค้า
    const productImg = new Image();
    productImg.src = selectedFiles[0].url;
    await productImg.decode();

    // 5. วาดพื้นหลัง Gradient สีสัน
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#ff6b6b');
    grad.addColorStop(1, '#ff4757');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 6. วาดรูปสินค้า (ให้เต็มพื้นที่พอดี แต่อย่าเกิน)
    const maxW = width * 0.8;
    const maxH = height * 0.6;
    let imgW = productImg.width;
    let imgH = productImg.height;
    if (imgW > maxW) {
        imgH = (imgH * maxW) / imgW;
        imgW = maxW;
    }
    if (imgH > maxH) {
        imgW = (imgW * maxH) / imgH;
        imgH = maxH;
    }
    const imgX = (width - imgW) / 2;
    const imgY = (height - imgH) / 2 - 50;  // เลื่อนขึ้นเล็กน้อยให้มีที่วางข้อความ
    ctx.drawImage(productImg, imgX, imgY, imgW, imgH);

    // 7. Overlay ด้านล่าง (เฉพาะแนวตั้งและสี่เหลี่ยม)
    const overlayHeight = height * 0.25;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, height - overlayHeight, width, overlayHeight);

    // 8. โลโก้ Crystal Castle (บนซ้าย)
    ctx.font = 'bold 28px "Noto Sans Thai"';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText('🏰 Crystal Castle', 20, 60);

    // 9. ชื่อสินค้า (ซ้ายล่าง)
    ctx.font = 'bold 42px "Noto Sans Thai"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(productName.substring(0, 30), 30, height - 120);

    // 10. ราคา
    ctx.font = 'bold 52px "Noto Sans Thai"';
    ctx.fillStyle = '#f9ca24';
    ctx.fillText(`฿${price}`, 30, height - 60);

    // 11. ส่วนลด (ถ้ามี)
    if (discountPercent > 0) {
        ctx.font = 'bold 28px "Noto Sans Thai"';
        ctx.fillStyle = '#ff4757';
        ctx.fillText(`🔥 ลด ${discountPercent}% 🔥`, 30, height - 20);
    }

    // 12. CTA (ขวาล่าง)
    ctx.font = 'bold 36px "Noto Sans Thai"';
    ctx.fillStyle = '#ffeb3b';
    ctx.fillText(ctaText.substring(0, 20), width - 300, height - 70);

    // 13. ดาวน์โหลด PNG
    const link = document.createElement('a');
    link.download = `thumbnail-${productName.replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (statusDiv) {
        statusDiv.innerHTML = '✅ สร้าง Thumbnail สำเร็จ! (ไฟล์ดาวน์โหลดแล้ว)';
        setTimeout(() => statusDiv.classList.add('hidden'), 3000);
    }
};

// ผูก event ปุ่ม (ถ้ามี)
if (thumbBtn) {
    thumbBtn.addEventListener('click', () => window.generateThumbnail());
}