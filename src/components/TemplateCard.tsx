"use client";

import Link from "next/link";
import { ResumeLayout } from "@/lib/types";
import { TEMPLATE_PREVIEWS } from "@/lib/default-resume";
import DocumentViewer from "./DocumentViewer";

interface TemplateCardProps {
  layout: ResumeLayout;
  title: string;
  description: string;
  category?: string;
  featured?: boolean;
}

export default function TemplateCard({
  layout,
  title,
  description,
}: TemplateCardProps) {
  const sampleData = TEMPLATE_PREVIEWS[layout];

  return (
    <div className="flex flex-col justify-between liquid-glass-card rounded-2xl p-4 sm:p-5">
      {/* Real Full A4 Document (Overleaf style) */}
      <Link
        href={`/templates/${layout}`}
        className="block relative w-full aspect-[210/297] rounded overflow-hidden border border-white/10 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.85)] bg-white transition-all hover:scale-[1.01]"
      >
        <DocumentViewer resume={sampleData} />
      </Link>

      {/* Meta & Action Underneath */}
      <div className="mt-5 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            {title}
          </h3>
          <p className="mt-1 text-xs text-[#a1a1aa] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <div className="pt-1 flex gap-2">
          <Link
            href={`/builder?template=${layout}`}
            className="flex-1 text-center bg-white text-black font-semibold py-2 rounded-lg text-xs hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Use Template
          </Link>
          <Link
            href={`/templates/${layout}`}
            className="px-3 text-center liquid-glass-control text-[#a1a1aa] border border-white/10 font-medium py-2 rounded-lg text-xs hover:text-white transition-colors"
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
