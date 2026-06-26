/**
 * Tests for api/webhook/github.js
 *
 * The handler uses the global fetch to send Telegram notifications.
 * fetch is mocked globally so no real HTTP calls are made.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ─── Import handler (no external modules to mock in this file) ────────────────
const { default: handler } = await import('../api/webhook/github.js');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeReq({ event = 'push', body = {} } = {}) {
  return {
    method: 'POST',
    headers: { 'x-github-event': event },
    body,
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

function telegramOkFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({ ok: true }),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('webhook/github handler – method guard', () => {
  it('returns 405 for GET requests', async () => {
    const req = { method: 'GET', headers: { 'x-github-event': 'push' }, body: {} };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
    expect(res._ended).toBe(true);
  });

  it('returns 405 for PUT requests', async () => {
    const req = { method: 'PUT', headers: { 'x-github-event': 'push' }, body: {} };
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(405);
  });
});

describe('webhook/github handler – event filtering', () => {
  it('returns 200 silently for unimportant events (push)', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({ event: 'push' });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._ended).toBe(true);
    // fetch should NOT be called for Telegram (unimportant event)
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 200 silently for pull_request events', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({ event: 'pull_request' });
    const res = makeRes();
    await handler(req, res);
    expect(res._ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 200 silently for issues events', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({ event: 'issues' });
    const res = makeRes();
    await handler(req, res);
    expect(res._ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('webhook/github handler – secret_scanning_alert event', () => {
  beforeEach(() => {
    global.fetch = telegramOkFetch();
    process.env.TELEGRAM_BOT = 'bot-token-123';
    process.env.TELEGRAM_CHAT_ID = 'chat-456';
  });

  afterEach(() => {
    delete process.env.TELEGRAM_BOT;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it('sends Telegram message and returns { ok: true }', async () => {
    const req = makeReq({
      event: 'secret_scanning_alert',
      body: { alert: { secret_type: 'github_personal_access_token' }, repository: { full_name: 'user/repo' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body).toEqual({ ok: true });
  });

  it('sends Telegram message to the correct bot URL', async () => {
    const req = makeReq({
      event: 'secret_scanning_alert',
      body: { alert: { secret_type: 'aws_access_key_id' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.telegram.org/botbot-token-123/sendMessage'),
      expect.any(Object)
    );
  });

  it('sends Telegram message with the chat_id from env', async () => {
    const req = makeReq({
      event: 'secret_scanning_alert',
      body: { alert: { secret_type: 'aws_access_key_id' } },
    });
    const res = makeRes();
    await handler(req, res);
    const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(fetchBody.chat_id).toBe('chat-456');
  });

  it('includes the secret_type in the Telegram message text', async () => {
    const req = makeReq({
      event: 'secret_scanning_alert',
      body: { alert: { secret_type: 'github_token' } },
    });
    const res = makeRes();
    await handler(req, res);
    const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(fetchBody.text).toContain('github_token');
  });

  it('includes the repo name in the Telegram message', async () => {
    const req = makeReq({
      event: 'secret_scanning_alert',
      body: { alert: { secret_type: 'token' }, repository: { full_name: 'myorg/myrepo' } },
    });
    const res = makeRes();
    await handler(req, res);
    const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(fetchBody.text).toContain('myorg/myrepo');
  });

  it('falls back to crystalcastle when repository is missing', async () => {
    const req = makeReq({
      event: 'secret_scanning_alert',
      body: { alert: { secret_type: 'token' } },
    });
    const res = makeRes();
    await handler(req, res);
    const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(fetchBody.text).toContain('crystalcastle');
  });

  it('uses HTML parse_mode for Telegram message', async () => {
    const req = makeReq({ event: 'secret_scanning_alert', body: { alert: {} } });
    const res = makeRes();
    await handler(req, res);
    const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(fetchBody.parse_mode).toBe('HTML');
  });
});

describe('webhook/github handler – deployment_status event', () => {
  beforeEach(() => {
    global.fetch = telegramOkFetch();
    process.env.TELEGRAM_BOT = 'bot-token';
    process.env.TELEGRAM_CHAT_ID = 'chat-id';
  });

  afterEach(() => {
    delete process.env.TELEGRAM_BOT;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it('sends Telegram alert on deployment failure', async () => {
    const req = makeReq({
      event: 'deployment_status',
      body: { deployment_status: { state: 'failure' }, repository: { full_name: 'org/app' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._body).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('sends Telegram alert on deployment success', async () => {
    const req = makeReq({
      event: 'deployment_status',
      body: { deployment_status: { state: 'success' }, repository: { full_name: 'org/app' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._body).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('returns 200 silently for pending deployment state', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({
      event: 'deployment_status',
      body: { deployment_status: { state: 'pending' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 200 silently for in_progress deployment state', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({
      event: 'deployment_status',
      body: { deployment_status: { state: 'in_progress' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('webhook/github handler – workflow_run event', () => {
  beforeEach(() => {
    global.fetch = telegramOkFetch();
    process.env.TELEGRAM_BOT = 'bot-token';
    process.env.TELEGRAM_CHAT_ID = 'chat-id';
  });

  afterEach(() => {
    delete process.env.TELEGRAM_BOT;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it('sends Telegram alert on workflow failure conclusion', async () => {
    const req = makeReq({
      event: 'workflow_run',
      body: {
        workflow_run: { conclusion: 'failure', name: 'CI Pipeline' },
        repository: { full_name: 'org/app' },
      },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._body).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('includes the workflow name in the Telegram message', async () => {
    const req = makeReq({
      event: 'workflow_run',
      body: {
        workflow_run: { conclusion: 'failure', name: 'Deploy Production' },
      },
    });
    const res = makeRes();
    await handler(req, res);
    const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(fetchBody.text).toContain('Deploy Production');
  });

  it('returns 200 silently for success conclusion', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({
      event: 'workflow_run',
      body: { workflow_run: { conclusion: 'success', name: 'CI' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 200 silently for skipped conclusion', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({
      event: 'workflow_run',
      body: { workflow_run: { conclusion: 'skipped', name: 'Lint' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns 200 silently for cancelled conclusion', async () => {
    global.fetch = telegramOkFetch();
    const req = makeReq({
      event: 'workflow_run',
      body: { workflow_run: { conclusion: 'cancelled', name: 'Test' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('webhook/github handler – Telegram error resilience', () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT = 'bot-token';
    process.env.TELEGRAM_CHAT_ID = 'chat-id';
  });

  afterEach(() => {
    delete process.env.TELEGRAM_BOT;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it('still returns { ok: true } when Telegram fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
    const req = makeReq({
      event: 'secret_scanning_alert',
      body: { alert: { secret_type: 'token' } },
    });
    const res = makeRes();
    await handler(req, res);
    // Handler should absorb the Telegram error and still respond
    expect(res._status).toBe(200);
    expect(res._body).toEqual({ ok: true });
  });

  it('still returns { ok: true } when Telegram returns a non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ ok: false, description: 'Bad Request' }),
    });
    const req = makeReq({
      event: 'deployment_status',
      body: { deployment_status: { state: 'failure' } },
    });
    const res = makeRes();
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._body).toEqual({ ok: true });
  });
});

describe('webhook/github handler – Telegram message format', () => {
  beforeEach(() => {
    global.fetch = telegramOkFetch();
    process.env.TELEGRAM_BOT = 'bot';
    process.env.TELEGRAM_CHAT_ID = 'cid';
  });

  afterEach(() => {
    delete process.env.TELEGRAM_BOT;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it('uses POST method for Telegram API call', async () => {
    const req = makeReq({ event: 'secret_scanning_alert', body: { alert: {} } });
    const res = makeRes();
    await handler(req, res);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('sets Content-Type to application/json for Telegram request', async () => {
    const req = makeReq({ event: 'secret_scanning_alert', body: { alert: {} } });
    const res = makeRes();
    await handler(req, res);
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('message text contains "Crystal Castle Alert"', async () => {
    const req = makeReq({ event: 'secret_scanning_alert', body: { alert: {} } });
    const res = makeRes();
    await handler(req, res);
    const fetchBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(fetchBody.text).toContain('Crystal Castle Alert');
  });
});