module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // ฟีเจอร์ใหม่ → Added
      'fix',      // แก้บั๊ก → Fixed
      'docs',     // เอกสาร → Documentation
      'style',    // รูปแบบโค้ด (ไม่เปลี่ยน logic) → Changed
      'refactor', // ปรับปรุงโค้ด → Changed
      'perf',     // เพิ่มประสิทธิภาพ → Changed
      'test',     // เพิ่ม/แก้ไข test → Changed
      'chore',    // งานเบื้องหลัง (deps, config) → Changed
      'ci',       // CI/CD → Changed
      'build',    // build system → Changed
      'revert'    // revert commit → Changed
    ]],
    'subject-case': [0], // ไม่บังคับ case ของ subject (uppercase, lowercase)
    'scope-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100]
  }
};