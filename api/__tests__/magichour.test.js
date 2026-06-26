import handler from '../magichour.js';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeReq(method = 'POST', body = {}) {
  return { method, body };
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
  };
  return res;
}

beforeEach(() => {
  mockFetch.mockReset();
  process.env.MAGIC_HOUR_API_KEY = 'test-api-key';
});

describe('magichour handler', () => {
  describe('HTTP method validation', () => {
    test.each(['GET', 'PUT', 'DELETE', 'PATCH'])(
      'returns 405 for %s requests',
      async (method) => {
        const req = makeReq(method);
        const res = makeRes();

        await handler(req, res);

        expect(res._status).toBe(405);
        expect(res._body).toEqual({ error: 'Method not allowed' });
        expect(mockFetch).not.toHaveBeenCalled();
      }
    );

    test('does not return 405 for POST requests', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      expect(res._status).not.toBe(405);
    });
  });

  describe('successful POST request', () => {
    test('calls Magic Hour API with correct URL and method', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'cinematic' });
      const res = makeRes();

      await handler(req, res);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.magichour.ai/v1/image-to-video',
        expect.objectContaining({ method: 'POST' })
      );
    });

    test('sends Authorization Bearer token from env variable', async () => {
      process.env.MAGIC_HOUR_API_KEY = 'my-secret-key';
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers['Authorization']).toBe('Bearer my-secret-key');
    });

    test('sends Content-Type application/json header', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers['Content-Type']).toBe('application/json');
    });

    test('sends image_url, prompt, and hardcoded duration 5 in request body', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', {
        image_url: 'https://img.example.com/photo.jpg',
        prompt: 'make it cinematic',
      });
      const res = makeRes();

      await handler(req, res);

      const [, options] = mockFetch.mock.calls[0];
      expect(JSON.parse(options.body)).toEqual({
        image_url: 'https://img.example.com/photo.jpg',
        prompt: 'make it cinematic',
        duration: 5,
      });
    });

    test('returns 200 with video_url from API response', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://cdn.magichour.ai/output/video.mp4' }),
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ video_url: 'https://cdn.magichour.ai/output/video.mp4' });
    });

    test('returns video_url as undefined when API response omits it', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ some_other_field: 'value' }),
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      expect(res._status).toBe(200);
      expect(res._body).toEqual({ video_url: undefined });
    });
  });

  describe('missing or partial request body fields', () => {
    test('sends undefined image_url when not provided in body', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', { prompt: 'test prompt' });
      const res = makeRes();

      await handler(req, res);

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.image_url).toBeUndefined();
      expect(body.duration).toBe(5);
    });

    test('sends undefined prompt when not provided in body', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg' });
      const res = makeRes();

      await handler(req, res);

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.prompt).toBeUndefined();
      expect(body.duration).toBe(5);
    });
  });

  describe('error handling', () => {
    test('returns 500 with error message when fetch throws', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'Network failure' });
    });

    test('returns 500 with error message when response.json() throws', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => { throw new Error('Invalid JSON from API'); },
      });

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'Invalid JSON from API' });
    });

    test('returns 500 with empty string error message when error has no message', async () => {
      const errorWithNoMessage = new Error();
      mockFetch.mockRejectedValueOnce(errorWithNoMessage);

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: '' });
    });

    test('returns 500 on DNS / connection timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('connect ETIMEDOUT'));

      const req = makeReq('POST', { image_url: 'https://img.example.com/photo.jpg', prompt: 'test' });
      const res = makeRes();

      await handler(req, res);

      expect(res._status).toBe(500);
      expect(res._body).toEqual({ error: 'connect ETIMEDOUT' });
    });
  });

  describe('boundary and regression cases', () => {
    test('duration is always 5 regardless of extra fields in body', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ video_url: 'https://example.com/video.mp4' }),
      });

      const req = makeReq('POST', {
        image_url: 'https://img.example.com/photo.jpg',
        prompt: 'test',
        duration: 999, // caller tries to override duration
      });
      const res = makeRes();

      await handler(req, res);

      const [, options] = mockFetch.mock.calls[0];
      expect(JSON.parse(options.body).duration).toBe(5);
    });

    test('HEAD method is rejected with 405', async () => {
      const req = makeReq('HEAD');
      const res = makeRes();

      await handler(req, res);

      expect(res._status).toBe(405);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});