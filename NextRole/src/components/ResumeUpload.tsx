"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { postJson } from "@/lib/client-api";
import { createClient } from "@/lib/supabase/client";
import { PDF_MIME, RESUME_BUCKET, validatePdfFile } from "@/lib/validation";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import { btnPrimary, inputClass } from "./styles";

export default function ResumeUpload() {
  const router = useRouter();
  const inFlight = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = status !== null;

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return setFile(null);

    const problem = validatePdfFile(selected);
    if (problem) {
      setError(problem);
      setFile(null);
      event.target.value = "";
      return;
    }
    setFile(selected);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || inFlight.current) return;
    inFlight.current = true;
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session has expired. Please log in again.");

      setStatus("Uploading PDF...");
      const filePath = `${user.id}/${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from(RESUME_BUCKET)
        .upload(filePath, file, { contentType: PDF_MIME, upsert: false });
      if (uploadError) throw new Error("The upload failed. Please try again.");

      setStatus("Reading your resume...");
      const { resumeId } = await postJson<{ resumeId: string }>("/api/resumes", {
        filePath,
        fileName: file.name,
      });

      setStatus("Analyzing with AI...");
      const { analysisId } = await postJson<{ analysisId: string }>("/api/analyze", { resumeId });

      router.push(`/dashboard/analysis/${analysisId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus(null);
      inFlight.current = false;
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="resume" className="mb-1 block text-sm font-medium text-slate-700">
          Resume (PDF, up to 5 MB)
        </label>
        <input
          id="resume"
          type="file"
          accept="application/pdf,.pdf"
          onChange={onChange}
          disabled={busy}
          className={inputClass}
        />
        {file && <p className="mt-2 text-sm text-slate-600">Selected: {file.name}</p>}
      </div>
      <ErrorMessage message={error} />
      {status && <Loading label={status} />}
      <button type="submit" disabled={!file || busy} className={btnPrimary}>
        {busy ? "Working..." : "Upload and analyze"}
      </button>
    </form>
  );
}
