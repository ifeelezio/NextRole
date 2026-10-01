import Link from "next/link";
import ResumeUpload from "@/components/ResumeUpload";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="text-sm text-slate-600 underline">
        Back to dashboard
      </Link>
      <h1 className="text-2xl font-semibold text-slate-900">Upload your resume</h1>
      <ResumeUpload />
    </div>
  );
}
