// calculator.test.js
const { calculateTax } = require('../calculator');

describe('calculateTax', () => {
  // ✅ Normal case
  test('should calculate tax for positive income', () => {
    const result = calculateTax(10000);
    expect(result).toBeGreaterThan(0);
  });

  // ⚠️ Edge case: zero income
  test('should return 0 for zero income', () => {
    const result = calculateTax(0);
    expect(result).toBe(0);
  });

  // ⚠️ Edge case: negative income
  test('should throw error for negative income', () => {
    expect(() => calculateTax(-5000)).toThrow('Income must be non-negative');
  });

  // ✅ Boundary case
  test('should handle large income correctly', () => {
    const result = calculateTax(1_000_000);
    expect(result).toBeLessThanOrEqual(500_000); // sanity check
  });
});