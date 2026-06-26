// mock-api.js
export async function mockFetch(path, options) {
  // Mock responses based on path
  switch (path) {
    case '/api/prompt':
      return { ok: true, status: 200, json: async () => ({ result: "Mock Prompt Generated" }) };
    case '/api/post':
      return { ok: true, status: 200, json: async () => ({ result: "Mock Post Created" }) };
    case '/api/video':
      return { ok: true, status: 200, json: async () => ({ result: "Mock Video Generated" }) };
    case '/api/magichour':
      return { ok: true, status: 200, json: async () => ({ result: "Mock Magic Hour Video" }) };
    default:
      return { ok: false, status: 404 };
  }
}