import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halal Batam | Autentikasi",
  description: "Masuk atau daftar untuk menggunakan sistem informasi destinasi halal.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-emerald-50 py-10">
      <div className="mx-auto w-full max-w-xl px-4">
        <div className="mb-6 flex items-center justify-between text-sm text-slate-700">
          <Link href="/" className="font-semibold text-slate-900 hover:text-emerald-700">
            ← Kembali ke Beranda
          </Link>
          <span className="text-slate-500">Halal Batam</span>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/80 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
