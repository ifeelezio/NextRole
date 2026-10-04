"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassInput, GlassButton } from "./GlassComponents";

interface AuthFormProps {
  type: "login" | "signup";
  initialError?: string;
}

export default function AuthForm({ type, initialError }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const isSignup = type === "signup";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("fullName") ?? "").trim();

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const supabase = createClient();
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) return setError(signUpError.message);
        if (!data.session) {
          setNotice("Confirmation link sent to your email. Confirm then log in.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) return setError(signInError.message);
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
      {isSignup && (
        <GlassInput
          label="Full Name"
          name="fullName"
          id="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="e.g. Alex Rivera"
          disabled={loading}
        />
      )}

      <GlassInput
        label="Email Address"
        name="email"
        id="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        disabled={loading}
      />

      <div>
        <GlassInput
          label="Password"
          name="password"
          id="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={isSignup ? 8 : undefined}
          required
          placeholder="••••••••"
          disabled={loading}
        />
        {isSignup && (
          <p className="text-[11px] text-zinc-400 mt-1">Minimum 8 characters.</p>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300 font-medium leading-relaxed">
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300 font-medium leading-relaxed">
          {notice}
        </div>
      )}

      <div className="pt-2">
        <GlassButton
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
        </GlassButton>
      </div>
    </form>
  );
}
