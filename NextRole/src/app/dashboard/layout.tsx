import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login"); // defense in depth; the middleware redirects first

  const fullName = user.user_metadata?.full_name;
  const displayName = (typeof fullName === "string" && fullName) || user.email || "Account";

  return (
    <div className="min-h-screen">
      <Navbar displayName={displayName} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
