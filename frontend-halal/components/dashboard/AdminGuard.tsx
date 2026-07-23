"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {5
      router.replace("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthenticated");
        }
        return res.json();
      })
      .then((data) => {
        if (data.role !== "admin") {
          router.replace("/umkm");
        }
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 text-slate-700 shadow-sm">
          Memeriksa hak akses administrator...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
