import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/styles";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">AI Resume Analyzer</h1>
      <p className="mt-4 text-lg text-slate-600">
        Analyze your resume, identify skill gaps, and prepare for your next opportunity.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/signup" className={btnPrimary}>
          Get Started
        </Link>
        <Link href="/login" className={btnSecondary}>
          Login
        </Link>
      </div>
    </main>
  );
}
