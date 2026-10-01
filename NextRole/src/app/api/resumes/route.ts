import { NextResponse } from "next/server";
import { getOwnedPathGuard } from "./guard";
import { handleError, readJson, requireUser } from "@/lib/api";
import { AppError } from "@/lib/errors";
import { extractPdfText } from "@/lib/pdf";
import { resumeRequestSchema } from "@/lib/schemas";
import { PDF_MIME, RESUME_BUCKET } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Called after the browser uploads the PDF to Storage. Downloads the file with the
 * user's own session (RLS applies), validates it, extracts the text and saves the row.
 */
export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser();
    const { filePath, fileName } = resumeRequestSchema.parse(await readJson(request));
    getOwnedPathGuard(user.id, filePath);

    const discard = () => supabase.storage.from(RESUME_BUCKET).remove([filePath]);

    const { data: blob, error: downloadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .download(filePath);
    if (downloadError || !blob) throw new AppError("The uploaded file was not found.", 404);

    try {
      if (blob.type !== PDF_MIME) throw new AppError("Only PDF files are allowed.", 400);
      const resumeText = await extractPdfText(blob);

      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_url: filePath,
          resume_text: resumeText,
        })
        .select("id")
        .single();
      if (error || !data) throw new AppError("Could not save the resume.", 500);

      return NextResponse.json({ resumeId: data.id as string });
    } catch (error) {
      await discard(); // don't leave rejected files in storage
      throw error;
    }
  } catch (error) {
    return handleError(error);
  }
}
