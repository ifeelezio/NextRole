"use client";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import type { ResumeData } from "./types";

/**
 * High-fidelity client-side PDF export for Next Role resumes.
 * Captures the true 794px x 1123px physical A4 document with 2x retina
 * rasterization and compiles a pixel-perfect, downloadable A4 PDF.
 */
export async function exportResumeToPdf(
  resume: ResumeData,
  onProgress?: (message: string) => void,
): Promise<void> {
  // 1. Wait for web fonts and typography to be completely ready (with safety timeout)
  onProgress?.("Loading typography assets...");
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch {
      // Continue if browser does not support fonts.ready or times out
    }
  }

  const targetId = "resume-pdf-export-target";
  let target = document.getElementById(targetId);

  // If dedicated target is not found, fallback to any rendered paper
  if (!target) {
    target =
      document.getElementById("resume-document-to-print") ||
      document.querySelector(".resume-paper");
  }

  if (!target) {
    throw new Error("Resume document element could not be located for PDF generation.");
  }

  onProgress?.("Rendering high-resolution vector canvas...");

  const targetWidth = 794;
  const targetHeight = Math.max(target.scrollHeight, target.offsetHeight, 1123);

  // Capture canvas with 2x scale for crisp font outlines and sharp line rendering
  const canvas = await html2canvas(target as HTMLElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: targetWidth,
    height: targetHeight,
    windowWidth: targetWidth,
    windowHeight: targetHeight,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      const clonedTarget = clonedDoc.getElementById(targetId);
      if (clonedTarget) {
        clonedTarget.style.position = "fixed";
        clonedTarget.style.left = "0px";
        clonedTarget.style.top = "0px";
        clonedTarget.style.zIndex = "999999";
        clonedTarget.style.opacity = "1";
        clonedTarget.style.visibility = "visible";
        clonedTarget.style.display = "block";
        clonedTarget.style.width = "794px";
        clonedTarget.style.backgroundColor = "#ffffff";
      }
    },
  });

  onProgress?.("Compiling standard A4 document...");

  // Standard A4 dimensions in millimeters: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Use PNG for lossless text clarity without JPEG compression halos
  const imgData = canvas.toDataURL("image/png");
  const pdfWidth = 210;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  const pageHeight = 297;

  // Single-page or multi-page handling
  if (pdfHeight <= pageHeight + 2) {
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  } else {
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 2) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }
  }

  // Clean filename: e.g. "Alex_Rivera_Resume.pdf"
  const rawName =
    resume.personalInfo?.fullName?.trim() || resume.title?.trim() || "Resume";
  const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_");
  const fileName = `${cleanName}_Resume.pdf`;

  onProgress?.("Saving PDF file...");
  pdf.save(fileName);
}
