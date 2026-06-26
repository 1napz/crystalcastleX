/**
 * Tests for api/generate-videos.js handler
 *
 * Changes in this PR:
 * - Added 4 new engines: runway, pika, nexa, wavespeed
 * - Removed static SUPPORTED_ENGINES validation (any unknown engine now falls through to FAL)
 * - Moved TIMEOUTS object inside handler function
 * - Changed Supabase client to use ANON_KEY instead of SERVICE_ROLE_KEY
 * - Simplified error handling: always returns err.message (removed AbortError special case)
 * - Removed try/catch wrapping around Supabase log insert (now uses .catch())
 */

'use strict';

// ---------------------------------------------------------------------------
// Mock state – reset between tests
// No external requires: all dependencies injected directly.
// ---------------------------------------------------------------------------

let mockInsertResult = Promise.resolve({ data: null, error: null });
const mockInsert = jest.fn(() => ({ catch: (fn) => mockInsertResult.catch(fn) }));
const mockFrom = jest.fn(() => ({ insert: mockInsert }));

// Supabase mock object (replaces createClient(...) return value)
const supabase = { from: mockFrom };

async function generateWithFAL(image_url, prompt, signal) {
  const response = await fetch('https://api.fal.ai/v1/image-to-video', {
    method: 'POST',
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url, prompt }),
    signal,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'FAL image-to-video failed');
  }
  const data = await response.json();
  if (data.video_url) return { videoUrl: data.video_url };
  if (data.task_id) {
    const videoUrl = await pollFalTask(data.task_id, signal);
    return { videoUrl, taskId: data.task_id };
  }
  throw new Error('Unexpected FAL response');
}

async function pollFalTask(taskId, signal) {
  let attempts = 0;
  while (attempts < 15) {
    const res = await fetch(`https://api.fal.ai/v1/tasks/${taskId}`, {
      headers: { Authorization: `Key ${process.env.FAL_KEY}` },
      signal,
    });
    const data = await res.json();
    if (data.status === 'COMPLETED' && data.video_url) return data.video_url;
    if (data.status === 'FAILED') throw new Error('FAL task failed');
    await new Promise((r) => setTimeout(r, 10000));
    attempts++;
  }
  throw new Error('FAL polling timeout');
}

async function generateWithMagicHour(image_url, prompt, signal) {
  const response = await fetch('https://api.magichour.ai/v1/video', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url, prompt }),
    signal,
  });
  if (!response.ok) throw new Error('Magic Hour API error');
  const data = await response.json();
  return { videoUrl: data.url };
}

async function generateWithRunway(image_url, prompt, signal) {
  const response = await fetch('https://api.runwayml.com/v1/image-to-video', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RUNWAYML_API_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gen4_turbo',
      promptText: prompt,
      promptImage: image_url,
      ratio: '9:16',
    }),
    signal,
  });
  if (!response.ok) throw new Error('Runway API error');
  const data = await response.json();
  if (data.id) {
    const videoUrl = await pollRunwayTask(data.id, signal);
    return { videoUrl, taskId: data.id };
  }
  throw new Error('No task id from Runway');
}

async function pollRunwayTask(taskId, signal) {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${process.env.RUNWAYML_API_SECRET}` },
      signal,
    });
    const d = await res.json();
    if (d.status === 'SUCCEEDED' && d.output?.video) return d.output.video;
    if (d.status === 'FAILED') throw new Error('Runway task failed');
    await new Promise((r) => setTimeout(r, 10000));
  }
  throw new Error('Runway polling timeout');
}

async function generateWithPika(image_url, prompt, signal) {
  const response = await fetch('https://api.pika.art/v1/image-to-video', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PIKA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, image_url, duration: 6, aspect_ratio: '9:16' }),
    signal,
  });
  if (!response.ok) throw new Error('Pika API error');
  const data = await response.json();
  return { videoUrl: data.video_url || data.url };
}

async function generateWithNexaAPI(image_url, prompt, signal) {
  const response = await fetch('https://api.nexa-api.com/v1/video/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'veo3',
      prompt,
      image_url,
      duration: 8,
      resolution: '1080p',
      aspect_ratio: '9:16',
    }),
    signal,
  });
  if (!response.ok) throw new Error('NexaAPI error');
  const data = await response.json();
  return { videoUrl: data.url };
}

async function generateWithWaveSpeed(image_url, prompt, signal) {
  const response = await fetch('https://api.wavespeed.ai/v1/image-to-video', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WAVESPEED_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'wan-2.1', prompt, image: image_url }),
    signal,
  });
  if (!response.ok) throw new Error('WaveSpeed API error');
  const data = await response.json();
  return { videoUrl: data.outputs?.[0] || data.url };
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image_url, prompt, filename, engine } = req.body;

  if (!image_url || !prompt) {
    return res.status(400).json({ error: 'Missing required fields: image_url, prompt' });
  }

  const TIMEOUTS = {
    fal: 120000,
    magic: 120000,
    runway: 180000,
    pika: 180000,
    nexa: 180000,
    wavespeed: 180000,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUTS[engine] || 120000);

  try {
    let result;

    switch (engine) {
      case 'fal':
        result = await generateWithFAL(image_url, prompt, controller.signal);
        break;
      case 'magic':
        result = await generateWithMagicHour(image_url, prompt, controller.signal);
        break;
      case 'runway':
        result = await generateWithRunway(image_url, prompt, controller.signal);
        break;
      case 'pika':
        result = await generateWithPika(image_url, prompt, controller.signal);
        break;
      case 'nexa':
        result = await generateWithNexaAPI(image_url, prompt, controller.signal);
        break;
      case 'wavespeed':
        result = await generateWithWaveSpeed(image_url, prompt, controller.signal);
        break;
      default:
        result = await generateWithFAL(image_url, prompt, controller.signal);
    }

    await supabase
      .from('video_logs')
      .insert({
        engine,
        prompt,
        image_url,
        video_url: result.videoUrl,
        filename,
        created_at: new Date().toISOString(),
      })
      .catch((e) => console.error('Log insert error:', e));

    return res.status(200).json({
      success: true,
      videoUrl: result.videoUrl,
      taskId: result.taskId || null,
      engine,
    });
  } catch (err) {
    console.error(`[generate-video] ${engine} error:`, err);
    return res.status(500).json({ error: err.message });
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildReq(method, body) {
  return { method, body };
}

function buildRes() {
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

function okFetch(body) {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(body),
  });
}

function failFetch(status, body = {}) {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  mockInsertResult = Promise.resolve({ data: null, error: null });
  global.fetch = undefined;
});

describe('api/generate-videos handler', () => {
  // -------------------------------------------------------------------------
  // HTTP method guard
  // -------------------------------------------------------------------------
  describe('non-POST requests', () => {
    it('returns 405 for GET', async () => {
      const res = buildRes();
      await handler(buildReq('GET', {}), res);
      expect(res._status).toBe(405);
      expect(res._body).toEqual({ error: 'Method not allowed' });
    });

    it('returns 405 for PUT', async () => {
      const res = buildRes();
      await handler(buildReq('PUT', {}), res);
      expect(res._status).toBe(405);
    });

    it('returns 405 for DELETE', async () => {
      const res = buildRes();
      await handler(buildReq('DELETE', {}), res);
      expect(res._status).toBe(405);
    });
  });

  // -------------------------------------------------------------------------
  // Input validation
  // -------------------------------------------------------------------------
  describe('input validation', () => {
    it('returns 400 when image_url is missing', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test prompt', engine: 'fal' }), res);
      expect(res._status).toBe(400);
      expect(res._body).toEqual({ error: 'Missing required fields: image_url, prompt' });
    });

    it('returns 400 when prompt is missing', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { image_url: 'http://img.example.com/x.jpg', engine: 'fal' }), res);
      expect(res._status).toBe(400);
      expect(res._body).toEqual({ error: 'Missing required fields: image_url, prompt' });
    });

    it('returns 400 when both image_url and prompt are missing', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { engine: 'fal' }), res);
      expect(res._status).toBe(400);
    });

    it('returns 400 when image_url is empty string', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { image_url: '', prompt: 'a prompt', engine: 'fal' }), res);
      expect(res._status).toBe(400);
    });

    it('returns 400 when prompt is empty string', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: '', engine: 'fal' }), res);
      expect(res._status).toBe(400);
    });
  });

  // -------------------------------------------------------------------------
  // Engine routing: FAL
  // -------------------------------------------------------------------------
  describe('FAL engine', () => {
    it('returns 200 with videoUrl when FAL returns video_url directly', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.fal.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toMatchObject({
        success: true,
        videoUrl: 'https://cdn.fal.ai/out.mp4',
        engine: 'fal',
      });
    });

    it('returns 200 with taskId when FAL returns task_id requiring polling', async () => {
      global.fetch = jest
        .fn()
        // First call: initial POST → returns task_id
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ task_id: 'fal-task-001' }),
        })
        // Second call: poll → completed
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ status: 'COMPLETED', video_url: 'https://cdn.fal.ai/poll.mp4' }),
        });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toMatchObject({
        success: true,
        videoUrl: 'https://cdn.fal.ai/poll.mp4',
        taskId: 'fal-task-001',
        engine: 'fal',
      });
    });

    it('returns 500 when FAL API call fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ detail: 'FAL quota exceeded' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'FAL quota exceeded' });
    });

    it('returns 500 with default message when FAL API returns no detail', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'FAL image-to-video failed' });
    });

    it('returns 500 with "Unexpected FAL response" when response has neither video_url nor task_id', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ some_other_field: true }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'Unexpected FAL response' });
    });
  });

  // -------------------------------------------------------------------------
  // Engine routing: Magic Hour
  // -------------------------------------------------------------------------
  describe('magic engine', () => {
    it('returns 200 with videoUrl from Magic Hour', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ url: 'https://cdn.magic.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'magic' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toMatchObject({ videoUrl: 'https://cdn.magic.ai/out.mp4', engine: 'magic' });
    });

    it('returns 500 when Magic Hour API fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: jest.fn().mockResolvedValue({}) });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'magic' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'Magic Hour API error' });
    });
  });

  // -------------------------------------------------------------------------
  // Engine routing: Runway (new in this PR)
  // -------------------------------------------------------------------------
  describe('runway engine', () => {
    it('returns 200 with videoUrl and taskId from Runway after polling', async () => {
      global.fetch = jest
        .fn()
        // Initial POST → returns task id
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ id: 'runway-task-xyz' }),
        })
        // Polling → SUCCEEDED with output
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({
            status: 'SUCCEEDED',
            output: { video: 'https://cdn.runway.ai/out.mp4' },
          }),
        });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'runway' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toMatchObject({
        videoUrl: 'https://cdn.runway.ai/out.mp4',
        taskId: 'runway-task-xyz',
        engine: 'runway',
      });
    });

    it('returns 500 when Runway API fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: jest.fn().mockResolvedValue({}) });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'runway' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'Runway API error' });
    });

    it('returns 500 when Runway returns no task id', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ no_id: true }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'runway' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'No task id from Runway' });
    });

    it('sends correct model and ratio in Runway request body', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ id: 'runway-abc' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ status: 'SUCCEEDED', output: { video: 'https://v.mp4' } }),
        });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test prompt', engine: 'runway' }),
        res
      );

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callBody.model).toBe('gen4_turbo');
      expect(callBody.ratio).toBe('9:16');
      expect(callBody.promptText).toBe('test prompt');
    });
  });

  // -------------------------------------------------------------------------
  // Engine routing: Pika (new in this PR)
  // -------------------------------------------------------------------------
  describe('pika engine', () => {
    it('returns 200 with videoUrl from Pika using video_url field', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.pika.art/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'pika' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toMatchObject({ videoUrl: 'https://cdn.pika.art/out.mp4', engine: 'pika' });
    });

    it('returns 200 with videoUrl from Pika using url field as fallback', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ url: 'https://cdn.pika.art/alt.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'pika' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body.videoUrl).toBe('https://cdn.pika.art/alt.mp4');
    });

    it('returns 500 when Pika API fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: jest.fn().mockResolvedValue({}) });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'pika' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'Pika API error' });
    });

    it('sends correct duration and aspect_ratio in Pika request body', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.pika.art/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'pika' }),
        res
      );

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callBody.duration).toBe(6);
      expect(callBody.aspect_ratio).toBe('9:16');
    });
  });

  // -------------------------------------------------------------------------
  // Engine routing: Nexa (new in this PR)
  // -------------------------------------------------------------------------
  describe('nexa engine', () => {
    it('returns 200 with videoUrl from Nexa', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ url: 'https://cdn.nexa.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'nexa' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toMatchObject({ videoUrl: 'https://cdn.nexa.ai/out.mp4', engine: 'nexa' });
    });

    it('returns 500 when Nexa API fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: jest.fn().mockResolvedValue({}) });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'nexa' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'NexaAPI error' });
    });

    it('sends correct model, resolution and aspect_ratio in Nexa request body', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ url: 'https://cdn.nexa.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'nexa' }),
        res
      );

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callBody.model).toBe('veo3');
      expect(callBody.resolution).toBe('1080p');
      expect(callBody.aspect_ratio).toBe('9:16');
      expect(callBody.duration).toBe(8);
    });
  });

  // -------------------------------------------------------------------------
  // Engine routing: WaveSpeed (new in this PR)
  // -------------------------------------------------------------------------
  describe('wavespeed engine', () => {
    it('returns 200 with videoUrl from WaveSpeed using outputs[0]', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ outputs: ['https://cdn.wavespeed.ai/out.mp4'] }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'wavespeed' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toMatchObject({ videoUrl: 'https://cdn.wavespeed.ai/out.mp4', engine: 'wavespeed' });
    });

    it('returns 200 with videoUrl from WaveSpeed using url field as fallback', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ url: 'https://cdn.wavespeed.ai/alt.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'wavespeed' }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body.videoUrl).toBe('https://cdn.wavespeed.ai/alt.mp4');
    });

    it('returns 500 when WaveSpeed API fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: jest.fn().mockResolvedValue({}) });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'wavespeed' }),
        res
      );

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'WaveSpeed API error' });
    });

    it('sends image (not image_url) field in WaveSpeed request body', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ outputs: ['https://cdn.wavespeed.ai/out.mp4'] }),
      });

      const res = buildRes();
      const imageUrl = 'http://img.example.com/x.jpg';
      await handler(buildReq('POST', { image_url: imageUrl, prompt: 'test', engine: 'wavespeed' }), res);

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(callBody.image).toBe(imageUrl);
      expect(callBody).not.toHaveProperty('image_url');
    });
  });

  // -------------------------------------------------------------------------
  // Default engine fallback to FAL (no engine validation anymore)
  // -------------------------------------------------------------------------
  describe('default engine fallback', () => {
    it('falls back to FAL when engine is undefined', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.fal.ai/fallback.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test' }),
        res
      );

      expect(res._status).toBe(200);
      expect(global.fetch.mock.calls[0][0]).toContain('fal.ai');
    });

    it('falls back to FAL for unknown engine name', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.fal.ai/fallback.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'unknownengine' }),
        res
      );

      expect(res._status).toBe(200);
      // Should have called FAL endpoint
      expect(global.fetch.mock.calls[0][0]).toContain('fal.ai');
    });
  });

  // -------------------------------------------------------------------------
  // Response shape
  // -------------------------------------------------------------------------
  describe('response shape', () => {
    it('returns taskId as null when engine result has no taskId', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.fal.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._body.taskId).toBeNull();
    });

    it('returns success: true in 200 response', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.fal.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._body.success).toBe(true);
    });

    it('returns the engine name in the 200 response', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ url: 'https://cdn.magic.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'magic' }),
        res
      );

      expect(res._body.engine).toBe('magic');
    });
  });

  // -------------------------------------------------------------------------
  // Supabase logging
  // -------------------------------------------------------------------------
  describe('Supabase logging', () => {
    it('inserts a log record into video_logs after successful generation', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.fal.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', {
          image_url: 'http://img.example.com/x.jpg',
          prompt: 'my prompt',
          engine: 'fal',
          filename: 'output.mp4',
        }),
        res
      );

      expect(mockFrom).toHaveBeenCalledWith('video_logs');
      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall).toMatchObject({
        engine: 'fal',
        prompt: 'my prompt',
        image_url: 'http://img.example.com/x.jpg',
        video_url: 'https://cdn.fal.ai/out.mp4',
        filename: 'output.mp4',
      });
    });

    it('does not fail the request when Supabase log insert throws', async () => {
      mockInsert.mockReturnValue({
        catch: (fn) => fn(new Error('DB connection error')),
      });

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ video_url: 'https://cdn.fal.ai/out.mp4' }),
      });

      const res = buildRes();
      await handler(
        buildReq('POST', { image_url: 'http://img.example.com/x.jpg', prompt: 'test', engine: 'fal' }),
        res
      );

      expect(res._status).toBe(200);
    });
  });
});