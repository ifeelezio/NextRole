import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

/** Step 1 of every route: verify the session and derive the user from it. */
export async function requireUser(): Promise<{ supabase: SupabaseClient; user: User }> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new AppError("You need to sign in to do that.", 401);
  return { supabase, user };
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AppError("The request body must be valid JSON.", 400);
  }
}

/** Loads a resume only if it belongs to the user. Missing and foreign IDs look identical (404). */
export async function getOwnedResume(
  supabase: SupabaseClient,
  userId: string,
  resumeId: string,
): Promise<{ id: string; resume_text: string }> {
  const { data, error } = await supabase
    .from("resumes")
    .select("id, resume_text")
    .eq("id", resumeId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new AppError("Could not load the resume.", 500);
  if (!data) throw new AppError("Resume not found.", 404);
  if (!data.resume_text) throw new AppError("This resume has no extracted text.", 422);
  return { id: data.id as string, resume_text: data.resume_text as string };
}

/** Converts any thrown value into a safe JSON response. Never leaks internals. */
export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Invalid request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  console.error("Unhandled API error:", error instanceof Error ? error.message : "unknown");
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
