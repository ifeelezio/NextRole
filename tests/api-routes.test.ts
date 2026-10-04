import { beforeEach, describe, expect, it, vi } from "vitest";
import { jsonRequest, mockSupabase } from "./helpers";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/ai", () => ({
  analyzeResume: vi.fn(),
  analyzeJobDescription: vi.fn(),
  generateInterviewQuestions: vi.fn(),
}));

import { POST as analyze } from "@/app/api/analyze/route";
import { POST as interview } from "@/app/api/interview/route";
import { POST as jobAnalysis } from "@/app/api/job-analysis/route";
import { POST as saveResume } from "@/app/api/resumes/route";
import { analyzeJobDescription, analyzeResume, generateInterviewQuestions } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

const RESUME_ID = "11111111-1111-4111-8111-111111111111";
const JOB = "We are hiring a full-stack engineer with React, TypeScript and PostgreSQL experience.";

const analysisResult = { score: 78, skills: ["TS"], strengths: [], weaknesses: [], missing_skills: [], suggestions: [] };
const jobResult = { match_percentage: 82, matching_skills: [], missing_skills: [], relevant_experience: [], suggestions: [] };
const five = ["a", "b", "c", "d", "e"];
const questions = { technical_questions: five, hr_questions: five, project_questions: five };

function use(options: Parameters<typeof mockSupabase>[0]) {
  const mock = mockSupabase(options);
  vi.mocked(createClient).mockResolvedValue(mock.client as never);
  return mock;
}

beforeEach(() => vi.clearAllMocks());

const routes = [
  { name: "analyze", handler: analyze, body: { resumeId: RESUME_ID }, ai: analyzeResume },
  { name: "job-analysis", handler: jobAnalysis, body: { resumeId: RESUME_ID, jobDescription: JOB }, ai: analyzeJobDescription },
  { name: "interview", handler: interview, body: { resumeId: RESUME_ID, jobDescription: JOB }, ai: generateInterviewQuestions },
];

describe.each(routes)("POST /api/$name security", ({ handler, body, ai }) => {
  it("returns 401 without a session and never reaches the database or AI", async () => {
    const { chain } = use({ user: null });
    const response = await handler(jsonRequest("http://localhost/api/x", body));
    expect(response.status).toBe(401);
    expect(chain.select).not.toHaveBeenCalled();
    expect(ai).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid input", async () => {
    use({ user: { id: "user-1" } });
    const response = await handler(jsonRequest("http://localhost/api/x", { ...body, resumeId: "not-a-uuid" }));
    expect(response.status).toBe(400);
    expect(ai).not.toHaveBeenCalled();
  });

  it("returns 404 when the resume is not owned by the user, scoped by session user id", async () => {
    const { chain } = use({ user: { id: "user-1" }, selectResult: { data: null, error: null } });
    const response = await handler(jsonRequest("http://localhost/api/x", body));
    expect(response.status).toBe(404);
    expect(chain.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(ai).not.toHaveBeenCalled();
  });
});

describe("POST /api/analyze", () => {
  it("saves the analysis using the session user id, ignoring any client-sent user_id", async () => {
    const { chain } = use({
      user: { id: "user-1" },
      selectResult: { data: { id: RESUME_ID, resume_text: "resume text" }, error: null },
      insertResult: { data: { id: "analysis-1" }, error: null },
    });
    vi.mocked(analyzeResume).mockResolvedValue(analysisResult);

    const response = await analyze(jsonRequest("http://localhost/api/analyze", { resumeId: RESUME_ID, user_id: "attacker" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ analysisId: "analysis-1" });
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "user-1", resume_id: RESUME_ID, score: 78 }));
  });

  it("returns 502 with a safe message when the AI fails", async () => {
    use({
      user: { id: "user-1" },
      selectResult: { data: { id: RESUME_ID, resume_text: "resume text" }, error: null },
    });
    const { AppError } = await import("@/lib/errors");
    vi.mocked(analyzeResume).mockRejectedValue(new AppError("The AI service is unavailable. Please try again.", 502));

    const response = await analyze(jsonRequest("http://localhost/api/analyze", { resumeId: RESUME_ID }));
    expect(response.status).toBe(502);
    expect((await response.json()).error).toMatch(/unavailable/);
  });
});

describe("POST /api/job-analysis", () => {
  it("saves and returns the result", async () => {
    const { chain } = use({
      user: { id: "user-1" },
      selectResult: { data: { id: RESUME_ID, resume_text: "resume text" }, error: null },
      insertResult: { data: { id: "job-1" }, error: null },
    });
    vi.mocked(analyzeJobDescription).mockResolvedValue(jobResult);

    const response = await jobAnalysis(jsonRequest("http://localhost/api/job-analysis", { resumeId: RESUME_ID, jobDescription: JOB }));

    expect(response.status).toBe(200);
    expect((await response.json()).match_percentage).toBe(82);
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "user-1", job_description: JOB }));
  });
});

describe("POST /api/interview", () => {
  it("returns 5 questions per category", async () => {
    use({
      user: { id: "user-1" },
      selectResult: { data: { id: RESUME_ID, resume_text: "resume text" }, error: null },
    });
    vi.mocked(generateInterviewQuestions).mockResolvedValue(questions);

    const response = await interview(jsonRequest("http://localhost/api/interview", { resumeId: RESUME_ID, jobDescription: JOB }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.technical_questions).toHaveLength(5);
    expect(body.hr_questions).toHaveLength(5);
    expect(body.project_questions).toHaveLength(5);
  });
});

describe("POST /api/resumes", () => {
  it("returns 401 without a session", async () => {
    use({ user: null });
    const response = await saveResume(jsonRequest("http://localhost/api/resumes", { filePath: "u/a.pdf", fileName: "a.pdf" }));
    expect(response.status).toBe(401);
  });

  it("rejects storage paths outside the caller's own folder", async () => {
    use({ user: { id: "user-1" } });
    for (const filePath of ["user-2/a.pdf", "user-1/../user-2/a.pdf", "user-1/a.exe"]) {
      const response = await saveResume(jsonRequest("http://localhost/api/resumes", { filePath, fileName: "a.pdf" }));
      expect(response.status).toBe(400);
    }
  });
});
