import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto min-h-screen max-w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
