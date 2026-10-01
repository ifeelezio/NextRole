import Link from "next/link";
import { redirect } from "next/navigation";
import AnalysisCard from "@/components/AnalysisCard";
import ErrorMessage from "@/components/ErrorMessage";
import { btnPrimary, cardClass } from "@/components/styles";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Analysis, Resume } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [resumeResult, analysesResult] = await Promise.all([
    supabase
      .from("resumes")
      .select("id, file_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("analyses")
      .select("id, score, skills, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const resume = resumeResult.data as Pick<Resume, "id" | "file_name" | "created_at"> | null;
  const analyses = (analysesResult.data ?? []) as Pick<Analysis, "id" | "score" | "skills" | "created_at">[];
  const loadFailed = Boolean(resumeResult.error || analysesResult.error);

  return (
    <div className="space-y-8">
      <ErrorMessage message={loadFailed ? "Some of your data could not be loaded. Refresh to try again." : null} />

      <section className={`${cardClass} flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Your resume</h1>
          {resume ? (
            <p className="mt-1 text-sm text-slate-600">
              {resume.file_name} - uploaded {formatDate(resume.created_at)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">No resume uploaded yet.</p>
          )}
        </div>
        <Link href="/dashboard/upload" className={btnPrimary}>
          Upload Resume
        </Link>
      </section>

      <section aria-labelledby="analyses-title">
        <h2 id="analyses-title" className="mb-4 text-lg font-semibold text-slate-900">
          Previous analyses
        </h2>
        {analyses.length === 0 ? (
          <div className={`${cardClass} text-center`}>
            <p className="font-medium text-slate-900">No resume analyses yet.</p>
            <p className="mt-1 text-sm text-slate-600">Upload your resume to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
