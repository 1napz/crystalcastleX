/**
 * Tests for api/generate-videos.js
 *
 * The module is an ESM file that creates a Supabase client at import time
 * and exports a single default handler function. All external calls (fetch,
 * Supabase) are intercepted via vi.mock so no real network requests are made.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ─── Mock @supabase/supabase-js ──────────────────────────────────────────────
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockFrom })),
}));

// ─── Import the handler AFTER mocks are set up ───────────────────────────────
const { default: handler } = await import('../api/generate-videos.js');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeReq(overrides = {}) {
  return {
    method: 'POST',
    body: {
      image_url: 'https://example.com/image.jpg',
      prompt: 'make it dynamic',
      filename: 'test.mp4',
      engine: 'fal',
    },
    ...overrides,
  };
}

function makeRes() {
  const res = {
    _status: null,
    _body: null,
    status(code) {
      this._status = code;
      return this;
    },
    json(body) {
      this._body = body;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

// ─── fetch mock helpers ───────────────────────────────────────────────────────
function okFetch(body) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue(body),
  });
}

function failFetch(body = {}) {
  return vi.fn().mockResolvedValue({
    ok: false,
    json: vi.fn().mockResolvedValue(body),
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('generate-videos handler – HTTP method guard', () => {
  it('returns 405 for GET requests', async () => {
    const req = makeReq({ method: 'GET' });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
    expect(res._body).toEqual({ error: 'Method not allowed' });
  });

  it('returns 405 for PUT requests', async () => {
    const req = makeReq({ method: 'PUT' });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
  });
});

describe('generate-videos handler – input validation', () => {
  it('returns 400 when image_url is missing', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.example.com/v.mp4' });
    const req = makeReq({ body: { prompt: 'test', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._body.error).toMatch(/Missing required fields/);
  });

  it('returns 400 when prompt is missing', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.example.com/v.mp4' });
    const req = makeReq({ body: { image_url: 'https://example.com/i.jpg', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._body.error).toMatch(/Missing required fields/);
  });

  it('returns 400 when both image_url and prompt are missing', async () => {
    const req = makeReq({ body: { engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
  });
});

describe('generate-videos handler – FAL engine', () => {
  it('returns 200 with videoUrl when FAL returns video_url directly', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.fal.ai/result.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.success).toBe(true);
    expect(res._body.videoUrl).toBe('https://cdn.fal.ai/result.mp4');
    expect(res._body.engine).toBe('fal');
  });

  it('returns 200 with taskId when FAL returns task_id (polling path)', async () => {
    // First call: initial FAL request returns task_id
    // Second call: poll returns COMPLETED with video_url
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ task_id: 'task-123' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'COMPLETED', video_url: 'https://cdn.fal.ai/p.mp4' }),
      });

    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.fal.ai/p.mp4');
    expect(res._body.taskId).toBe('task-123');
  });

  it('returns 500 when FAL API returns non-ok status', async () => {
    global.fetch = failFetch({ detail: 'Unauthorized' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Unauthorized');
  });

  it('returns 500 when FAL response has neither video_url nor task_id', async () => {
    global.fetch = okFetch({ unexpected: 'data' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Unexpected FAL response');
  });

  it('returns 500 when FAL polling reports FAILED status', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ task_id: 'task-fail' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'FAILED' }),
      });

    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('FAL task failed');
  });
});

describe('generate-videos handler – Magic Hour engine', () => {
  it('returns 200 with videoUrl from Magic Hour', async () => {
    global.fetch = okFetch({ url: 'https://cdn.magic.ai/out.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'magic' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.magic.ai/out.mp4');
    expect(res._body.engine).toBe('magic');
  });

  it('returns 500 when Magic Hour API fails', async () => {
    global.fetch = failFetch();
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'magic' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Magic Hour API error');
  });
});

describe('generate-videos handler – Runway engine (fetch-based)', () => {
  it('returns 200 with videoUrl and taskId via Runway polling', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'rw-task-1' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'SUCCEEDED', output: { video: 'https://cdn.runway.ai/v.mp4' } }),
      });

    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'runway' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.runway.ai/v.mp4');
    expect(res._body.taskId).toBe('rw-task-1');
  });

  it('returns 500 when Runway response has no task id', async () => {
    global.fetch = okFetch({});
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'runway' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('No task id from Runway');
  });

  it('returns 500 when Runway API fails', async () => {
    global.fetch = failFetch();
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'runway' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Runway API error');
  });

  it('returns 500 when Runway polling task fails', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'rw-task-fail' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'FAILED' }),
      });

    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'runway' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Runway task failed');
  });
});

describe('generate-videos handler – Pika engine', () => {
  it('returns 200 with videoUrl from video_url field', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.pika.art/v.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'pika' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.pika.art/v.mp4');
  });

  it('returns 200 with videoUrl from url field (fallback)', async () => {
    global.fetch = okFetch({ url: 'https://cdn.pika.art/alt.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'pika' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.pika.art/alt.mp4');
  });

  it('returns 500 when Pika API fails', async () => {
    global.fetch = failFetch();
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'pika' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Pika API error');
  });
});

describe('generate-videos handler – NexaAPI engine', () => {
  it('returns 200 with videoUrl from NexaAPI', async () => {
    global.fetch = okFetch({ url: 'https://cdn.nexa.com/v.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'nexa' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.nexa.com/v.mp4');
  });

  it('returns 500 when NexaAPI fails', async () => {
    global.fetch = failFetch();
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'nexa' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('NexaAPI error');
  });
});

describe('generate-videos handler – WaveSpeed engine', () => {
  it('returns 200 with videoUrl from outputs[0]', async () => {
    global.fetch = okFetch({ outputs: ['https://cdn.wavespeed.ai/v.mp4'] });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'wavespeed' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.wavespeed.ai/v.mp4');
  });

  it('returns 200 with videoUrl from url field when outputs is empty', async () => {
    global.fetch = okFetch({ url: 'https://cdn.wavespeed.ai/fallback.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'wavespeed' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.wavespeed.ai/fallback.mp4');
  });

  it('returns 500 when WaveSpeed API fails', async () => {
    global.fetch = failFetch();
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'wavespeed' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('WaveSpeed API error');
  });
});

describe('generate-videos handler – unknown engine falls back to FAL', () => {
  it('defaults to FAL when engine is unrecognized', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.fal.ai/fallback.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'unknown_engine' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.fal.ai/fallback.mp4');
    expect(res._body.engine).toBe('unknown_engine');
  });

  it('defaults to FAL when engine is undefined', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.fal.ai/undef.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.videoUrl).toBe('https://cdn.fal.ai/undef.mp4');
  });
});

describe('generate-videos handler – Supabase logging', () => {
  it('logs to Supabase on success (non-blocking)', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.fal.ai/log-test.mp4' });
    const req = makeReq({
      body: {
        image_url: 'https://x.com/img.jpg',
        prompt: 'p',
        engine: 'fal',
        filename: 'log-test.mp4',
      },
    });
    const res = makeRes();
    await handler(req, res);
    expect(mockFrom).toHaveBeenCalledWith('video_logs');
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        engine: 'fal',
        prompt: 'p',
        image_url: 'https://x.com/img.jpg',
        video_url: 'https://cdn.fal.ai/log-test.mp4',
        filename: 'log-test.mp4',
      })
    );
  });

  it('still returns 200 even when Supabase logging fails', async () => {
    mockInsert.mockRejectedValueOnce(new Error('Supabase unreachable'));
    global.fetch = okFetch({ video_url: 'https://cdn.fal.ai/ok.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
  });
});

describe('generate-videos handler – response shape', () => {
  it('returns success, videoUrl, taskId (null), and engine in response body', async () => {
    global.fetch = okFetch({ video_url: 'https://cdn.fal.ai/shape.mp4' });
    const req = makeReq({ body: { image_url: 'https://x.com/img.jpg', prompt: 'p', engine: 'fal' } });
    const res = makeRes();
    await handler(req, res);
    expect(res._body).toMatchObject({
      success: true,
      videoUrl: 'https://cdn.fal.ai/shape.mp4',
      taskId: null,
      engine: 'fal',
    });
  });
});