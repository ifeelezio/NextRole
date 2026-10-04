import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";

/**
 * Floating Apple Liquid Glass Navbar
 * Detached pill/softly rounded control surface floating above the black workspace.
 */
export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Account";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    if (profile?.full_name) displayName = profile.full_name;
    else if (user.email) displayName = user.email.split("@")[0];
  }

  return (
    <div className="sticky top-3.5 z-50 w-full px-4 sm:px-6 pointer-events-none">
      <header className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-5 rounded-full liquid-glass-nav pointer-events-auto">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Logo />
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-xs font-medium text-[#a1a1aa] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/templates"
              className="text-xs font-medium text-[#a1a1aa] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#a1a1aa] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
            >
              My Resumes
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#a1a1aa] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/builder"
                className="bg-white text-black font-semibold px-3 py-1.5 rounded-full text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Create Resume
              </Link>
              <Link
                href="/dashboard"
                className="text-xs text-[#a1a1aa] hover:text-white max-w-[120px] truncate hidden md:inline-block px-2"
              >
                {displayName}
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-[#a1a1aa] hover:text-white px-3 py-1 rounded-full hover:bg-white/[0.06] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/builder"
                className="bg-white text-black font-semibold px-3.5 py-1.5 rounded-full text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Create Resume
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
