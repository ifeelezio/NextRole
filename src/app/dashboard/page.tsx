"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResumeData, ResumeLayout } from "@/lib/types";
import ResumeCard from "@/components/ResumeCard";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("there");
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Check Supabase auth
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name.split(" ")[0]);
          } else if (user.email) {
            setUserName(user.email.split("@")[0]);
          }
        }
      } catch (err) {
        console.error("Auth error", err);
      }

      // 2. Load resumes from localStorage
      try {
        const savedList = localStorage.getItem("user_resumes_list");
        if (savedList) {
          const parsed = JSON.parse(savedList);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResumes(parsed);
            setLoading(false);
            return;
          }
        }

        const active = localStorage.getItem("resume_builder_active");
        if (active) {
          const parsed = JSON.parse(active);
          if (parsed.personalInfo) {
            setResumes([parsed]);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Could not load resumes", err);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const handleDuplicate = (id: string) => {
    const target = resumes.find((r) => r.id === id);
    if (!target) return;

    const duplicated: ResumeData = {
      ...target,
      id: "res-" + Date.now(),
      title: `${target.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };

    const nextList = [duplicated, ...resumes];
    setResumes(nextList);
    localStorage.setItem("user_resumes_list", JSON.stringify(nextList));
  };

  const handleDelete = (id: string) => {
    const nextList = resumes.filter((r) => r.id !== id);
    setResumes(nextList);
    localStorage.setItem("user_resumes_list", JSON.stringify(nextList));

    const active = localStorage.getItem("resume_builder_active");
    if (active) {
      try {
        const parsed = JSON.parse(active);
        if (parsed.id === id) {
          localStorage.removeItem("resume_builder_active");
        }
      } catch {
        // ignore
      }
    }
  };

  const handleDownload = (resume: ResumeData) => {
    localStorage.setItem("resume_builder_active", JSON.stringify(resume));
    window.location.href = `/builder?id=${resume.id || "current"}`;
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm text-[#a1a1aa] mt-1">
            Welcome back, {userName}. Manage your resumes and create new documents.
          </p>
        </div>

        <Link
          href="/builder"
          className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-xs hover:bg-zinc-200 transition-colors shadow-sm self-start sm:self-auto"
        >
          Create Resume
        </Link>
      </div>

      {/* RESUMES LIST */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Your resumes
          </h2>
          {resumes.length > 0 && (
            <span className="text-xs text-[#71717a]">
              {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[380px] rounded-2xl liquid-glass-card animate-pulse"
              />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          /* EMPTY STATE */
          <div className="liquid-glass-card rounded-2xl p-12 text-center max-w-xl mx-auto my-6">
            <h3 className="text-lg font-semibold text-white mb-2">You haven&apos;t created a resume yet</h3>
            <p className="text-xs text-[#a1a1aa] mb-6 leading-relaxed">
              Create your first resume with realistic templates and live preview.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/builder"
                className="bg-white text-black font-semibold px-4 py-2 rounded-lg text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Create Resume
              </Link>
              <Link
                href="/templates"
                className="liquid-glass-control text-white border border-white/10 px-4 py-2 rounded-lg text-xs hover:text-white transition-colors"
              >
                Explore Templates
              </Link>
            </div>
          </div>
        ) : (
          /* RESUME GRID */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id || Math.random().toString()}
                resume={resume}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      {/* QUICK TEMPLATES SECTION */}
      <div className="pt-8 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Start from a template
          </h2>
          <Link href="/templates" className="text-xs text-[#a1a1aa] hover:text-white transition-colors">
            All templates
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(["minimal", "modern", "professional", "developer", "creative", "executive"] as ResumeLayout[]).map(
            (tpl) => (
              <Link
                key={tpl}
                href={`/builder?template=${tpl}`}
                className="liquid-glass-card rounded-xl p-3 text-center transition-all block"
              >
                <span className="block text-xs font-semibold text-white capitalize">
                  {tpl}
                </span>
                <span className="block text-[11px] text-[#71717a] mt-1">Use Template</span>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
