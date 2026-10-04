import AuthForm from "@/components/AuthForm";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-[#27272a] bg-[#09090b] relative z-10 flex flex-col items-center">
        <Logo />

        <div className="text-center mt-6 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="mt-1.5 text-xs text-[#a1a1aa]">
            Start building standout resumes with live preview.
          </p>
        </div>

        <AuthForm type="signup" />

        <p className="mt-8 text-center text-xs text-[#a1a1aa]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:underline underline-offset-4 transition-colors font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
