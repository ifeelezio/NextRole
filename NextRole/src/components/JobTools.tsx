"use client";

import { useState } from "react";
import { postJson } from "@/lib/client-api";
import type { InterviewQuestions, JobAnalysisResult } from "@/types";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import ResultList from "./ResultList";
import SkillList from "./SkillList";
import { btnPrimary, btnSecondary, cardClass, inputClass } from "./styles";

type Busy = "job" | "interview" | null;

export default function JobTools({ resumeId }: { resumeId: string }) {
  const [jobDescription, setJobDescription] = useState("");
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobAnalysisResult | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);

  async function run<T>(kind: Exclude<Busy, null>, url: string, apply: (data: T) => void) {
    if (busy) return;
    if (jobDescription.trim().length < 50) {
      setError("Paste a job description of at least 50 characters.");
      return;
    }
    setBusy(kind);
    setError(null);
    try {
      apply(await postJson<T>(url, { resumeId, jobDescription }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className={`${cardClass} space-y-4`} aria-labelledby="job-tools-title">
      <h2 id="job-tools-title" className="text-lg font-semibold text-slate-900">
        Analyze against a job description
      </h2>
      <div>
        <label htmlFor="jd" className="mb-1 block text-sm font-medium text-slate-700">
          Job description
        </label>
        <textarea
          id="jd"
          rows={8}
          maxLength={10000}
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          disabled={busy !== null}
          placeholder="Paste the full job description here"
          className={inputClass}
        />
      </div>
      <ErrorMessage message={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run<JobAnalysisResult>("job", "/api/job-analysis", setJob)}
          className={btnPrimary}
        >
          {busy === "job" ? "Analyzing..." : "Analyze Against Job Description"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run<InterviewQuestions>("interview", "/api/interview", setQuestions)}
          className={btnSecondary}
        >
          {busy === "interview" ? "Generating..." : questions ? "Regenerate Questions" : "Generate Questions"}
        </button>
        {busy && <Loading label={busy === "job" ? "Comparing your resume..." : "Writing questions..."} />}
      </div>

      {job && (
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <p className="text-3xl font-semibold text-slate-900">
            {job.match_percentage}%<span className="text-base font-normal text-slate-500"> match</span>
          </p>
          <p className="text-sm text-slate-600">
            AI-generated analysis. This result is for assistance only and is not a hiring decision.
          </p>
          <div>
            <h3 className="mb-2 text-base font-semibold text-slate-900">Matching skills</h3>
            <SkillList skills={job.matching_skills} />
          </div>
          <ResultList title="Missing skills" items={job.missing_skills} />
          <ResultList title="Relevant experience" items={job.relevant_experience} />
          <ResultList title="Suggestions" items={job.suggestions} />
        </div>
      )}

      {questions && (
        <div className="space-y-4 border-t border-slate-200 pt-4">
          <h3 className="text-lg font-semibold text-slate-900">Interview questions</h3>
          <ResultList title="Technical" items={questions.technical_questions} ordered />
          <ResultList title="HR" items={questions.hr_questions} ordered />
          <ResultList title="Project-based" items={questions.project_questions} ordered />
        </div>
      )}
    </section>
  );
}
