"use client";

import ScoreRing from "./ScoreRing";
import Reveal from "./Reveal";
import { cardClass } from "./styles";

type AnalysisType = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keyword_matches: string[];
  missing_keywords: string[];
};

export default function AnalysisCard({ analysis }: { analysis: Record<string, unknown> }) {
  let parsedAnalysis: AnalysisType | null = null;
  try {
    if (typeof analysis.analysis_result === "string") {
      parsedAnalysis = JSON.parse(analysis.analysis_result) as AnalysisType;
    } else if (analysis.analysis_result) {
      parsedAnalysis = analysis.analysis_result as AnalysisType;
    }
  } catch (e) {
    console.error("Failed to parse analysis result", e);
  }

  if (!parsedAnalysis) {
    return (
      <div className="glass-panel p-8 text-center text-rose-400">
        <p className="font-semibold">Failed to load analysis data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Reveal>
         <div className="border border-[#27272a] bg-[#09090b] rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-white">
            <div className="shrink-0 flex flex-col items-center">
              <ScoreRing score={parsedAnalysis.score} />
              <span className="text-xs font-semibold text-[#a1a1aa] mt-4 uppercase tracking-widest">ATS Match</span>
            </div>
            <div className="text-center md:text-left flex-1">
               <h2 className="text-2xl font-bold text-white mb-3">Analysis Complete</h2>
               <p className="text-zinc-300 leading-relaxed text-sm">
                 {parsedAnalysis.summary}
               </p>
            </div>
         </div>
      </Reveal>

      {/* Two Column Grid */}
      <div className="grid gap-6 md:grid-cols-2">
         {/* Strengths */}
         <Reveal delay={0.1}>
            <div className={`${cardClass} h-full`}>
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.06]">
                  <h3 className="font-semibold text-white text-lg">Key Strengths</h3>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Positive</span>
               </div>
               <ul className="space-y-4">
                  {parsedAnalysis.strengths?.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300 items-start">
                       <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                       <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
         </Reveal>

         {/* Weaknesses */}
         <Reveal delay={0.2}>
            <div className={`${cardClass} h-full`}>
               <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.06]">
                  <h3 className="font-semibold text-white text-lg">Areas to Improve</h3>
                  <span className="text-xs uppercase tracking-wider text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Action Required</span>
               </div>
               <ul className="space-y-4">
                  {parsedAnalysis.weaknesses?.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300 items-start">
                       <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                       <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
         </Reveal>
      </div>

      {/* Keywords & Recommendations */}
      <div className="grid gap-6 md:grid-cols-3">
          {/* Recommendations (Takes up 2 columns) */}
         <Reveal delay={0.3} className="md:col-span-2">
            <div className={`${cardClass} h-full`}>
               <div className="mb-6 pb-2 border-b border-white/[0.06]">
                  <h3 className="font-semibold text-white text-lg">Actionable Recommendations</h3>
               </div>
               <ul className="space-y-4">
                  {parsedAnalysis.recommendations?.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-200 p-4 rounded-xl border border-[#27272a] bg-[#111113] leading-relaxed">
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
         </Reveal>

         {/* Keywords */}
         <Reveal delay={0.4} className="md:col-span-1">
             <div className={`${cardClass} h-full flex flex-col gap-6`}>
               <div>
                  <h3 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider text-zinc-400">Matched Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                     {parsedAnalysis.keyword_matches?.length > 0 ? (
                        parsedAnalysis.keyword_matches.map((kw, i) => (
                          <span key={i} className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                            {kw}
                          </span>
                        ))
                     ) : (
                        <span className="text-xs text-zinc-400">No matched keywords</span>
                     )}
                  </div>
               </div>

               <div>
                  <h3 className="font-semibold text-white text-xs mb-3 uppercase tracking-wider text-zinc-400">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                     {parsedAnalysis.missing_keywords?.length > 0 ? (
                        parsedAnalysis.missing_keywords.map((kw, i) => (
                          <span key={i} className="inline-flex items-center rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
                            {kw}
                          </span>
                        ))
                     ) : (
                        <span className="text-xs text-zinc-400">No missing keywords</span>
                     )}
                  </div>
               </div>
            </div>
         </Reveal>
      </div>
    </div>
  );
}
