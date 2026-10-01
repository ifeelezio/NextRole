import { NextResponse } from "next/server";
import { getOwnedResume, handleError, readJson, requireUser } from "@/lib/api";
import { generateInterviewQuestions } from "@/lib/openai";
import { jobRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const { resumeId, jobDescription } = jobRequestSchema.parse(await readJson(request));
    const resume = await getOwnedResume(supabase, user.id, resumeId);

    const questions = await generateInterviewQuestions(resume.resume_text, jobDescription);
    return NextResponse.json(questions);
  } catch (error) {
    return handleError(error);
  }
}
