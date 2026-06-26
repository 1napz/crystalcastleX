/**
 * Tests for api/runway.js
 *
 * The module instantiates a RunwayML SDK client at import time.
 * The SDK is fully mocked so no real API calls occur.
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';

// ─── Mock @runwayml/sdk ───────────────────────────────────────────────────────
const mockImageToVideoCreate = vi.fn();
vi.mock('@runwayml/sdk', () => ({
  default: vi.fn(() => ({
    imageToVideo: {
      create: mockImageToVideoCreate,
    },
  })),
}));

// ─── Import handler after mocks ───────────────────────────────────────────────
const { default: handler } = await import('../api/runway.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeReq(overrides = {}) {
  return {
    method: 'POST',
    body: {
      image_url: 'https://example.com/image.jpg',
      prompt: 'Make it cinematic',
    },
    ...overrides,
  };
}

function makeRes() {
  const res = {
    _status: null,
    _body: null,
    _ended: false,
    status(code) {
      this._status = code;
      return this;
    },
    json(body) {
      this._body = body;
      return this;
    },
    end() {
      this._ended = true;
      return this;
    },
  };
  return res;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('runway handler – HTTP method guard', () => {
  it('returns 405 and ends for GET requests', async () => {
    const req = makeReq({ method: 'GET' });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
    expect(res._ended).toBe(true);
  });

  it('returns 405 and ends for PATCH requests', async () => {
    const req = makeReq({ method: 'PATCH' });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
  });
});

describe('runway handler – successful video task creation', () => {
  beforeEach(() => {
    mockImageToVideoCreate.mockResolvedValue({ id: 'rw-task-abc' });
  });

  it('returns 200 with success true and taskId', async () => {
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body).toMatchObject({
      success: true,
      taskId: 'rw-task-abc',
    });
  });

  it('calls SDK with gen4_turbo model', async () => {
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(mockImageToVideoCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gen4_turbo' })
    );
  });

  it('passes promptImage from image_url', async () => {
    const req = makeReq({ body: { image_url: 'https://cdn.example.com/photo.jpg', prompt: 'p' } });
    const res = makeRes();
    await handler(req, res);
    expect(mockImageToVideoCreate).toHaveBeenCalledWith(
      expect.objectContaining({ promptImage: 'https://cdn.example.com/photo.jpg' })
    );
  });

  it('passes promptText from prompt', async () => {
    const req = makeReq({ body: { image_url: 'https://cdn.example.com/photo.jpg', prompt: 'Slow zoom in' } });
    const res = makeRes();
    await handler(req, res);
    expect(mockImageToVideoCreate).toHaveBeenCalledWith(
      expect.objectContaining({ promptText: 'Slow zoom in' })
    );
  });

  it('uses 9:16 ratio for vertical video', async () => {
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(mockImageToVideoCreate).toHaveBeenCalledWith(
      expect.objectContaining({ ratio: '9:16' })
    );
  });

  it('includes a message field in the response', async () => {
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._body).toHaveProperty('message');
    expect(typeof res._body.message).toBe('string');
    expect(res._body.message.length).toBeGreaterThan(0);
  });

  it('taskId in response matches the SDK result id', async () => {
    mockImageToVideoCreate.mockResolvedValueOnce({ id: 'unique-id-xyz' });
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._body.taskId).toBe('unique-id-xyz');
  });
});

describe('runway handler – error handling', () => {
  it('returns 500 with error message when SDK throws', async () => {
    mockImageToVideoCreate.mockRejectedValueOnce(new Error('Unauthorized: invalid API key'));
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body).toEqual({ error: 'Unauthorized: invalid API key' });
  });

  it('returns 500 when SDK throws with a specific error', async () => {
    mockImageToVideoCreate.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Rate limit exceeded');
  });

  it('returns 500 when SDK throws a generic error', async () => {
    mockImageToVideoCreate.mockRejectedValueOnce(new Error('Network error'));
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body).toHaveProperty('error');
  });
});

describe('runway handler – boundary cases', () => {
  it('handles undefined image_url in body (passes undefined to SDK)', async () => {
    mockImageToVideoCreate.mockResolvedValueOnce({ id: 'rw-no-img' });
    const req = makeReq({ body: { prompt: 'test' } });
    const res = makeRes();
    await handler(req, res);
    expect(mockImageToVideoCreate).toHaveBeenCalledWith(
      expect.objectContaining({ promptImage: undefined })
    );
    expect(res._status).toBe(200);
  });

  it('handles undefined prompt in body (passes undefined to SDK)', async () => {
    mockImageToVideoCreate.mockResolvedValueOnce({ id: 'rw-no-prompt' });
    const req = makeReq({ body: { image_url: 'https://example.com/img.jpg' } });
    const res = makeRes();
    await handler(req, res);
    expect(mockImageToVideoCreate).toHaveBeenCalledWith(
      expect.objectContaining({ promptText: undefined })
    );
    expect(res._status).toBe(200);
  });
});