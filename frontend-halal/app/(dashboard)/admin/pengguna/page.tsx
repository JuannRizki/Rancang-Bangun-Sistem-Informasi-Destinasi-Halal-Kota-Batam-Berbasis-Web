"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

type Pengguna = {
  id: number;
  nama: string;
  email: string;
  role: string;
  jumlah_destinasi: number;
  tanggal_registrasi: string | null;
};

function formatTanggal(dateStr: string | null) {
  if (!dateStr) return "-";

  const d = new Date(dateStr);

  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPenggunaPage() {
  const [data, setData] = useState<Pengguna[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/admin/pengguna", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((payload) => {
        setData(payload.data || []);
      })
      .catch(() => {
        setData([]);
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
        <Header
          title="Pengguna"
          description="Daftar akun UMKM yang terdaftar."
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Daftar Pengguna
            </p>

            <h2 className="text-2xl font-semibold text-slate-950">
              Semua UMKM
            </h2>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Memuat data...
            </p>
          ) : data.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Belum ada data pengguna.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nama</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">
                      Jumlah Destinasi
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Tanggal Registrasi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {data.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {u.nama}
                      </td>

                      <td className="px-6 py-4">{u.email}</td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {u.jumlah_destinasi}
                      </td>

                      <td className="px-6 py-4">
                        {formatTanggal(u.tanggal_registrasi)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}