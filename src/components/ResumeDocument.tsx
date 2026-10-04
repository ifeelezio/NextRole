"use client";

import React from "react";
import { ResumeData } from "@/lib/types";
import {
  MinimalTemplate,
  ModernTemplate,
  ProfessionalTemplate,
  DeveloperTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
} from "./templates";

interface ResumeDocumentProps {
  resume: ResumeData;
  id?: string;
  className?: string;
}

/**
 * Single source of truth for rendering a complete, full-page A4 resume document.
 * Used identically for:
 * 1. Gallery previews (scaled down proportionally)
 * 2. Editor workspace preview
 * 3. PDF print / export
 */
export default function ResumeDocument({
  resume,
  id = "resume-document-to-print",
  className = "",
}: ResumeDocumentProps) {
  const layout = resume.settings?.template || "modern";
  const fontFamily = resume.settings?.fontFamily || "inter";
  const fontSize = resume.settings?.fontSize || "medium";
  const margins = resume.settings?.margins || "normal";

  const fontClass =
    fontFamily === "serif"
      ? "font-serif"
      : fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  const padMap = {
    compact: "24px",
    normal: "36px",
    spacious: "48px",
  };

  const gapMap = {
    compact: "10px",
    normal: "14px",
    spacious: "20px",
  };

  const sizeMap = {
    small: {
      name: "24px",
      title: "12px",
      sec: "10px",
      item: "11px",
      body: "10px",
      sub: "9.5px",
      lh: "1.45",
    },
    medium: {
      name: "28px",
      title: "13.5px",
      sec: "11px",
      item: "12px",
      body: "11px",
      sub: "10.5px",
      lh: "1.55",
    },
    large: {
      name: "32px",
      title: "15px",
      sec: "12.5px",
      item: "13.5px",
      body: "12px",
      sub: "11.5px",
      lh: "1.65",
    },
  };

  const currentSize = sizeMap[fontSize] || sizeMap.medium;

  const styleVariables = {
    width: 794,
    minHeight: 1123,
    "--resume-pad": padMap[margins] || padMap.normal,
    "--resume-gap": gapMap[margins] || gapMap.normal,
    "--rf-name": currentSize.name,
    "--rf-title": currentSize.title,
    "--rf-sec-heading": currentSize.sec,
    "--rf-item-title": currentSize.item,
    "--rf-body": currentSize.body,
    "--rf-sub": currentSize.sub,
    "--rf-line-height": currentSize.lh,
    fontFamily:
      fontFamily === "serif"
        ? "var(--font-serif)"
        : fontFamily === "mono"
        ? "var(--font-mono)"
        : "var(--font-sans)",
  } as React.CSSProperties;

  return (
    <div
      id={id}
      className={`resume-paper w-[794px] min-h-[1123px] bg-white text-[#18181b] relative select-none box-border ${fontClass} ${className}`}
      style={styleVariables}
    >
      {layout === "minimal" && <MinimalTemplate resume={resume} />}
      {layout === "modern" && <ModernTemplate resume={resume} />}
      {layout === "professional" && <ProfessionalTemplate resume={resume} />}
      {layout === "developer" && <DeveloperTemplate resume={resume} />}
      {layout === "creative" && <CreativeTemplate resume={resume} />}
      {layout === "executive" && <ExecutiveTemplate resume={resume} />}
    </div>
  );
}
