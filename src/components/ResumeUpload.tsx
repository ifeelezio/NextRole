"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "./Reveal";
import { btnPrimary, inputClass, labelClass } from "./styles";

export default function ResumeUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a resume PDF to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDescription) formData.append("jobDescription", jobDescription);
      if (jobTitle) formData.append("jobTitle", jobTitle);
      if (companyName) formData.append("companyName", companyName);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const { data } = await response.json();
      router.push(`/dashboard/analysis/${data.analysisId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <Reveal className="w-full max-w-3xl mx-auto">
      <div className="border border-[#27272a] bg-[#09090b] rounded-2xl p-6 sm:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">New Resume Analysis</h2>
          <p className="text-sm text-[#a1a1aa] mt-2">
            Upload your resume and the target job description to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div>
            <label className={`${labelClass} mb-3 block`}>Resume (PDF)</label>
            <label
              className={`
                relative flex flex-col items-center justify-center w-full h-44 
                rounded-xl border-2 border-dashed transition-all cursor-pointer
                ${file ? "border-white bg-white/[0.04]" : "border-[#27272a] hover:border-zinc-700 bg-black"}
              `}
            >
              <div className="flex flex-col items-center justify-center text-center px-4">
                {file ? (
                  <>
                    <p className="mb-1 text-sm font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-[#a1a1aa]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to Analyze
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-1 text-sm font-semibold text-white">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-zinc-400">PDF documents only (Maximum 5MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="jobTitle" className={labelClass}>Target Job Title <span className="text-zinc-500 font-normal">(Optional)</span></label>
              <input
                id="jobTitle"
                type="text"
                className={inputClass}
                placeholder="e.g. Senior Frontend Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="companyName" className={labelClass}>Company Name <span className="text-zinc-500 font-normal">(Optional)</span></label>
              <input
                id="companyName"
                type="text"
                className={inputClass}
                placeholder="e.g. Google, Stripe"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="jobDescription" className={labelClass}>
              Job Description <span className="text-zinc-500 font-normal">(Optional, for match analysis)</span>
            </label>
            <textarea
              id="jobDescription"
              rows={5}
              className={`${inputClass} resize-y text-sm leading-relaxed`}
              placeholder="Paste the job description here to compare requirements against your resume..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-xl bg-rose-500/10 p-4 border border-rose-500/20 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`${btnPrimary} w-full py-3 text-sm`}
            disabled={loading || !file}
          >
            {loading ? "Analyzing Document..." : "Analyze Resume"}
          </button>
        </form>
      </div>
    </Reveal>
  );
}
