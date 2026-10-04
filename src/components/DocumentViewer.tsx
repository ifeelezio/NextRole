"use client";

import React, { useRef, useState, useEffect } from "react";
import { ResumeData } from "@/lib/types";
import ResumeDocument from "./ResumeDocument";

interface DocumentViewerProps {
  resume: ResumeData;
  className?: string;
  id?: string;
}

/**
 * Responsive proportional document scaler.
 * Renders the true 794px x 1123px A4 ResumeDocument and scales it via CSS transform
 * to perfectly fit any container without altering line wraps, font ratios, or layout.
 * Like Overleaf, it provides a pixel-faithful miniature of the actual printed document.
 */
export default function DocumentViewer({
  resume,
  className = "",
  id,
}: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / 794);
      }
    };

    computeScale();

    const ro = new ResizeObserver(() => {
      computeScale();
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[794/1123] overflow-hidden select-none bg-white rounded-sm shadow-md ${className}`}
    >
      <div
        style={{
          width: 794,
          height: 1123,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <ResumeDocument resume={resume} id={id || "resume-viewer-preview"} />
      </div>
    </div>
  );
}
