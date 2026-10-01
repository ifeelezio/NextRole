"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ErrorMessage from "./ErrorMessage";
import { btnDanger, btnSecondary } from "./styles";

export default function DeleteAnalysisButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  async function confirmDelete() {
    if (busy) return;
    setBusy(true);
    setError(null);
    // RLS guarantees this can only ever delete the signed-in user's own row.
    const { error: dbError } = await createClient().from("analyses").delete().eq("id", id);
    if (dbError) {
      setError("The analysis could not be deleted. Please try again.");
      setBusy(false);
      return;
    }
    setOpen(false);
    setBusy(false);
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnSecondary}>
        Delete
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${id}`}
            className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
          >
            <h2 id={`delete-title-${id}`} className="text-lg font-semibold text-slate-900">
              Delete this analysis?
            </h2>
            <p className="mt-2 text-sm text-slate-600">This permanently removes the analysis and cannot be undone.</p>
            <div className="mt-4">
              <ErrorMessage message={error} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} disabled={busy} className={btnSecondary} autoFocus>
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} disabled={busy} className={btnDanger}>
                {busy ? "Deleting..." : "Delete analysis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
