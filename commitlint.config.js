// =============================================================
// ✅ Commitlint Config — ZyntroAI / crystalcastleX
// มาตรฐานข้อความ Commit — Conventional Commits + ส่วนเสริม
// =============================================================

module.exports = {
  extends: ["@commitlint/config-conventional"],

  // ── กฎหลัก ──────────────────────────────────────────────
  rules: {
    // ✅ ประเภทงาน — ครบถ้วน ชัดเจน
    "type-enum": [
      2,
      "always",
      [
        "feat",       // ฟีเจอร์ใหม่
        "fix",        // แก้ไขข้อผิดพลาด
        "refactor",   // ปรับปรุงโครงสร้างโค้ด ไม่เปลี่ยนพฤติกรรม
        "docs",       // เอกสารเท่านั้น
        "ui",         // การเปลี่ยนแปลงส่วนหน้า / สไตล์
        "style",      // จัดรูปแบบโค้ด (ไม่มีผลต่อการทำงาน)
        "ci",         // ระบบ CI/CD, Workflow
        "chore",      // งานดูแลระบบ, อัปเดต deps, build
        "test",       // เพิ่ม/แก้ไขทดสอบ
        "perf",       // ปรับปรุงประสิทธิภาพ
        "security",   // ปรับปรุงความปลอดภัย
        "revert"      // ย้อนกลับ commit ก่อนหน้า
      ]
    ],

    // ✅ รูปแบบ scope
    "scope-case": [2, "always", "lower-case"],

    // ✅ หัวข้อ — ไม่ขึ้นต้นด้วยตัวใหญ่, ไม่ลงท้ายด้วยจุด
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-full-stop": [2, "never", "."],
    "subject-exclamation-mark": [0], // ไม่บังคับ ไม่ห้าม

    // ✅ ความยาว
    "subject-max-length": [2, "always", 72],
    "header-max-length": [2, "always", 100],

    // ✅ ต้องมีเว้นวรรคหลัง colon — สำคัญ!
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "scope-empty": [0], // ไม่บังคับใส่ scope

    // ✅ เนื้อหา — ขึ้นบรรทัดใหม่ถ้ามี
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"]
  },

  // ── คำแนะนำเมื่อไม่ผ่าน ──────────────────────────────────
  helpMessage: `
❌ ข้อความ Commit ไม่ตรงรูปแบบ!
✅ ตัวอย่างที่ถูก:
  feat(auth): เพิ่มระบบเข้าสู่ระบบด้วย JWT
  fix(profile): แก้ไขปัญหาอัปโหลดรูปไม่เสร็จ
  docs: อัปเดตคู่มือการติดตั้ง

📌 รูปแบบ: <type>(<scope>): <ข้อความ>
📌 ประเภทที่ใช้ได้: feat, fix, refactor, docs, ui, style, ci, chore, test, perf, security, revert
📌 กฎ: ตัวเล็กทั้งหมด · ไม่ลงท้ายด้วยจุด · ยาวไม่เกิน 72 ตัวอักษร
  `
};
