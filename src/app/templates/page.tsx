"use client";

import { useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import { ResumeLayout } from "@/lib/types";

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>("all");

  const templates: {
    layout: ResumeLayout;
    title: string;
    category: string;
    description: string;
    tag: "tech" | "design" | "business" | "exec" | "all";
    featured?: boolean;
  }[] = [
    {
      layout: "modern",
      title: "Modern Executive",
      category: "All Industries",
      description: "Clean top accent stripe with structured section lines and highlighted skill tags.",
      tag: "business",
      featured: true,
    },
    {
      layout: "developer",
      title: "Developer & Tech",
      category: "Engineering & Cloud",
      description: "Monospace accents, highlighted tech stacks, open-source repos, and project links.",
      tag: "tech",
      featured: true,
    },
    {
      layout: "minimal",
      title: "Minimal Typographic",
      category: "Product & Strategy",
      description: "Generous whitespace, refined editorial typography, and pure typographic clarity.",
      tag: "design",
    },
    {
      layout: "creative",
      title: "Designer Sidebar",
      category: "Design & Brand",
      description: "Distinct two-column layout with dark contact sidebar and prominent portfolio showcase.",
      tag: "design",
    },
    {
      layout: "professional",
      title: "Corporate Classic",
      category: "Finance & Advisory",
      description: "Traditional single-column layout with horizontal rule dividers, favored by Wall Street and law firms.",
      tag: "business",
    },
    {
      layout: "executive",
      title: "Executive Leadership",
      category: "Leadership & VP",
      description: "Structured executive summary, core competencies grid, and quantifiable leadership milestones.",
      tag: "exec",
    },
  ];

  const filtered =
    filter === "all" ? templates : templates.filter((t) => t.tag === filter);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Resume Templates
        </h1>
        <p className="text-base text-[#a1a1aa] leading-relaxed">
          Crafted to meet the strictest standards of Applicant Tracking Systems (ATS) while delivering pristine editorial typography.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: "all", label: "All Templates" },
            { id: "tech", label: "Engineering" },
            { id: "design", label: "Design & Product" },
            { id: "business", label: "Business & Finance" },
            { id: "exec", label: "Executive" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                filter === cat.id
                  ? "bg-white text-black border-white shadow-sm"
                  : "liquid-glass-control text-[#a1a1aa] hover:text-white hover:border-white/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tpl) => (
          <TemplateCard
            key={tpl.layout}
            layout={tpl.layout}
            title={tpl.title}
            category={tpl.category}
            description={tpl.description}
            featured={tpl.featured}
          />
        ))}
      </div>
    </div>
  );
}
