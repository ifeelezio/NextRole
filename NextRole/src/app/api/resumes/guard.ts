import { AppError } from "@/lib/errors";

/** Storage paths must live in the caller's own folder: <user_id>/<file>.pdf */
export function getOwnedPathGuard(userId: string, filePath: string): void {
  const valid =
    filePath.startsWith(`${userId}/`) &&
    !filePath.includes("..") &&
    filePath.toLowerCase().endsWith(".pdf");
  if (!valid) throw new AppError("Invalid file path.", 400);
}
