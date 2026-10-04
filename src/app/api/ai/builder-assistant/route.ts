import { NextResponse } from "next/server";
import { builderAssistantRequestSchema } from "@/lib/schemas";
import {
  auditResumeAssistant,
  improveResumeAssistant,
  generateFieldProject,
  stepInterviewAssistant,
} from "@/lib/ai";
import { readJson } from "@/lib/api";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const rawBody = await readJson(request);
    const parsed = builderAssistantRequestSchema.parse(rawBody);
    const resumeData = (parsed.resumeData || {}) as unknown as ResumeData;

    if (parsed.action === "audit_and_ask") {
      const result = await auditResumeAssistant(resumeData);
      return NextResponse.json({
        action: parsed.action,
        message: "Audit completed successfully.",
        audit: result,
      });
    }

    if (parsed.action === "generate_field_project") {
      const topic = parsed.fieldOrTopic || parsed.userPrompt || "Full Stack Engineering";
      const project = await generateFieldProject({
        fieldOrTopic: topic,
        targetRole: parsed.targetRole,
      });
      return NextResponse.json({
        action: parsed.action,
        message: `Architected project for "${topic}".`,
        project,
      });
    }

    if (parsed.action === "step_interview") {
      const result = await stepInterviewAssistant({
        resumeData,
        stepAnswer: parsed.stepAnswer,
      });
      return NextResponse.json({
        action: parsed.action,
        message: result.message,
        improvedResume: result.improvedResume,
        changelog: result.changelog,
        nextQuestion: result.nextQuestion,
        progress: result.progress,
      });
    }

    const result = await improveResumeAssistant({
      resumeData,
      action: parsed.action,
      targetRole: parsed.targetRole,
      jobDescription: parsed.jobDescription,
      userPrompt: parsed.userPrompt,
      qaAnswers: parsed.qaAnswers,
    });

    return NextResponse.json({
      action: parsed.action,
      message: result.message,
      improvedResume: result.improvedResume,
      changelog: result.changelog,
    });
  } catch (error) {
    console.error("Builder AI Assistant error:", error);
    const msg = error instanceof Error ? error.message : "Failed to process AI request.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
