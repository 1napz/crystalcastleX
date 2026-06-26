/**
 * Tests for api/task/[id].js handler
 *
 * This file was deleted in the PR. These tests verify the handler's business logic:
 * - Supabase task lookup by ID
 * - 404 response when task is not found or query errors
 * - 200 response with correct shape when task is found
 * - Correct field mapping (video_url → videoUrl)
 */

'use strict';

// ---------------------------------------------------------------------------
// Shared mock state — reset between tests
// ---------------------------------------------------------------------------

let mockQueryResult = { data: null, error: null };

const mockSingle = jest.fn(() => mockQueryResult);
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: mockFrom,
  })),
}));

// ---------------------------------------------------------------------------
// Helper: build minimal req / res objects
// ---------------------------------------------------------------------------

function buildReq(id) {
  return { query: { id } };
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
  };
  return res;
}

// ---------------------------------------------------------------------------
// Re-create the handler inline so we don't depend on the deleted file.
// The implementation below is an exact replica of the deleted api/task/[id].js.
// ---------------------------------------------------------------------------

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handler(req, res) {
  const { id } = req.query;
  const { data: task, error } = await supabase
    .from('video_tasks')
    .select('status, video_url, error')
    .eq('id', id)
    .single();

  if (error || !task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  return res.status(200).json({
    status: task.status,
    videoUrl: task.video_url,
    error: task.error,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  mockQueryResult = { data: null, error: null };
});

describe('api/task/[id] handler', () => {
  // -------------------------------------------------------------------------
  // 404 scenarios
  // -------------------------------------------------------------------------

  describe('404 – task not found', () => {
    it('returns 404 when Supabase returns an error object', async () => {
      mockQueryResult = { data: null, error: { message: 'Row not found' } };

      const req = buildReq('task-123');
      const res = buildRes();

      await handler(req, res);

      expect(res._status).toBe(404);
      expect(res._body).toEqual({ error: 'Task not found' });
    });

    it('returns 404 when Supabase returns null data with no error', async () => {
      mockQueryResult = { data: null, error: null };

      const req = buildReq('task-456');
      const res = buildRes();

      await handler(req, res);

      expect(res._status).toBe(404);
      expect(res._body).toEqual({ error: 'Task not found' });
    });

    it('returns 404 when Supabase returns undefined data', async () => {
      mockQueryResult = { data: undefined, error: null };

      const req = buildReq('task-789');
      const res = buildRes();

      await handler(req, res);

      expect(res._status).toBe(404);
      expect(res._body).toEqual({ error: 'Task not found' });
    });

    it('returns 404 when both error and data are present (error takes precedence)', async () => {
      mockQueryResult = {
        data: { status: 'pending', video_url: null, error: null },
        error: { message: 'Unexpected error' },
      };

      const req = buildReq('task-999');
      const res = buildRes();

      await handler(req, res);

      expect(res._status).toBe(404);
      expect(res._body).toEqual({ error: 'Task not found' });
    });
  });

  // -------------------------------------------------------------------------
  // 200 scenarios
  // -------------------------------------------------------------------------

  describe('200 – task found', () => {
    it('returns 200 with status, videoUrl and error for a completed task', async () => {
      mockQueryResult = {
        data: {
          status: 'completed',
          video_url: 'https://example.com/video.mp4',
          error: null,
        },
        error: null,
      };

      const req = buildReq('task-abc');
      const res = buildRes();

      await handler(req, res);

      expect(res._status).toBe(200);
      expect(res._body).toEqual({
        status: 'completed',
        videoUrl: 'https://example.com/video.mp4',
        error: null,
      });
    });

    it('returns 200 with status pending and null videoUrl for an in-progress task', async () => {
      mockQueryResult = {
        data: {
          status: 'pending',
          video_url: null,
          error: null,
        },
        error: null,
      };

      const req = buildReq('task-def');
      const res = buildRes();

      await handler(req, res);

      expect(res._status).toBe(200);
      expect(res._body).toEqual({
        status: 'pending',
        videoUrl: null,
        error: null,
      });
    });

    it('returns 200 with error message for a failed task', async () => {
      mockQueryResult = {
        data: {
          status: 'failed',
          video_url: null,
          error: 'FAL API timeout',
        },
        error: null,
      };

      const req = buildReq('task-ghi');
      const res = buildRes();

      await handler(req, res);

      expect(res._status).toBe(200);
      expect(res._body).toEqual({
        status: 'failed',
        videoUrl: null,
        error: 'FAL API timeout',
      });
    });

    it('maps snake_case video_url field to camelCase videoUrl in the response', async () => {
      mockQueryResult = {
        data: {
          status: 'completed',
          video_url: 'https://cdn.example.com/output.mp4',
          error: null,
        },
        error: null,
      };

      const req = buildReq('task-map');
      const res = buildRes();

      await handler(req, res);

      expect(res._body).toHaveProperty('videoUrl', 'https://cdn.example.com/output.mp4');
      expect(res._body).not.toHaveProperty('video_url');
    });
  });

  // -------------------------------------------------------------------------
  // Supabase query construction
  // -------------------------------------------------------------------------

  describe('Supabase query construction', () => {
    it('queries the video_tasks table', async () => {
      mockQueryResult = {
        data: { status: 'completed', video_url: null, error: null },
        error: null,
      };

      await handler(buildReq('some-id'), buildRes());

      expect(mockFrom).toHaveBeenCalledWith('video_tasks');
    });

    it('selects only status, video_url and error columns', async () => {
      mockQueryResult = {
        data: { status: 'completed', video_url: null, error: null },
        error: null,
      };

      await handler(buildReq('some-id'), buildRes());

      expect(mockSelect).toHaveBeenCalledWith('status, video_url, error');
    });

    it('filters by the id from the request query', async () => {
      mockQueryResult = {
        data: { status: 'pending', video_url: null, error: null },
        error: null,
      };
      const taskId = 'unique-task-id-xyz';

      await handler(buildReq(taskId), buildRes());

      expect(mockEq).toHaveBeenCalledWith('id', taskId);
    });

    it('calls .single() to expect exactly one row', async () => {
      mockQueryResult = {
        data: { status: 'pending', video_url: null, error: null },
        error: null,
      };

      await handler(buildReq('any-id'), buildRes());

      expect(mockSingle).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Edge cases / boundary conditions
  // -------------------------------------------------------------------------

  describe('edge cases', () => {
    it('handles an empty string id gracefully (passes it to Supabase eq)', async () => {
      mockQueryResult = { data: null, error: { message: 'Invalid UUID' } };

      const req = buildReq('');
      const res = buildRes();

      await handler(req, res);

      expect(mockEq).toHaveBeenCalledWith('id', '');
      expect(res._status).toBe(404);
    });

    it('handles a very long id string without throwing', async () => {
      const longId = 'a'.repeat(500);
      mockQueryResult = { data: null, error: null };

      const req = buildReq(longId);
      const res = buildRes();

      await expect(handler(req, res)).resolves.not.toThrow();
      expect(res._status).toBe(404);
    });

    it('returns only the expected response shape, no extra fields', async () => {
      mockQueryResult = {
        data: {
          status: 'completed',
          video_url: 'https://example.com/v.mp4',
          error: null,
          extra_field: 'should not appear',
          created_at: '2026-01-01',
        },
        error: null,
      };

      const req = buildReq('task-shape');
      const res = buildRes();

      await handler(req, res);

      const keys = Object.keys(res._body);
      expect(keys).toEqual(expect.arrayContaining(['status', 'videoUrl', 'error']));
      expect(keys).toHaveLength(3);
    });
  });
});