import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar({ displayName }: { displayName: string }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="text-base font-semibold text-slate-900">
          AI Resume Analyzer
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[16rem] truncate text-sm text-slate-600 sm:inline">{displayName}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
