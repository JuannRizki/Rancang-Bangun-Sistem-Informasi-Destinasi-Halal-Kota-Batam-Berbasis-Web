"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getPhotoUrl(foto?: string | null): string {
  if (!foto) return "";
  return foto.startsWith("http") ? foto : `http://127.0.0.1:8000/storage/${foto}`;
}

export default function UmkmDestinasiTable() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/destinasi", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setBusinesses(data));
  }, []);

  const handleDelete = async (id: number) => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus usaha ini?");
    if (!isConfirm) return;

    // Optimistic UI: disable buttons if needed (keperluan UI tetap tidak diubah)


    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/destinasi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setBusinesses(businesses.filter((b) => b.id !== id));
      } else {
        alert("Gagal menghapus usaha");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-slate-50 text-xs uppercase tracking-[0.24em] text-slate-500">
          <tr>
            <th className="px-6 py-4">Foto</th>
            <th className="px-6 py-4">Nama Usaha</th>
            <th className="px-6 py-4">Kategori</th>
            <th className="px-6 py-4">Alamat</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
          {businesses.length > 0 ? (
            businesses.map((business: any) => (
              <tr
                key={business.id}
                className="hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  {getPhotoUrl(business.foto) ? (
                    <img
                      src={getPhotoUrl(business.foto) || ""}
                      alt={business.nama}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-500">
                      No Foto
                    </div>
                  )}
                </td>

                <td className="px-6 py-5 font-medium text-slate-950">
                  {business.nama}
                </td>

                <td className="px-6 py-5">
                  {business.kategori}
                </td>

                <td className="px-6 py-5">
                  {business.alamat}
                </td>

                <td className="px-6 py-5">
                  {business.status === 'pending' ? (
                    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 whitespace-nowrap">
                      Menunggu Persetujuan
                    </span>
                  ) : business.status === 'rejected' ? (
                    <div className="flex flex-col gap-1 items-start">
                      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 whitespace-nowrap">
                        Ditolak
                      </span>
                      {business.rejection_reason && (
                        <span className="text-[11px] text-red-600 mt-1 max-w-[150px] leading-tight">
                          Alasan: {business.rejection_reason}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                      Disetujui
                    </span>
                  )}
                </td>

                <td className="px-6 py-5">
                  {business.email}
                </td>

                <td className="px-6 py-5">
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/umkm/destinasi/${business.id}/edit`)}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(business.id)}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-red-600 hover:border-red-300 hover:bg-red-50"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center text-slate-500"
              >
                Belum ada data usaha
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}