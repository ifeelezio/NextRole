import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AppShell from "@/components/AppShell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: "Next Role — Build a resume that gets noticed",
  description:
    "Create a professional resume in minutes with Next Role. Beautiful templates, live preview, and effortless PDF export.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const footerElement = (
    <footer className="border-t border-white/[0.08] py-12 text-center text-xs text-[#a1a1aa]">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[#a1a1aa]">
          © {new Date().getFullYear()} Next Role. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-zinc-400">
          <Link href="/templates" className="hover:text-white transition-colors">
            Templates
          </Link>
          <Link href="/builder" className="hover:text-white transition-colors">
            Resume Builder
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );

  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#000000] text-white font-sans antialiased selection:bg-zinc-800 selection:text-white">
        <AppShell navbar={<Navbar />} footer={footerElement}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
