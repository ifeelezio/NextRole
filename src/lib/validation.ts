export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const PDF_MIME = "application/pdf";
export const RESUME_BUCKET = "resumes";

interface FileLike {
  name: string;
  type: string;
  size: number;
}

/** Returns an error message, or null when the file is acceptable. */
export function validatePdfFile(file: FileLike): string | null {
  if (file.size === 0) return "The file is empty.";
  if (file.size > MAX_FILE_SIZE) return "The file is too large. The maximum size is 5 MB.";
  if (file.type !== PDF_MIME) return "Only PDF files are allowed.";
  if (!file.name.toLowerCase().endsWith(".pdf")) return "The file must have a .pdf extension.";
  return null;
}

/** PDFs start with "%PDF-". Used server-side so the MIME type is not trusted alone. */
export function hasPdfSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 5) return false;
  return String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3], bytes[4]) === "%PDF-";
}
