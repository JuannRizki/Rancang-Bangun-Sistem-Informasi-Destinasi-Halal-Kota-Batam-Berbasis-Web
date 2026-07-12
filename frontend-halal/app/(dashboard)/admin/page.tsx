"use client";

import { useEffect, useState } from "react";
import AdminStats from "@/components/dashboard/AdminStats";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Table from "@/components/dashboard/Table";

type DashboardStat = {
  label: string;
  value: string;
  description: string;
};

type RecentDestinasiItem = {
  id?: number;
  nama: string;
  kategori: string;
  status: string;
  tanggal: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStat[] | null>(null);
  const [recentDestinasi, setRecentDestinasi] = useState<RecentDestinasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan.");
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal memuat data admin.");
        }
        return response.json();
      })
      .then((data) => {
        setStats([
          { label: "Total Destinasi", value: (data?.total_destinasi ?? 0).toString(), description: "Destinasi halal aktif" },
          { label: "UMKM Terdaftar", value: (data?.total_umkm ?? 0).toString(), description: "Pelaku usaha halal" },
          { label: "Kategori", value: (data?.total_kategori ?? 0).toString(), description: "Jenis destinasi" },
          { label: "Laporan Masuk", value: (data?.total_laporan ?? 0).toString(), description: "Permintaan validasi" },
        ]);
        setRecentDestinasi(data?.recent_destinasi || []);
      })
      .catch((err) => {
        console.error(err);
        setStats([
          { label: "Total Destinasi", value: "0", description: "Destinasi halal aktif" },
          { label: "UMKM Terdaftar", value: "0", description: "Pelaku usaha halal" },
          { label: "Kategori", value: "0", description: "Jenis destinasi" },
          { label: "Laporan Masuk", value: "0", description: "Permintaan validasi" },
        ]);
        setRecentDestinasi([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 lg:p-10">
        <Header />
        <div className="space-y-8">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">Memuat data dashboard...</div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">{error}</div>
          ) : (
            <AdminStats stats={stats ?? undefined} />
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Ringkasan Destinasi</p>
                <h2 className="text-2xl font-semibold text-slate-950">Destinasi Terbaru</h2>
              </div>

            </div>
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">Memuat daftar destinasi terbaru...</div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
            ) : (
              <Table items={recentDestinasi} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
