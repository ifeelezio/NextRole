import { scoreTone } from "./styles";

/** Circular 0-100 score gauge. */
export default function ScoreRing({
  score,
  size = 120,
  stroke = 10,
  label = true,
}: {
  score: number | null | undefined;
  size?: number;
  stroke?: number;
  label?: boolean;
}) {
  const s = score ?? 0;
  const tone = scoreTone(s);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = Math.max(0, Math.min(100, s));
  const offset = circumference * (1 - value / 100);

  // Derive a solid hex or css var for stroke color since we don't have .stroke token
  const strokeColor = s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";
  const labelText = s >= 80 ? "EXCELLENT" : s >= 60 ? "GOOD" : "NEEDS WORK";

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-[var(--ease-glass)]"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div
            className="font-semibold tracking-[-0.04em] text-fg tabular-nums"
            style={{ fontSize: Math.round(size * 0.3), lineHeight: 1 }}
          >
            {score ?? "–"}
          </div>
          {label && size >= 96 && (
            <div className={`mt-1 text-[11px] font-medium ${tone.text}`}>{labelText}</div>
          )}
        </div>
      </div>
      <span className="sr-only">Score {score ?? "unavailable"} out of 100</span>
    </div>
  );
}
