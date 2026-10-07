import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/test': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    // === พื้นฐาน ===
    environment: 'node',
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: false,

    // === ค้นหาไฟล์ทดสอบ ===
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next', 'out', 'coverage', 'e2e/**'],

    // === environment แยกตามไฟล์ (frontend ใช้ jsdom) ===
    environmentMatchGlobs: [
      ['src/**/*.{test,spec}.tsx', 'jsdom'],
      ['src/components/**', 'jsdom'],
    ],

    // === setup file (เรียกก่อนรันทุกไฟล์) ===
    setupFiles: ['./tests/setup.ts'],

    // === เวลา ===
    testTimeout: 10_000,
    hookTimeout: 15_000,
    teardownTimeout: 5_000,

    // === ความเร็ว ===
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: false },
    },
    isolate: true,
    fileParallelism: true,

    // === รายงานผล ===
    reporters: process.env.CI
      ? ['default', 'junit', 'json']
      : ['default'],
    outputFile: {
      junit: './test-results/junit.xml',
      json: './test-results/results.json',
    },

    // === Coverage (สำคัญที่สุดที่ขาด) ===
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov', 'json-summary'],
      reportOnFailure: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.{ts,tsx}',
        'src/types/**',
        'tests/**',
        '**/*.config.*',
      ],
      // บังคับคุณภาพ — ต่ำกว่านี้ CI fail
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
        perFile: false,
        autoUpdate: true,
      },
    },

    // === Snapshot ===
    snapshotFormat: {
      printBasicPrototype: false,
    },
    updateSnapshot: process.env.UPDATE_SNAPSHOT ? 'all' : 'new',

    // === ไม่เฝ้าดูไฟล์เหล่านี้ตอน watch ===
    watchIgnore: ['**/node_modules/**', '**/dist/**', '**/coverage/**', '**/.git/**'],
  },
});
