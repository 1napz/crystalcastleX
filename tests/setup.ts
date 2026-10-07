import { afterEach, beforeEach } from 'vitest';

// เรียกก่อน/หลังทุกเทสต์ทั่วทั้งระบบ
beforeEach(() => {
  // ตั้งค่าเริ่มต้น เช่น mock Date, fetch
  vi.useFakeTimers?.(); // ใช้เฉพาะถ้าต้องการ
});

afterEach(() => {
  vi.useRealTimers?.();
});

// ถ้าทดสอบ React:
// import '@testing-library/jest-dom/vitest';
