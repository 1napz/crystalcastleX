/**
 * Tests for api/prompt.js
 *
 * The module creates Supabase and Groq clients at import time.
 * Both are fully mocked so no real network calls are made.
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';

// ─── Mock groq-sdk ────────────────────────────────────────────────────────────
const mockCreate = vi.fn();
vi.mock('groq-sdk', () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}));

// ─── Mock @supabase/supabase-js ───────────────────────────────────────────────
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: mockFrom })),
}));

// ─── Import handler after mocks ───────────────────────────────────────────────
const { default: handler } = await import('../api/prompt.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
  };
  return res;
}

function makeGroqResponse(content = 'Generated text', id = 'chatcmpl-abc123') {
  return {
    id,
    choices: [{ message: { content } }],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('prompt handler – HTTP method guard', () => {
  it('returns 405 for GET requests', async () => {
    const req = { method: 'GET', body: {} };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
    expect(res._body).toEqual({ error: 'Method not allowed' });
  });

  it('returns 405 for DELETE requests', async () => {
    const req = { method: 'DELETE', body: {} };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
  });
});

describe('prompt handler – input validation', () => {
  it('returns 400 when body has neither user_prompt nor prompt', async () => {
    const req = { method: 'POST', body: {} };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._body).toEqual({ error: 'Missing prompt' });
  });

  it('returns 400 when body is empty string prompt', async () => {
    const req = { method: 'POST', body: { prompt: '' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._body).toEqual({ error: 'Missing prompt' });
  });
});

describe('prompt handler – successful Groq completion', () => {
  beforeEach(() => {
    mockCreate.mockResolvedValue(makeGroqResponse('Here is your video prompt.'));
  });

  it('accepts user_prompt field and returns 200', async () => {
    const req = { method: 'POST', body: { user_prompt: 'Describe this image' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.result).toBe('Here is your video prompt.');
  });

  it('accepts prompt field and returns 200', async () => {
    const req = { method: 'POST', body: { prompt: 'Describe this image' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.result).toBe('Here is your video prompt.');
  });

  it('prefers user_prompt over prompt when both are provided', async () => {
    const req = { method: 'POST', body: { user_prompt: 'User version', prompt: 'Other version' } };
    const res = makeRes();
    await handler(req, res);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [{ role: 'user', content: 'User version' }],
      })
    );
  });

  it('returns result, latency, and model in response', async () => {
    const req = { method: 'POST', body: { prompt: 'test' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._body).toHaveProperty('result');
    expect(res._body).toHaveProperty('latency');
    expect(res._body).toHaveProperty('model');
    expect(res._body.model).toBe('groq/llama3-8b-8192');
  });

  it('returns latency as a non-negative number', async () => {
    const req = { method: 'POST', body: { prompt: 'test' } };
    const res = makeRes();
    await handler(req, res);
    expect(typeof res._body.latency).toBe('number');
    expect(res._body.latency).toBeGreaterThanOrEqual(0);
  });

  it('uses the correct Groq model', async () => {
    const req = { method: 'POST', body: { prompt: 'test' } };
    const res = makeRes();
    await handler(req, res);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'llama3-8b-8192' })
    );
  });

  it('sends the user prompt as a user role message', async () => {
    const req = { method: 'POST', body: { prompt: 'create a video' } };
    const res = makeRes();
    await handler(req, res);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [{ role: 'user', content: 'create a video' }],
      })
    );
  });

  it('handles empty Groq choice content gracefully (returns empty string)', async () => {
    mockCreate.mockResolvedValueOnce({ id: 'x', choices: [{ message: { content: null } }] });
    const req = { method: 'POST', body: { prompt: 'test' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body.result).toBe('');
  });
});

describe('prompt handler – Groq failure', () => {
  it('returns 500 when Groq throws an error', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const req = { method: 'POST', body: { prompt: 'test' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(500);
    expect(res._body.error).toBe('Groq failed: Rate limit exceeded');
  });

  it('returns 500 with error message from Groq exception', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Invalid API key'));
    const req = { method: 'POST', body: { prompt: 'test' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._body.error).toContain('Invalid API key');
  });
});

describe('prompt handler – Supabase logging', () => {
  beforeEach(() => {
    mockCreate.mockResolvedValue(makeGroqResponse('ok', 'req-id-999'));
  });

  it('logs to Supabase groq_logs on success', async () => {
    const req = { method: 'POST', body: { prompt: 'log me' } };
    const res = makeRes();
    await handler(req, res);
    expect(mockFrom).toHaveBeenCalledWith('groq_logs');
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        request_id: 'req-id-999',
        model: 'groq/llama3-8b-8192',
        prompt: 'log me',
        response: 'ok',
      })
    );
  });

  it('still returns 200 when Supabase logging throws', async () => {
    mockInsert.mockRejectedValueOnce(new Error('DB down'));
    const req = { method: 'POST', body: { prompt: 'test' } };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
  });

  it('includes latency_ms in the Supabase log payload', async () => {
    const req = { method: 'POST', body: { prompt: 'test latency' } };
    const res = makeRes();
    await handler(req, res);
    const insertArg = mockInsert.mock.calls[0][0];
    expect(insertArg).toHaveProperty('latency_ms');
    expect(typeof insertArg.latency_ms).toBe('number');
    expect(insertArg.latency_ms).toBeGreaterThanOrEqual(0);
  });
});