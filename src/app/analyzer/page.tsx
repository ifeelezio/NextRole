import Link from "next/link";
import ResumeUpload from "@/components/ResumeUpload";

export default function UploadPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8">
      <Link href="/dashboard" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
        Back to Dashboard
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Upload and Analyze Existing Resume</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Upload an existing PDF to inspect ATS compatibility, keyword match, and bullet impact.
        </p>
      </div>
      <ResumeUpload />
    </div>
  );
}
