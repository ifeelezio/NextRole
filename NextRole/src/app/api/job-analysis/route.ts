import { NextResponse } from "next/server";
import { getOwnedResume, handleError, readJson, requireUser } from "@/lib/api";
import { AppError } from "@/lib/errors";
import { analyzeJobDescription } from "@/lib/openai";
import { jobRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const { resumeId, jobDescription } = jobRequestSchema.parse(await readJson(request));
    const resume = await getOwnedResume(supabase, user.id, resumeId);

    const result = await analyzeJobDescription(resume.resume_text, jobDescription);

    const { data, error } = await supabase
      .from("job_analyses")
      .insert({
        user_id: user.id,
        resume_id: resume.id,
        job_description: jobDescription,
        ...result,
      })
      .select("id")
      .single();
    if (error || !data) throw new AppError("Could not save the job analysis.", 500);

    return NextResponse.json({ id: data.id as string, ...result });
  } catch (error) {
    return handleError(error);
  }
}
