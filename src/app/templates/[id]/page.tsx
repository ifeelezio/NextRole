"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResumePreview from "@/components/ResumePreview";
import { TEMPLATE_PREVIEWS } from "@/lib/default-resume";
import { ResumeLayout } from "@/lib/types";

interface TemplateDetails {
  title: string;
  category: string;
  description: string;
  strengths: string[];
  bestFor: string;
}

const TEMPLATE_METADATA: Record<ResumeLayout, TemplateDetails> = {
  modern: {
    title: "Modern Executive",
    category: "Versatile / Tech & Business",
    description: "Features a subtle colored top strip and clean section dividers. Perfectly balances contemporary style with maximum ATS parsing accuracy.",
    strengths: [
      "Dynamic accent header strip",
      "Pill-badged skills section",
      "Optimized for standard 1 or 2 page layouts",
      "High ATS compatibility score",
    ],
    bestFor: "Software engineers, product managers, marketers, and operations professionals.",
  },
  minimal: {
    title: "Minimal Typographic",
    category: "Product & Strategy",
    description: "An understated, high-contrast design emphasizing generous whitespace and elegant grid alignment.",
    strengths: [
      "Editorial serif or sans typography",
      "Asymmetrical section balance",
      "Zero decorative fluff",
      "Timeless, dignified presentation",
    ],
    bestFor: "Designers, researchers, writers, consultants, and senior strategists.",
  },
  professional: {
    title: "Corporate Classic",
    category: "Finance & Advisory",
    description: "The time-tested gold standard format favored by traditional Fortune 500 corporations, management consulting firms, and Wall Street institutions.",
    strengths: [
      "Centered formal headline structure",
      "Prominent chronological job history",
      "Strict monochrome or navy styling",
      "Universally accepted by conservative hiring committees",
    ],
    bestFor: "Investment bankers, management consultants, accountants, and corporate lawyers.",
  },
  developer: {
    title: "Developer & Tech",
    category: "Software & Cloud",
    description: "Engineered specifically for software engineers, DevOps specialists, and technical leads with monospace details and prominent tech stack badges.",
    strengths: [
      "Monospace syntax-inspired styling",
      "Dedicated Technical Stack section",
      "Featured Open-Source / GitHub project links",
      "Clean bullet points with terminal vibe",
    ],
    bestFor: "Backend, frontend, and full-stack developers, cloud architects, and data engineers.",
  },
  creative: {
    title: "Designer Sidebar",
    category: "Creative & Brand",
    description: "A striking two-column asymmetrical layout featuring a dark contact and skills sidebar paired with a wide white content column.",
    strengths: [
      "Distinctive contact & skills sidebar",
      "Prominent initials / avatar badge",
      "Spacious experience cards",
      "Visual memorability in high-volume applicant pools",
    ],
    bestFor: "UI/UX designers, creative directors, brand strategists, and multimedia producers.",
  },
  executive: {
    title: "Executive Leadership",
    category: "Leadership & VP",
    description: "Crafted for senior leadership, C-suite executives, and VP candidates needing to showcase strategic governance and quantifiable business transformations.",
    strengths: [
      "Expansive Executive Profile section",
      "3-column Core Competencies grid",
      "Dignified serif typography",
      "Focus on leadership scale and revenue impact",
    ],
    bestFor: "CEOs, COOs, VPs, Directors, and senior executive board members.",
  },
};

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const layout = id as ResumeLayout;
  const meta = TEMPLATE_METADATA[layout];
  const sample = TEMPLATE_PREVIEWS[layout];

  if (!meta || !sample) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/templates"
          className="text-xs font-semibold text-[#a1a1aa] hover:text-white px-3 py-1 rounded-full liquid-glass-control inline-block transition-colors"
        >
          Back to Templates
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        {/* Left Column: Details & Actions */}
        <div className="lg:col-span-5 space-y-6 liquid-glass-panel rounded-2xl p-6 sm:p-8">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a1a1aa] liquid-glass px-3 py-1 rounded-full border border-white/10">
              {meta.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-4">
              {meta.title}
            </h1>
            <p className="text-sm text-[#a1a1aa] mt-3 leading-relaxed">
              {meta.description}
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <h2 className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-2">
              Best Suited For
            </h2>
            <p className="text-sm text-zinc-300">{meta.bestFor}</p>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <h2 className="text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-3">
              Key Features
            </h2>
            <ul className="space-y-2">
              {meta.strengths.map((str, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa]" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <Link
              href={`/builder?template=${layout}`}
              className="w-full inline-flex items-center justify-center bg-white text-black font-semibold px-6 py-3 rounded-lg text-sm hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
            >
              Use This Template
            </Link>
          </div>
        </div>

        {/* Right Column: Realistic Paper Document Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[560px] rounded-xl overflow-hidden border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] bg-white">
            <ResumePreview data={sample} />
          </div>
        </div>
      </div>
    </div>
  );
}
