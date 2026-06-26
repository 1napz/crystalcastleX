// tests/sync-env.test.js
// CrystalCastle Sync Environment Unit Test Example

// เก็บค่า env เดิมไว้
const originalEnv = { ...process.env };

beforeEach(() => {
  // reset environment ทุกครั้งก่อน test
  process.env = { ...originalEnv };
});

afterEach(() => {
  // cleanup mock/stub ทุกครั้ง
  jest.clearAllMocks();
});

describe('CrystalCastle Sync Environment Tests', () => {
  test('should return consistent env variable', () => {
    process.env.API_KEY = 'test-key';
    expect(process.env.API_KEY).toBe('test-key');
  });

  test('should handle async function consistently', async () => {
    const fetchData = async () => Promise.resolve({ ok: true });
    const result = await fetchData();
    expect(result.ok).toBe(true);
  });

  test('should mock external service consistently', async () => {
    const mockService = jest.fn().mockResolvedValue({ data: [1, 2, 3] });
    const result = await mockService();
    expect(result.data).toEqual([1, 2, 3]);
  });
});