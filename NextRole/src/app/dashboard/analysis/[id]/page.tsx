import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import JobTools from "@/components/JobTools";
import ResultList from "@/components/ResultList";
import SkillList from "@/components/SkillList";
import { cardClass } from "@/components/styles";
import { uuidSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import type { Analysis } from "@/types";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Filtering by user_id on top of RLS: changing the ID in the URL can never reveal another user's data.
  const { data } = await supabase
    .from("analyses")
    .select("id, resume_id, score, skills, strengths, weaknesses, missing_skills, suggestions, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) notFound();

  const analysis = data as Omit<Analysis, "user_id">;
  const asList = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="text-sm text-slate-600 underline">
        Back to dashboard
      </Link>

      <section className={cardClass}>
        <h1 className="text-sm font-medium text-slate-600">Resume score</h1>
        <p className="mt-1 text-5xl font-semibold text-slate-900">
          {analysis.score ?? "-"}
          <span className="text-2xl font-normal text-slate-500"> / 100</span>
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Skills</h2>
        <SkillList skills={asList(analysis.skills)} />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <ResultList title="Strengths" items={asList(analysis.strengths)} />
        </div>
        <div className={cardClass}>
          <ResultList title="Weaknesses" items={asList(analysis.weaknesses)} />
        </div>
        <div className={cardClass}>
          <ResultList title="Missing skills" items={asList(analysis.missing_skills)} />
        </div>
        <div className={cardClass}>
          <ResultList title="Improvement suggestions" items={asList(analysis.suggestions)} />
        </div>
      </div>

      <JobTools resumeId={analysis.resume_id} />
    </div>
  );
}
