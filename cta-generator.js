const drawFrame = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ---------- 1. พื้นหลัง Gradient แบบ TikTok ----------
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#ff6b6b');
    grad.addColorStop(0.7, '#ee5a24');
    grad.addColorStop(1, '#ff4757');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ---------- 2. รูปสินค้า (Zoom In) ----------
    const scale = 0.65 + progress * 0.3;
    const imgW = canvas.width * scale;
    const imgH = canvas.height * scale;
    ctx.drawImage(productImg, (canvas.width - imgW) / 2, (canvas.height - imgH) / 2, imgW, imgH);

    // ---------- 3. Overlay สีดำ渐变 ด้านล่าง (Safe zone) ----------
    const overlayGrad = ctx.createLinearGradient(0, canvas.height - 500, 0, canvas.height);
    overlayGrad.addColorStop(0, 'rgba(0,0,0,0)');
    overlayGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, canvas.height - 550, canvas.width, 550);

    // ---------- 4. ชื่อสินค้า (Slide from top) จบที่ Y = 220 ----------
    const titleY = Math.min(150 + elapsed * 80, 220);
    ctx.font = 'bold 58px "Noto Sans Thai"';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    // ตัดข้อความยาวเกิน 25 ตัว
    const displayProduct = productName.length > 25 ? productName.slice(0, 22) + '...' : productName;
    ctx.fillText(displayProduct, 60, titleY);

    // ---------- 5. ราคา (Bounce Effect) กลางจอ ----------
    const bounce = Math.sin(elapsed * 14) * 8;
    ctx.font = 'bold 94px "Noto Sans Thai"';
    ctx.fillStyle = '#F9CA24';
    ctx.fillText(`฿${price}`, 70, 820 + bounce);

    // ---------- 6. ส่วนลด (Blink) ใต้ราคา ----------
    if (discountPercent > 0 && Math.sin(elapsed * 18) > 0) {
        ctx.font = 'bold 48px "Noto Sans Thai"';
        ctx.fillStyle = '#FF4757';
        ctx.fillText(`🔥 ลด ${discountPercent}% 🔥`, 150, 980);
    }

    // ---------- 7. CTA คำกระตุ้น (Blink, ขนาดใหญ่) กลางจอตอนท้าย ----------
    const ctaBlink = Math.sin(elapsed * 8) > 0;
    if (ctaBlink && elapsed > 2.5) {  // เริ่มกระพริบหลังจาก 2.5 วินาที
        ctx.font = 'bold 58px "Noto Sans Thai"';
        ctx.fillStyle = '#FFEB3B';
        ctx.shadowBlur = 15;
        ctx.fillText(ctaText, 100, 1440);
    }

    // ---------- 8. "👇 กดเลย 👇" ใต้ CTA ----------
    ctx.font = 'bold 42px "Noto Sans Thai"';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 8;
    ctx.fillText('👇 กดเลย 👇', canvas.width / 2 - 120, 1620);

    // ---------- 9. โลโก้/เครดิตท้ายคลิป ----------
    ctx.font = '28px "Noto Sans Thai"';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Canvas CTA Studio', 50, canvas.height - 55);

    // เงื่อนไขจบการทำงาน
    if (progress < 1) {
        requestAnimationFrame(drawFrame);
    } else {
        recorder.stop();
    }
};