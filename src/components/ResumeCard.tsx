"use client";

import Link from "next/link";
import { ResumeData } from "@/lib/types";
import DocumentViewer from "./DocumentViewer";

interface ResumeCardProps {
  resume: ResumeData;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (resume: ResumeData) => void;
}

export default function ResumeCard({
  resume,
  onDuplicate,
  onDelete,
  onDownload,
}: ResumeCardProps) {
  const templateName = resume.settings?.template || "modern";
  const updatedDate = resume.updatedAt
    ? new Date(resume.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="flex flex-col justify-between liquid-glass-card rounded-2xl p-4 sm:p-5">
      {/* Real Document Thumbnail */}
      <Link
        href={`/builder?id=${resume.id || "current"}`}
        className="relative aspect-[210/297] w-full overflow-hidden rounded border border-white/10 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.85)] bg-white block transition-all hover:scale-[1.01]"
      >
        <DocumentViewer resume={resume} />
      </Link>

      {/* Info */}
      <div className="mt-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/builder?id=${resume.id || "current"}`}
              className="text-sm font-semibold text-white tracking-tight hover:underline line-clamp-1"
            >
              {resume.title || "Untitled Resume"}
            </Link>
            <span className="text-[11px] text-[#a1a1aa] uppercase tracking-wider shrink-0 capitalize">
              {templateName}
            </span>
          </div>

          <p className="mt-1 text-xs text-[#71717a]">
            Edited {updatedDate}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
          <Link
            href={`/builder?id=${resume.id || "current"}`}
            className="text-xs font-semibold text-black bg-white px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Edit
          </Link>

          <div className="flex items-center gap-1.5">
            {onDownload && (
              <button
                onClick={() => onDownload(resume)}
                className="text-xs text-[#a1a1aa] hover:text-white px-2 py-1 rounded liquid-glass-control transition-colors cursor-pointer"
              >
                PDF
              </button>
            )}

            {onDuplicate && resume.id && (
              <button
                onClick={() => onDuplicate(resume.id!)}
                className="text-xs text-[#a1a1aa] hover:text-white px-2 py-1 rounded liquid-glass-control transition-colors cursor-pointer"
              >
                Duplicate
              </button>
            )}

            {onDelete && resume.id && (
              <button
                onClick={() => onDelete(resume.id!)}
                className="text-xs text-[#a1a1aa] hover:text-red-400 px-2 py-1 rounded liquid-glass-control transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
