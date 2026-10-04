"use client";

import Link from "next/link";
import ResumePreview from "@/components/ResumePreview";
import TemplateCard from "@/components/TemplateCard";
import { TEMPLATE_PREVIEWS } from "@/lib/default-resume";
import { ResumeLayout } from "@/lib/types";

export default function HomePage() {
  const templatesList: {
    layout: ResumeLayout;
    title: string;
    description: string;
  }[] = [
    {
      layout: "minimal",
      title: "Minimal",
      description: "Clean typography with generous whitespace and clear hierarchy.",
    },
    {
      layout: "modern",
      title: "Modern",
      description: "Clean layout with subtle accents and structured sections.",
    },
    {
      layout: "professional",
      title: "Professional",
      description: "Traditional corporate layout favored for finance, consulting, and management.",
    },
    {
      layout: "developer",
      title: "Developer",
      description: "Technical layout emphasizing technical stack, projects, and repositories.",
    },
    {
      layout: "creative",
      title: "Creative",
      description: "Two-column design separating contact and skills from career history.",
    },
    {
      layout: "executive",
      title: "Executive",
      description: "Structured layout highlighting strategic achievements and leadership scale.",
    },
  ];

  return (
    <div className="bg-black text-white selection:bg-zinc-800 selection:text-white">
      {/* HERO SECTION */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
              Build your resume.
            </h1>

            <p className="text-base sm:text-lg text-[#a1a1aa] max-w-lg leading-relaxed font-normal">
              Create a professional resume without fighting complicated tools. Clean typography, live preview, and effortless PDF export.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/builder"
                className="bg-white text-black font-semibold px-6 py-3 rounded-lg text-sm hover:bg-zinc-200 transition-colors text-center shadow-sm"
              >
                Create Resume
              </Link>
              <Link
                href="#templates"
                className="liquid-glass-control text-white border border-white/10 font-medium px-6 py-3 rounded-lg text-sm transition-colors text-center"
              >
                Explore Templates
              </Link>
            </div>
          </div>

          {/* Right Column: Realistic Clean White A4 Resume Preview */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px] rounded-lg overflow-hidden border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-white">
              <ResumePreview data={TEMPLATE_PREVIEWS.minimal} />
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES SHOWCASE SECTION */}
      <section id="templates" className="border-t border-white/[0.08] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Templates
            </h2>
            <p className="text-sm text-[#a1a1aa] mt-2">
              ATS-compatible templates designed with typographic clarity.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {templatesList.map((tpl) => (
              <TemplateCard
                key={tpl.layout}
                layout={tpl.layout}
                title={tpl.title}
                description={tpl.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / PRODUCT FEATURES */}
      <section className="border-t border-white/[0.08] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Simple by design
            </h2>
            <p className="text-sm text-[#a1a1aa] mt-2">
              Everything you need to craft, customize, and download your resume.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="liquid-glass-card rounded-2xl p-6 sm:p-7">
              <h3 className="text-base font-semibold text-white mb-2">Live Preview</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Watch your resume render in real time on an accurate A4 document. What you see is exactly what downloads.
              </p>
            </div>

            <div className="liquid-glass-card rounded-2xl p-6 sm:p-7">
              <h3 className="text-base font-semibold text-white mb-2">Clean PDF Export</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Download a crisp, vector-rendered PDF document. Compatible with any hiring portal and readable by ATS parsers.
              </p>
            </div>

            <div className="liquid-glass-card rounded-2xl p-6 sm:p-7">
              <h3 className="text-base font-semibold text-white mb-2">Automatic Saving</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Your edits are saved automatically as you type. Return anytime to duplicate, modify, or download your resumes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="border-t border-[#27272a] py-24 text-center">
        <div className="mx-auto max-w-2xl px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Ready to build your resume?
          </h2>
          <p className="text-sm text-[#a1a1aa]">
            Get started in seconds. No credit card required.
          </p>
          <div className="pt-2">
            <Link
              href="/builder"
              className="inline-flex bg-white text-black font-semibold px-8 py-3 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
