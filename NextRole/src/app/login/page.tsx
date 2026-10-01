import AuthForm from "@/components/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError =
    error === "confirmation_failed"
      ? "Email confirmation failed. Try logging in, or sign up again."
      : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <AuthForm mode="login" initialError={initialError} />
    </main>
  );
}
