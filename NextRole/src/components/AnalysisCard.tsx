import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Analysis } from "@/types";
import DeleteAnalysisButton from "./DeleteAnalysisButton";
import { btnPrimary, cardClass } from "./styles";

type AnalysisCardData = Pick<Analysis, "id" | "score" | "skills" | "created_at">;

export default function AnalysisCard({ analysis }: { analysis: AnalysisCardData }) {
  const skillCount = Array.isArray(analysis.skills) ? analysis.skills.length : 0;
  return (
    <article className={cardClass}>
      <p className="text-3xl font-semibold text-slate-900">
        {analysis.score ?? "-"}
        <span className="text-base font-normal text-slate-500"> / 100</span>
      </p>
      <p className="mt-1 text-sm text-slate-600">{formatDate(analysis.created_at)}</p>
      <p className="text-sm text-slate-600">
        {skillCount} {skillCount === 1 ? "skill" : "skills"} detected
      </p>
      <div className="mt-4 flex gap-2">
        <Link href={`/dashboard/analysis/${analysis.id}`} className={btnPrimary}>
          View analysis
        </Link>
        <DeleteAnalysisButton id={analysis.id} />
      </div>
    </article>
  );
}
