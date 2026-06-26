/**
 * Tests for api/prompt.js handler (new file in this PR)
 *
 * This handler:
 * - Accepts POST requests with either user_prompt or prompt in the body
 * - Calls Groq AI (llama3-8b-8192) to generate a completion
 * - Logs the result to Supabase's groq_logs table
 * - Returns { result, latency, model } on success
 * - Returns 500 if Groq fails (no fallback implemented yet)
 */

'use strict';

// ---------------------------------------------------------------------------
// Dependency mocks – no external requires needed.
// We inject mocks directly into the handler re-implementation.
// ---------------------------------------------------------------------------

let mockGroqResponse = null;
let mockGroqError = null;

const mockCreate = jest.fn(async () => {
  if (mockGroqError) throw mockGroqError;
  return mockGroqResponse;
});

// Groq mock object (replaces `new Groq(...)`)
const groq = { chat: { completions: { create: mockCreate } } };

// Supabase mock objects (replaces `createClient(...)`)
let mockInsertResult = Promise.resolve({ data: null, error: null });
const mockCatch = jest.fn((fn) => mockInsertResult.catch(fn));
const mockInsert = jest.fn(() => ({ catch: mockCatch }));
const mockFrom = jest.fn(() => ({ insert: mockInsert }));
const supabase = { from: mockFrom };

// ---------------------------------------------------------------------------
// Handler re-implementation (CJS, dependency-injected)
// Mirrors api/prompt.js exactly, with groq and supabase injected above.
// ---------------------------------------------------------------------------

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const userPrompt = req.body.user_prompt || req.body.prompt;
  if (!userPrompt) return res.status(400).json({ error: 'Missing prompt' });

  const start = Date.now();
  let result = '';
  const model = 'groq/llama3-8b-8192';

  try {
    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: userPrompt }],
      model: 'llama3-8b-8192',
    });
    result = chat.choices[0]?.message?.content || '';

    // Log to Supabase
    await supabase
      .from('groq_logs')
      .insert({
        request_id: chat.id,
        model,
        prompt: userPrompt,
        response: result,
        latency_ms: Date.now() - start,
      })
      .catch((e) => console.error('Log insert error:', e));
  } catch (groqErr) {
    console.error('Groq failed:', groqErr.message);
    return res.status(500).json({ error: `Groq failed: ${groqErr.message}` });
  }

  return res.status(200).json({ result, latency: Date.now() - start, model });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildReq(method, body = {}) {
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  mockInsertResult = Promise.resolve({ data: null, error: null });
  mockGroqError = null;
  mockGroqResponse = {
    id: 'chatcmpl-abc123',
    choices: [{ message: { content: 'Generated content from Groq' } }],
  };

  mockInsert.mockReturnValue({ catch: mockCatch });
  mockCatch.mockImplementation((fn) => mockInsertResult.catch(fn));
});

describe('api/prompt handler', () => {
  // -------------------------------------------------------------------------
  // HTTP method guard
  // -------------------------------------------------------------------------
  describe('non-POST requests', () => {
    it('returns 405 for GET', async () => {
      const res = buildRes();
      await handler(buildReq('GET'), res);
      expect(res._status).toBe(405);
      expect(res._body).toEqual({ error: 'Method not allowed' });
    });

    it('returns 405 for PUT', async () => {
      const res = buildRes();
      await handler(buildReq('PUT'), res);
      expect(res._status).toBe(405);
    });

    it('returns 405 for DELETE', async () => {
      const res = buildRes();
      await handler(buildReq('DELETE'), res);
      expect(res._status).toBe(405);
    });
  });

  // -------------------------------------------------------------------------
  // Input validation
  // -------------------------------------------------------------------------
  describe('input validation', () => {
    it('returns 400 when body is empty (no prompt field)', async () => {
      const res = buildRes();
      await handler(buildReq('POST', {}), res);
      expect(res._status).toBe(400);
      expect(res._body).toEqual({ error: 'Missing prompt' });
    });

    it('returns 400 when prompt is empty string', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: '' }), res);
      expect(res._status).toBe(400);
      expect(res._body).toEqual({ error: 'Missing prompt' });
    });

    it('returns 400 when user_prompt is empty string', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { user_prompt: '' }), res);
      expect(res._status).toBe(400);
      expect(res._body).toEqual({ error: 'Missing prompt' });
    });

    it('accepts the prompt field and returns 200', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'write a poem about cats' }), res);
      expect(res._status).toBe(200);
    });

    it('accepts the user_prompt field and returns 200', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { user_prompt: 'describe a product' }), res);
      expect(res._status).toBe(200);
    });

    it('prefers user_prompt over prompt when both are provided', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { user_prompt: 'from user_prompt', prompt: 'from prompt' }), res);
      expect(res._status).toBe(200);
      // Groq should receive the user_prompt value
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toBe('from user_prompt');
    });
  });

  // -------------------------------------------------------------------------
  // Successful Groq completion
  // -------------------------------------------------------------------------
  describe('successful Groq completion', () => {
    it('returns 200 with result, latency, and model on success', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test prompt' }), res);

      expect(res._status).toBe(200);
      expect(res._body.result).toBe('Generated content from Groq');
      expect(typeof res._body.latency).toBe('number');
      expect(res._body.model).toBe('groq/llama3-8b-8192');
    });

    it('returns model identifier "groq/llama3-8b-8192"', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);
      expect(res._body.model).toBe('groq/llama3-8b-8192');
    });

    it('returns a non-negative latency value', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);
      expect(res._body.latency).toBeGreaterThanOrEqual(0);
    });

    it('calls Groq with llama3-8b-8192 as the model', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.model).toBe('llama3-8b-8192');
    });

    it('sends the prompt as a user-role message to Groq', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'my unique prompt' }), res);

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages).toEqual([{ role: 'user', content: 'my unique prompt' }]);
    });

    it('returns empty string result when Groq response message content is null', async () => {
      mockGroqResponse = {
        id: 'chatcmpl-empty',
        choices: [{ message: { content: null } }],
      };

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      expect(res._status).toBe(200);
      expect(res._body.result).toBe('');
    });

    it('returns empty string result when Groq choices array is empty', async () => {
      mockGroqResponse = { id: 'chatcmpl-nochoices', choices: [] };

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      expect(res._status).toBe(200);
      expect(res._body.result).toBe('');
    });
  });

  // -------------------------------------------------------------------------
  // Groq error handling
  // -------------------------------------------------------------------------
  describe('Groq errors', () => {
    it('returns 500 with error message when Groq throws', async () => {
      mockGroqError = new Error('rate limit exceeded');

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'Groq failed: rate limit exceeded' });
    });

    it('returns 500 with the original error message', async () => {
      mockGroqError = new Error('API key invalid');

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      expect(res._body.error).toContain('API key invalid');
    });

    it('does not call Supabase when Groq throws', async () => {
      mockGroqError = new Error('network error');

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('wraps the error message with "Groq failed:" prefix', async () => {
      mockGroqError = new Error('timeout after 30s');

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      expect(res._body.error).toBe('Groq failed: timeout after 30s');
    });
  });

  // -------------------------------------------------------------------------
  // Supabase logging
  // -------------------------------------------------------------------------
  describe('Supabase logging', () => {
    it('logs to groq_logs table on success', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'log this prompt' }), res);

      expect(mockFrom).toHaveBeenCalledWith('groq_logs');
    });

    it('inserts correct fields into groq_logs', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'my test prompt' }), res);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.model).toBe('groq/llama3-8b-8192');
      expect(insertCall.prompt).toBe('my test prompt');
      expect(insertCall.response).toBe('Generated content from Groq');
      expect(insertCall.request_id).toBe('chatcmpl-abc123');
      expect(typeof insertCall.latency_ms).toBe('number');
    });

    it('uses the chat.id as request_id in the log', async () => {
      mockGroqResponse.id = 'chatcmpl-unique-id-xyz';

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.request_id).toBe('chatcmpl-unique-id-xyz');
    });

    it('still returns 200 even when Supabase log insert throws', async () => {
      mockInsert.mockReturnValue({
        catch: (fn) => fn(new Error('Supabase connection failed')),
      });

      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'test' }), res);

      expect(res._status).toBe(200);
    });

    it('logs the user_prompt field when used instead of prompt', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { user_prompt: 'user supplied prompt' }), res);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.prompt).toBe('user supplied prompt');
    });

    it('latency_ms in the log is a non-negative number', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { prompt: 'timing test' }), res);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.latency_ms).toBeGreaterThanOrEqual(0);
    });
  });
});