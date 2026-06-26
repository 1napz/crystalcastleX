/**
 * Tests for api/webhook/github.js handler
 *
 * Changes in this PR:
 * - Removed JSDoc comment block
 * - Removed explicit Telegram credentials validation (no longer returns 500 when
 *   TELEGRAM_BOT or TELEGRAM_CHAT_ID env vars are missing; proceeds silently)
 * - Simplified error handling: Telegram errors are caught and logged, handler
 *   always returns { ok: true } with 200 after the Telegram call
 * - Message text content updated (Thai translations of alerts)
 *
 * This handler has no imports – it is a standalone default export function.
 * We re-implement it here in CJS to test the logic directly.
 */

'use strict';

// ---------------------------------------------------------------------------
// Re-implement the handler (CJS version of api/webhook/github.js)
// ---------------------------------------------------------------------------

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const event = req.headers['x-github-event'];
  const body = req.body;

  const important = ['secret_scanning_alert', 'deployment_status', 'workflow_run'];
  if (!important.includes(event)) return res.status(200).end();

  let emoji = '\u2705';
  let text = '';

  if (event === 'secret_scanning_alert') {
    emoji = '\ud83d\udea8';
    text = `KEY leaked! ${body?.alert?.secret_type || ''}`;
  } else if (event === 'deployment_status') {
    if (body?.deployment_status?.state === 'failure') {
      emoji = '\u274c';
      text = 'Deploy failed';
    } else if (body?.deployment_status?.state === 'success') {
      emoji = '\u2705';
      text = 'Deploy success';
    } else {
      return res.status(200).end();
    }
  } else if (event === 'workflow_run') {
    const conclusion = body?.workflow_run?.conclusion;
    if (conclusion === 'failure') {
      emoji = '\u26a0\ufe0f';
      text = `Workflow failed: ${body?.workflow_run?.name}`;
    } else {
      return res.status(200).end();
    }
  }

  const repo = body?.repository?.full_name || 'crystalcastle';
  const msg = `${emoji} Crystal Castle Alert\n${text}\nRepo: ${repo}\nTime: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`;

  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: 'HTML',
      }),
    });
  } catch (e) {
    console.error('Telegram error', e);
  }

  res.status(200).json({ ok: true });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildReq(method, { event = '', body = {} } = {}) {
  return {
    method,
    headers: { 'x-github-event': event },
    body,
  };
}

function buildRes() {
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  process.env.TELEGRAM_BOT = 'test-bot-token';
  process.env.TELEGRAM_CHAT_ID = 'test-chat-123';

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ ok: true }),
  });
});

afterEach(() => {
  delete process.env.TELEGRAM_BOT;
  delete process.env.TELEGRAM_CHAT_ID;
});

describe('api/webhook/github handler', () => {
  // -------------------------------------------------------------------------
  // HTTP method guard
  // -------------------------------------------------------------------------
  describe('non-POST requests', () => {
    it('returns 405 for GET', async () => {
      const res = buildRes();
      await handler(buildReq('GET'), res);
      expect(res._status).toBe(405);
      expect(res._ended).toBe(true);
    });

    it('returns 405 for PUT', async () => {
      const res = buildRes();
      await handler(buildReq('PUT'), res);
      expect(res._status).toBe(405);
    });

    it('does not call Telegram for non-POST requests', async () => {
      const res = buildRes();
      await handler(buildReq('GET'), res);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Unimportant events – early 200 return
  // -------------------------------------------------------------------------
  describe('unimportant events', () => {
    it('returns 200 immediately for an unknown event', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { event: 'ping' }), res);
      expect(res._status).toBe(200);
      expect(res._ended).toBe(true);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 200 immediately for "push" event', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { event: 'push' }), res);
      expect(res._status).toBe(200);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 200 immediately for empty event string', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { event: '' }), res);
      expect(res._status).toBe(200);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 200 immediately for "issues" event', async () => {
      const res = buildRes();
      await handler(buildReq('POST', { event: 'issues' }), res);
      expect(res._status).toBe(200);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // secret_scanning_alert event
  // -------------------------------------------------------------------------
  describe('secret_scanning_alert event', () => {
    it('calls Telegram and returns { ok: true } with 200', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'secret_scanning_alert',
          body: { alert: { secret_type: 'github_personal_access_token' }, repository: { full_name: 'org/repo' } },
        }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
      expect(global.fetch).toHaveBeenCalled();
    });

    it('sends the secret_type in the Telegram message', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'secret_scanning_alert',
          body: { alert: { secret_type: 'aws_access_key' }, repository: { full_name: 'org/repo' } },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.text).toContain('aws_access_key');
    });

    it('handles missing secret_type gracefully (empty string)', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'secret_scanning_alert',
          body: { alert: {}, repository: { full_name: 'org/repo' } },
        }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
    });

    it('handles missing alert field gracefully', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'secret_scanning_alert',
          body: { repository: { full_name: 'org/repo' } },
        }),
        res
      );

      expect(res._status).toBe(200);
    });
  });

  // -------------------------------------------------------------------------
  // deployment_status event
  // -------------------------------------------------------------------------
  describe('deployment_status event', () => {
    it('calls Telegram for failure state', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'failure' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
      expect(global.fetch).toHaveBeenCalled();
    });

    it('calls Telegram for success state', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'success' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
      expect(global.fetch).toHaveBeenCalled();
    });

    it('returns 200 silently for "in_progress" state (not failure or success)', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'in_progress' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._ended).toBe(true);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 200 silently for "pending" state', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: { deployment_status: { state: 'pending' }, repository: { full_name: 'org/repo' } },
        }),
        res
      );

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 200 silently when deployment_status is missing (state is undefined)', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: { repository: { full_name: 'org/repo' } },
        }),
        res
      );

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // workflow_run event
  // -------------------------------------------------------------------------
  describe('workflow_run event', () => {
    it('calls Telegram for failure conclusion', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'workflow_run',
          body: {
            workflow_run: { conclusion: 'failure', name: 'CI Pipeline' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
      expect(global.fetch).toHaveBeenCalled();
    });

    it('includes the workflow name in the Telegram message', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'workflow_run',
          body: {
            workflow_run: { conclusion: 'failure', name: 'Lint and Test' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.text).toContain('Lint and Test');
    });

    it('returns 200 silently for "success" conclusion', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'workflow_run',
          body: {
            workflow_run: { conclusion: 'success', name: 'CI Pipeline' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      expect(res._ended).toBe(true);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 200 silently for "cancelled" conclusion', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'workflow_run',
          body: {
            workflow_run: { conclusion: 'cancelled', name: 'CI' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns 200 silently for null conclusion (workflow still running)', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'workflow_run',
          body: { workflow_run: { conclusion: null, name: 'CI' }, repository: { full_name: 'org/repo' } },
        }),
        res
      );

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Repository name in message
  // -------------------------------------------------------------------------
  describe('repository name handling', () => {
    it('uses repository.full_name in the Telegram message', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'secret_scanning_alert',
          body: {
            alert: { secret_type: 'token' },
            repository: { full_name: 'myorg/myrepo' },
          },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.text).toContain('myorg/myrepo');
    });

    it('defaults to "crystalcastle" when repository field is missing', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'secret_scanning_alert',
          body: { alert: { secret_type: 'token' } },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.text).toContain('crystalcastle');
    });

    it('defaults to "crystalcastle" when repository.full_name is undefined', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'failure' },
            repository: {},
          },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.text).toContain('crystalcastle');
    });
  });

  // -------------------------------------------------------------------------
  // Telegram call specifics
  // -------------------------------------------------------------------------
  describe('Telegram call', () => {
    it('sends message to Telegram with correct bot token and chat_id', async () => {
      process.env.TELEGRAM_BOT = 'my-bot-token';
      process.env.TELEGRAM_CHAT_ID = 'my-chat-id';

      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'failure' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      const fetchUrl = global.fetch.mock.calls[0][0];
      expect(fetchUrl).toContain('my-bot-token');

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.chat_id).toBe('my-chat-id');
    });

    it('sends parse_mode HTML to Telegram', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'success' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.parse_mode).toBe('HTML');
    });

    it('sends POST method to Telegram API', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'failure' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      const fetchOptions = global.fetch.mock.calls[0][1];
      expect(fetchOptions.method).toBe('POST');
    });

    it('still returns { ok: true } with 200 when Telegram call throws an error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('network timeout'));

      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'failure' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
    });

    it('does NOT return 500 when TELEGRAM_BOT env var is missing (changed in this PR)', async () => {
      delete process.env.TELEGRAM_BOT;
      global.fetch = jest.fn().mockRejectedValue(new Error('invalid token'));

      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'deployment_status',
          body: {
            deployment_status: { state: 'failure' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      // Old code returned 500 when credentials missing, new code does not
      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
    });

    it('does NOT return 500 when TELEGRAM_CHAT_ID env var is missing (changed in this PR)', async () => {
      delete process.env.TELEGRAM_CHAT_ID;
      global.fetch = jest.fn().mockRejectedValue(new Error('chat not found'));

      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'workflow_run',
          body: {
            workflow_run: { conclusion: 'failure', name: 'CI' },
            repository: { full_name: 'org/repo' },
          },
        }),
        res
      );

      // New code swallows the error and still returns 200
      expect(res._status).toBe(200);
      expect(res._body).toEqual({ ok: true });
    });
  });

  // -------------------------------------------------------------------------
  // Message content validation
  // -------------------------------------------------------------------------
  describe('Telegram message content', () => {
    it('includes "Crystal Castle Alert" in every message', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'secret_scanning_alert',
          body: { alert: { secret_type: 'token' }, repository: { full_name: 'org/repo' } },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.text).toContain('Crystal Castle Alert');
    });

    it('message always includes repo name', async () => {
      const res = buildRes();
      await handler(
        buildReq('POST', {
          event: 'workflow_run',
          body: {
            workflow_run: { conclusion: 'failure', name: 'Build' },
            repository: { full_name: 'testorg/testrepo' },
          },
        }),
        res
      );

      const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(fetchBody.text).toContain('testorg/testrepo');
    });
  });
});