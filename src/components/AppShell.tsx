"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AppShellProps {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

/**
 * AppShell manages page-level chrome.
 * It removes the global floating Navbar and footer on full-bleed focused studio
 * routes like /builder, allowing the workspace to occupy 100vh of screen space.
 */
export default function AppShell({ navbar, footer, children }: AppShellProps) {
  const pathname = usePathname();
  const isBuilder = pathname === "/builder" || pathname.startsWith("/builder/");

  if (isBuilder) {
    return (
      <main className="flex-1 h-screen w-full overflow-hidden bg-black">
        {children}
      </main>
    );
  }

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
