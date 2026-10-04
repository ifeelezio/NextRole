"use client";

import { ResumeData } from "@/lib/types";
import DocumentViewer from "./DocumentViewer";

interface ResumePreviewProps {
  data: ResumeData;
  className?: string;
  id?: string;
}

/**
 * Standard ResumePreview interface.
 * Delegates directly to DocumentViewer which renders the canonical A4 ResumeDocument
 * and scales it with vector fidelity into its container.
 */
export default function ResumePreview({
  data,
  className = "",
  id = "resume-preview-document",
}: ResumePreviewProps) {
  return <DocumentViewer resume={data} className={className} id={id} />;
}
