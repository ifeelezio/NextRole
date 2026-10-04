import { describe, expect, it } from "vitest";
import { analysisSchema, interviewSchema, jobAnalysisSchema, jobRequestSchema } from "@/lib/schemas";
import { MAX_FILE_SIZE, hasPdfSignature, validatePdfFile } from "@/lib/validation";

const pdf = { name: "cv.pdf", type: "application/pdf", size: 1000 };

describe("validatePdfFile", () => {
  it("accepts a normal PDF", () => expect(validatePdfFile(pdf)).toBeNull());
  it("rejects wrong MIME type even with a .pdf extension", () =>
    expect(validatePdfFile({ ...pdf, type: "image/png" })).toMatch(/PDF/));
  it("rejects wrong extension even with the right MIME type", () =>
    expect(validatePdfFile({ ...pdf, name: "cv.exe" })).toMatch(/extension/));
  it("rejects files over 5 MB", () =>
    expect(validatePdfFile({ ...pdf, size: MAX_FILE_SIZE + 1 })).toMatch(/too large/));
  it("accepts exactly 5 MB", () => expect(validatePdfFile({ ...pdf, size: MAX_FILE_SIZE })).toBeNull());
  it("rejects empty files", () => expect(validatePdfFile({ ...pdf, size: 0 })).toMatch(/empty/));
});

describe("hasPdfSignature", () => {
  it("detects %PDF-", () => expect(hasPdfSignature(new TextEncoder().encode("%PDF-1.7 ..."))).toBe(true));
  it("rejects other content", () => expect(hasPdfSignature(new TextEncoder().encode("MZ binary"))).toBe(false));
  it("rejects tiny input", () => expect(hasPdfSignature(new Uint8Array([37]))).toBe(false));
});

describe("AI response schemas", () => {
  const lists = { skills: ["TS"], strengths: [], weaknesses: [], missing_skills: [], suggestions: [] };

  it("accepts a valid analysis and rounds the score", () => {
    expect(analysisSchema.parse({ ...lists, score: 77.6 }).score).toBe(78);
  });
  it("rejects scores outside 0-100", () => {
    expect(analysisSchema.safeParse({ ...lists, score: 101 }).success).toBe(false);
    expect(analysisSchema.safeParse({ ...lists, score: -1 }).success).toBe(false);
  });
  it("rejects missing fields", () => {
    expect(analysisSchema.safeParse({ score: 50 }).success).toBe(false);
  });
  it("validates match_percentage range", () => {
    const base = { matching_skills: [], missing_skills: [], relevant_experience: [], suggestions: [] };
    expect(jobAnalysisSchema.safeParse({ ...base, match_percentage: 82 }).success).toBe(true);
    expect(jobAnalysisSchema.safeParse({ ...base, match_percentage: 120 }).success).toBe(false);
  });
  it("requires exactly 5 questions per category", () => {
    const five = ["a", "b", "c", "d", "e"];
    const ok = { technical_questions: five, hr_questions: five, project_questions: five };
    expect(interviewSchema.safeParse(ok).success).toBe(true);
    expect(interviewSchema.safeParse({ ...ok, hr_questions: five.slice(0, 4) }).success).toBe(false);
  });
});

describe("request schemas", () => {
  it("rejects non-UUID resume ids and short job descriptions", () => {
    expect(jobRequestSchema.safeParse({ resumeId: "1", jobDescription: "x".repeat(60) }).success).toBe(false);
    expect(
      jobRequestSchema.safeParse({ resumeId: "11111111-1111-4111-8111-111111111111", jobDescription: "short" }).success,
    ).toBe(false);
  });
});
