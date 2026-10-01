import { extractText, getDocumentProxy } from "unpdf";
import { AppError } from "@/lib/errors";
import { MAX_FILE_SIZE, hasPdfSignature } from "@/lib/validation";

const MIN_TEXT_LENGTH = 50;
const MAX_TEXT_LENGTH = 50000;

/** Server-side only. Extracts the text of a PDF or throws a user-safe AppError. */
export async function extractPdfText(file: Blob): Promise<string> {
  if (file.size === 0) throw new AppError("The PDF is empty.", 400);
  if (file.size > MAX_FILE_SIZE) throw new AppError("The PDF is larger than 5 MB.", 400);

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasPdfSignature(bytes)) throw new AppError("The file is not a valid PDF.", 400);

  let text: string;
  try {
    const pdf = await getDocumentProxy(bytes);
    const result = await extractText(pdf, { mergePages: true });
    text = result.text;
  } catch {
    throw new AppError(
      "The PDF could not be read. It may be corrupted or password-protected.",
      422,
    );
  }

  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < MIN_TEXT_LENGTH) {
    throw new AppError(
      "No readable text was found in this PDF. Scanned image PDFs are not supported.",
      422,
    );
  }
  return cleaned.slice(0, MAX_TEXT_LENGTH);
}
