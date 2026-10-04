import { describe, expect, it } from "vitest";
import { auditResumeAssistant, improveResumeAssistant } from "@/lib/ai";
import { POST } from "@/app/api/ai/builder-assistant/route";
import type { ResumeData } from "@/lib/types";

const sampleResume: ResumeData = {
  id: "test-1",
  title: "Test Resume",
  personalInfo: {
    fullName: "Alex Rivera",
    jobTitle: "Software Developer",
    email: "alex@example.com",
    phone: "123-456-7890",
    location: "San Francisco, CA",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "Developer with some experience.",
  experience: [
    {
      id: "exp-1",
      role: "Software Developer",
      company: "Acme Corp",
      startDate: "2022",
      endDate: "Present",
      current: true,
      description: "worked on frontend features\nhelped with backend api",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      school: "University",
      startDate: "2018",
      endDate: "2022",
    },
  ],
  skills: "JavaScript, HTML, CSS",
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  customSections: [],
  settings: {
    template: "minimal",
    fontFamily: "inter",
    fontSize: "medium",
    lineHeight: "normal",
    accentColor: "#000000",
    margins: "normal",
    sectionSpacing: "normal",
  },
};

describe("Builder AI Assistant", () => {
  it("audits resume, identifies missing elements and produces questions", async () => {
    delete process.env.GEMINI_API_KEY; // Ensure heuristic fallback is exercised
    const result = await auditResumeAssistant(sampleResume);

    expect(result.scoreEstimate).toBeGreaterThan(0);
    expect(result.missingElements.length).toBeGreaterThan(0);
    expect(result.questionsToAsk.length).toBeGreaterThan(0);

    // Should detect missing professional links and metrics
    const questionSections = result.questionsToAsk.map((q) => q.section);
    expect(questionSections).toContain("personal");
    expect(questionSections).toContain("experience");
  });

  it("improves resume, upgrades action verbs, and weaves QA answers", async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await improveResumeAssistant({
      resumeData: sampleResume,
      action: "answer_and_apply",
      qaAnswers: [
        {
          question: "Do you have a LinkedIn or GitHub link to include?",
          answer: "linkedin.com/in/alexrivera",
        },
        {
          question: "At Acme Corp, what was one quantifiable result?",
          answer: "Boosted API response times by 45% and reduced bundle size by 20%",
        },
      ],
    });

    expect(result.improvedResume.personalInfo.linkedin).toBe("linkedin.com/in/alexrivera");
    expect(result.improvedResume.experience[0].description).toContain("Boosted API response times");
    expect(result.changelog.length).toBeGreaterThan(0);
  });

  it("API route handles audit_and_ask successfully", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new Request("http://localhost:3000/api/ai/builder-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "audit_and_ask",
        resumeData: sampleResume,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.action).toBe("audit_and_ask");
    expect(data.audit.questionsToAsk.length).toBeGreaterThan(0);
  });

  it("API route handles tailor action", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new Request("http://localhost:3000/api/ai/builder-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "tailor",
        resumeData: sampleResume,
        targetRole: "Staff Distributed Systems Engineer",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.improvedResume.personalInfo.jobTitle).toBe("Staff Distributed Systems Engineer");
  });

  it("API route handles generate_field_project action", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new Request("http://localhost:3000/api/ai/builder-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate_field_project",
        fieldOrTopic: "Distributed Systems Raft Consensus",
        targetRole: "Backend Engineer",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.project).toBeDefined();
    expect(data.project.name).toContain("Raft");
    expect(data.project.description).toContain("•");
    expect(data.project.technologies).toContain("Go");
  });

  it("API route handles step_interview action one-by-one", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new Request("http://localhost:3000/api/ai/builder-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "step_interview",
        resumeData: sampleResume,
        stepAnswer: {
          questionId: "q-exp-metric-0",
          section: "experience",
          question: "At Acme Corp, what was one quantifiable result?",
          answer: "Reduced p99 database latency from 80ms to 12ms using Redis caching",
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.improvedResume.experience[0].description).toContain("Reduced p99 database latency");
    expect(data.progress).toBeDefined();
    expect(data.progress.currentStep).toBeGreaterThanOrEqual(1);
    expect(data.changelog.length).toBeGreaterThan(0);
  });
});
