import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string; compact?: boolean }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm font-semibold tracking-tight text-white select-none transition-opacity hover:opacity-80 uppercase"
      aria-label="Next Role home"
    >
      <span>Next Role</span>
    </Link>
  );
}
