"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Table from "@/components/dashboard/Table";

export default function AdminLaporanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/admin/laporan", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((resData) => setData(resData.data || resData || []))
      .catch((err) => {
        console.error(err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 lg:p-10">
        <Header title="Laporan dan Statistik" description="Analisis performa destinasi dan feedback pengguna." />
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Daftar Laporan</p>
                <h2 className="text-2xl font-semibold text-slate-950">Semua Laporan</h2>
              </div>
              <button className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Buat Laporan Baru
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-slate-500 text-center py-8">Memuat data...</p>
            ) : (
              <Table items={data} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
