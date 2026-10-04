// Strict Monochrome Design Tokens: White on Black

const btnBase =
  "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30 select-none text-center cursor-pointer rounded-lg";

// Buttons
export const btnPrimary = `${btnBase} px-4 py-2 text-sm bg-white text-black font-semibold hover:bg-zinc-200 active:bg-zinc-300`;
export const btnSecondary = `${btnBase} px-4 py-2 text-sm bg-black text-white border border-[#27272a] hover:bg-[#111113] hover:border-[#3f3f46]`;
export const btnGhost = `${btnBase} px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-white hover:bg-[#18181b]`;
export const btnDanger = `${btnBase} px-3 py-1.5 text-xs bg-[#18181b] text-zinc-300 hover:text-white border border-[#27272a] hover:border-red-900`;

// Inputs & Labels
export const inputClass =
  "surface-input block w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#52525b] focus:outline-none";
export const labelClass =
  "block text-xs font-medium uppercase tracking-wider text-[#a1a1aa] mb-1.5 select-none";

// Surfaces & Cards
export const cardClass =
  "surface-card rounded-xl p-6";
export const panelClass =
  "surface-panel rounded-xl p-6";

export function scoreTone(score: number): { text: string; bg: string; border: string } {
  if (score >= 80) return { text: "text-white", bg: "bg-zinc-900", border: "border-zinc-700" };
  if (score >= 60) return { text: "text-zinc-300", bg: "bg-zinc-900", border: "border-zinc-800" };
  return { text: "text-zinc-400", bg: "bg-zinc-900", border: "border-zinc-800" };
}
