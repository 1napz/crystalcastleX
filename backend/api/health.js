const express = require('express');
const router = express.Router();

// สมมติว่านี่คือ Endpoint: POST /api/health
router.post('/health', (req, res) => {
    try {
        // 1. รับข้อมูลโครงสร้างสุขภาพจาก Request Body
        const { heartRate, hrv, stressScore, energyIndex, timestamp } = req.body;

        // 2. ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น (Validation)
        if (!heartRate || !stressScore) {
            return res.status(400).json({ 
                success: false, 
                message: "ข้อมูลไม่ครบถ้วน จำเป็นต้องมี heartRate และ stressScore" 
            });
        }

        // 3. จัดการโครงสร้างข้อมูลเตรียมนำไปใช้งาน
        const healthPayload = {
            heartRate: parseInt(heartRate),
            hrv: hrv ? parseInt(hrv) : null,
            stressScore: parseInt(stressScore),
            energyIndex: energyIndex ? parseInt(energyIndex) : null,
            recordedAt: timestamp || new Date().toISOString()
        };

        // [LOGIC]: นำข้อมูลไปเขียนลงฐานข้อมูล หรืออัปเดตไฟล์คอนเท็กซ์ของ AI 
        console.log("=== ได้รับข้อมูลสุขภาพใหม่ ===");
        console.log(healthPayload);

        // ตอบกลับสถานะสำเร็จไปยังตัวส่งข้อมูล
        return res.status(200).json({ 
            success: true, 
            message: "บันทึกข้อมูลสุขภาพเข้าระบบ Crystal Castle เรียบร้อยแล้ว" 
        });

    } catch (error) {
        console.error("Health API Error:", error);
        return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์" });
    }
});

module.exports = router;
