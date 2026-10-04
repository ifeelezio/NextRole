import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full px-6 py-8">
      {children}
    </div>
  );
}
