import type { ReactNode } from "react";
import AdminGuard from "@/components/dashboard/AdminGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto min-h-screen max-w-full overflow-hidden">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
