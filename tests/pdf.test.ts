import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { extractPdfText } from "@/lib/pdf";

describe("extractPdfText", () => {
  it("rejects empty files", async () => {
    await expect(extractPdfText(new Blob([]))).rejects.toBeInstanceOf(AppError);
  });

  it("rejects files that are not PDFs", async () => {
    await expect(extractPdfText(new Blob(["just some text, not a pdf"]))).rejects.toMatchObject({
      status: 400,
    });
  });

  it("rejects corrupted PDFs with a user-safe error", async () => {
    await expect(extractPdfText(new Blob(["%PDF-1.4 this is garbage"]))).rejects.toMatchObject({
      status: 422,
    });
  });
});
