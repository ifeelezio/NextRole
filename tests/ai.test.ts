import { beforeEach, describe, expect, it, vi } from "vitest";

const create = vi.fn();

vi.mock("openai", () => {
  class APIError extends Error {
    status: number;
    constructor(status: number) {
      super(`status ${status}`);
      this.status = status;
    }
  }
  class OpenAI {
    static APIError = APIError;
    chat = { completions: { create } };
  }
  return { default: OpenAI };
});

const validAnalysis = {
  score: 80,
  skills: ["TypeScript"],
  strengths: ["Clear"],
  weaknesses: ["Short"],
  missing_skills: ["Docker"],
  suggestions: ["Add metrics"],
};

const reply = (content: string) => ({ choices: [{ message: { content } }] });

describe("Gemini AI client", () => {
  beforeEach(() => {
    vi.resetModules();
    create.mockReset();
    process.env.GEMINI_API_KEY = "test-key";
    delete process.env.GEMINI_MODEL;
  });

  it("uses gemini-3.8-flash by default", async () => {
    create.mockResolvedValueOnce(reply(JSON.stringify(validAnalysis)));
    const { analyzeResume } = await import("@/lib/ai");
    await expect(analyzeResume("resume")).resolves.toEqual(validAnalysis);
    expect(create.mock.calls[0][0].model).toBe("gemini-3.8-flash");
  });

  it("falls back to the next Flash model when one is not available", async () => {
    const OpenAI = (await import("openai")).default as unknown as { APIError: new (s: number) => Error };
    create.mockRejectedValueOnce(new OpenAI.APIError(404)).mockResolvedValueOnce(reply(JSON.stringify(validAnalysis)));
    const { analyzeResume } = await import("@/lib/ai");
    await expect(analyzeResume("resume")).resolves.toEqual(validAnalysis);
    expect(create.mock.calls.map((c) => c[0].model)).toEqual(["gemini-3.8-flash", "gemini-3.5-flash"]);
  });

  it("tries GEMINI_MODEL first when set", async () => {
    process.env.GEMINI_MODEL = "gemini-custom-flash";
    create.mockResolvedValueOnce(reply(JSON.stringify(validAnalysis)));
    const { analyzeResume } = await import("@/lib/ai");
    await analyzeResume("resume");
    expect(create.mock.calls[0][0].model).toBe("gemini-custom-flash");
  });

  it("accepts JSON wrapped in a markdown fence", async () => {
    create.mockResolvedValueOnce(reply("```json\n" + JSON.stringify(validAnalysis) + "\n```"));
    const { analyzeResume } = await import("@/lib/ai");
    await expect(analyzeResume("resume")).resolves.toEqual(validAnalysis);
  });

  it("returns a 500 when GEMINI_API_KEY is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const { analyzeResume } = await import("@/lib/ai");
    await expect(analyzeResume("resume")).rejects.toMatchObject({ status: 500 });
  });
});
