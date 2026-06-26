// src/services/api.test.js
import { jest } from '@jest/globals';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../mocks/mock-api', () => ({
  mockGenerateVideo:  jest.fn(),
  mockUploadImage:    jest.fn(),
  mockGeneratePrompt: jest.fn(),
  mockGeneratePost:   jest.fn(),
}));

// We control USE_MOCK_API per-describe block via jest.resetModules()
// so we can test BOTH real and mock branches.

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mockFetchOk(body) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(String(body)),
  });
}

function mockFetchFail({ jsonBody, textBody } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: jest.fn().mockResolvedValue(jsonBody ?? { message: 'server error' }),
    text: jest.fn().mockResolvedValue(textBody ?? 'server error'),
  });
}

// ─── Tests: REAL mode (USE_MOCK_API = false) ─────────────────────────────────

describe('video-service — REAL mode', () => {
  let service;

  beforeEach(async () => {
    jest.resetModules();
    jest.doMock('../config', () => ({
      USE_MOCK_API: false,
      API_BASE: 'http://localhost:3000',
    }));
    service = await import('./video-service');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── isMockMode ──────────────────────────────────────────────────────────────

  test('isMockMode() returns false', () => {
    expect(service.isMockMode()).toBe(false);
  });

  // ── getMockStatusMessage ────────────────────────────────────────────────────

  test('getMockStatusMessage() returns REAL MODE message', () => {
    const msg = service.getMockStatusMessage();
    expect(msg).toMatch(/REAL MODE/);
    expect(msg).not.toMatch(/MOCK MODE/);
  });

  // ── uploadImage ─────────────────────────────────────────────────────────────

  test('uploadImage — success', async () => {
    mockFetchOk({ url: 'https://cdn.example.com/img.jpg' });

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    const result = await service.uploadImage(file, 'photo.jpg');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/upload',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-filename': 'photo.jpg',
          'Content-Type': 'image/jpeg',
        }),
        body: file,
      })
    );
    expect(result).toEqual({ url: 'https://cdn.example.com/img.jpg' });
  });

  test('uploadImage — uses file.name when filename omitted', async () => {
    mockFetchOk({ url: 'https://cdn.example.com/img.jpg' });

    const file = new File(['data'], 'auto-name.jpg', { type: 'image/jpeg' });
    await service.uploadImage(file);

    const [, options] = fetch.mock.calls[0];
    expect(options.headers['x-filename']).toBe('auto-name.jpg');
  });

  test('uploadImage — throws on non-ok response', async () => {
    mockFetchFail({ textBody: 'File too large' });

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    await expect(service.uploadImage(file, 'photo.jpg')).rejects.toThrow(
      'อัปโหลดไม่สำเร็จ: File too large'
    );
  });

  // ── generateVideo ───────────────────────────────────────────────────────────

  test('generateVideo — success', async () => {
    mockFetchOk({ videoUrl: 'https://cdn.example.com/vid.mp4' });

    const result = await service.generateVideo(
      'https://img.example.com/img.jpg',
      'A rabbit dancing',
      'rabbit.jpg',
      'fal-ai'
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/generate-video',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          image_url: 'https://img.example.com/img.jpg',
          prompt: 'A rabbit dancing',
          filename: 'rabbit.jpg',
          engine: 'fal-ai',
        }),
      })
    );
    expect(result).toEqual({ videoUrl: 'https://cdn.example.com/vid.mp4' });
  });

  test('generateVideo — throws with server message on failure', async () => {
    mockFetchFail({ jsonBody: { message: 'Insufficient credits' } });

    await expect(
      service.generateVideo('url', 'prompt', 'file', 'engine')
    ).rejects.toThrow('Insufficient credits');
  });

  test('generateVideo — throws fallback message when error has no message', async () => {
    mockFetchFail({ jsonBody: {} }); // no .message field

    await expect(
      service.generateVideo('url', 'prompt', 'file', 'engine')
    ).rejects.toThrow('สร้างวิดีโอไม่สำเร็จ');
  });

  // ── generatePrompt ──────────────────────────────────────────────────────────

  test('generatePrompt — success', async () => {
    mockFetchOk({ prompt: 'A sleek bottle of perfume...' });

    const result = await service.generatePrompt('Rose Water', 'Skincare', 'Botanica');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/generate-prompt',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          productName: 'Rose Water',
          category: 'Skincare',
          brand: 'Botanica',
        }),
      })
    );
    expect(result).toEqual({ prompt: 'A sleek bottle of perfume...' });
  });

  test('generatePrompt — throws on non-ok response', async () => {
    mockFetchFail();

    await expect(
      service.generatePrompt('x', 'y', 'z')
    ).rejects.toThrow('สร้าง Prompt ไม่สำเร็จ');
  });

  // ── generatePost ────────────────────────────────────────────────────────────

  test('generatePost — success', async () => {
    mockFetchOk({ post: '✨ Introducing Rose Water...' });

    const result = await service.generatePost(
      'Rose Water', 'Skincare', 'Botanica', 'A sleek bottle...'
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/generate-post',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          productName: 'Rose Water',
          category: 'Skincare',
          brand: 'Botanica',
          prompt: 'A sleek bottle...',
        }),
      })
    );
    expect(result).toEqual({ post: '✨ Introducing Rose Water...' });
  });

  test('generatePost — throws on non-ok response', async () => {
    mockFetchFail();

    await expect(
      service.generatePost('x', 'y', 'z', 'p')
    ).rejects.toThrow('สร้างโพสต์ไม่สำเร็จ');
  });
});

// ─── Tests: MOCK mode (USE_MOCK_API = true) ───────────────────────────────────

describe('video-service — MOCK mode', () => {
  let service;
  let mocks;

  beforeEach(async () => {
    jest.resetModules();
    jest.doMock('../config', () => ({
      USE_MOCK_API: true,
      API_BASE: 'http://localhost:3000',
    }));
    service = await import('./video-service');
    mocks    = await import('../mocks/mock-api');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('isMockMode() returns true', () => {
    expect(service.isMockMode()).toBe(true);
  });

  test('getMockStatusMessage() returns MOCK MODE message', () => {
    const msg = service.getMockStatusMessage();
    expect(msg).toMatch(/MOCK MODE/);
    expect(msg).not.toMatch(/REAL MODE/);
  });

  test('uploadImage delegates to mockUploadImage', async () => {
    mocks.mockUploadImage.mockResolvedValue({ url: 'mock-url' });

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    const result = await service.uploadImage(file, 'photo.jpg');

    expect(mocks.mockUploadImage).toHaveBeenCalledWith(file, 'photo.jpg');
    expect(result).toEqual({ url: 'mock-url' });
  });

  test('generateVideo delegates to mockGenerateVideo', async () => {
    mocks.mockGenerateVideo.mockResolvedValue({ videoUrl: 'mock-video' });

    const result = await service.generateVideo('img', 'prompt', 'file', 'engine');

    expect(mocks.mockGenerateVideo).toHaveBeenCalledWith('img', 'prompt', 'file', 'engine');
    expect(result).toEqual({ videoUrl: 'mock-video' });
  });

  test('generatePrompt delegates to mockGeneratePrompt', async () => {
    mocks.mockGeneratePrompt.mockResolvedValue({ prompt: 'mock prompt' });

    const result = await service.generatePrompt('prod', 'cat', 'brand');

    expect(mocks.mockGeneratePrompt).toHaveBeenCalledWith('prod', 'cat', 'brand');
    expect(result).toEqual({ prompt: 'mock prompt' });
  });

  test('generatePost delegates to mockGeneratePost', async () => {
    mocks.mockGeneratePost.mockResolvedValue({ post: 'mock post' });

    const result = await service.generatePost('prod', 'cat', 'brand', 'promptText');

    expect(mocks.mockGeneratePost).toHaveBeenCalledWith('prod', 'cat', 'brand', 'promptText');
    expect(result).toEqual({ post: 'mock post' });
  });
});
