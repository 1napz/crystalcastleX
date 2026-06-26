// tests/engines.test.js
import { selectEngine } from "../src/engines";

describe("engines.js", () => {
  beforeEach(() => {
    // reset environment variables ก่อนทุก test
    delete process.env.OPENAI_KEY;
    delete process.env.GEMINI_KEY;
    delete process.env.GROQ_KEY;
  });

  test("เลือก OpenAI engine เมื่อมี OPENAI_KEY", () => {
    process.env.OPENAI_KEY = "dummy-openai-key";
    const engine = selectEngine();
    expect(engine).toBe("openai");
  });

  test("เลือก Gemini engine เมื่อมี GEMINI_KEY", () => {
    process.env.GEMINI_KEY = "dummy-gemini-key";
    const engine = selectEngine();
    expect(engine).toBe("gemini");
  });

  test("เลือก Groq engine เมื่อมี GROQ_KEY", () => {
    process.env.GROQ_KEY = "dummy-groq-key";
    const engine = selectEngine();
    expect(engine).toBe("groq");
  });

  test("throw error เมื่อไม่มี environment variables", () => {
    expect(() => selectEngine()).toThrow("No engine configured");
  });
});