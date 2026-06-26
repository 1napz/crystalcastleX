// i18n.js
const translations = {
    th: {
        "header_title": "@snapzreview — AI Studio",
        "btn_open_studio": "เปิด Studio",
        "btn_artifacts": "ผลงานของฉัน",
        "status_ready": "พร้อมใช้งาน",
        "upload_label": "อัปโหลดรูปภาพสินค้า",
        "step_1": "1. เตรียมรูปและตั้งชื่อไฟล์",
        "toast_success": "บันทึกสำเร็จ!"
    },
    en: {
        "header_title": "@snapzreview — AI Studio",
        "btn_open_studio": "Open Studio",
        "btn_artifacts": "My Artifacts",
        "status_ready": "System Ready",
        "upload_label": "Upload Product Images",
        "step_1": "1. Prepare and Name Files",
        "toast_success": "Saved Successfully!"
    }
};

// ฟังก์ชันสำหรับเปลี่ยนภาษา
function applyLanguage(lang) {
    const translation = translations[lang] || translations['en'];
    
    // ค้นหาทุก Element ที่มี attribute 'data-i18n'
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translation[key]) {
            el.textContent = translation[key];
        }
    });

    // บันทึกลง localStorage และเปลี่ยน lang ใน HTML tag
    localStorage.setItem('preferred_lang', lang);
    document.documentElement.lang = lang;
}

// เริ่มต้นระบบเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_lang') || 'th';
    applyLanguage(savedLang);
});
