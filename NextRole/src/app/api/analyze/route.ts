import { NextResponse } from "next/server";
import { getOwnedResume, handleError, readJson, requireUser } from "@/lib/api";
import { AppError } from "@/lib/errors";
import { analyzeResume } from "@/lib/openai";
import { analyzeRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const { resumeId } = analyzeRequestSchema.parse(await readJson(request));
    const resume = await getOwnedResume(supabase, user.id, resumeId);

    const result = await analyzeResume(resume.resume_text);

    const { data, error } = await supabase
      .from("analyses")
      .insert({ user_id: user.id, resume_id: resume.id, ...result })
      .select("id")
      .single();
    if (error || !data) throw new AppError("Could not save the analysis.", 500);

    return NextResponse.json({ analysisId: data.id as string });
  } catch (error) {
    return handleError(error);
  }
}
