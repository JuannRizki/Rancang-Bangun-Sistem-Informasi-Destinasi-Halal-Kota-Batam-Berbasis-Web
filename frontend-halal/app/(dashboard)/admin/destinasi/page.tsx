"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

type DestinasiItem = {
  id: number;
  nama: string;
  kategori: string;
  alamat: string;
  latitude: number | string | null;
  longitude: number | string | null;
  telepon: string | null;
  email: string | null;
  deskripsi: string | null;
  foto: string | null;
  status: string;
  rejection_reason?: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
};

type EditForm = {
  nama: string;
  kategori: string;
  alamat: string;
  latitude: string;
  longitude: string;
  telepon: string;
  email: string;
  deskripsi: string;
};

function formatTanggal(dateStr: any) {
  const d = dateStr ? new Date(dateStr) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function getStatusBadge(status?: string | null) {
  const normalized = (status ?? "").toLowerCase();

  if (normalized === "approved") {
    return {
      label: "Aktif",
      className: "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap",
    };
  }

  if (normalized === "pending") {
    return {
      label: "Menunggu",
      className: "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 whitespace-nowrap",
    };
  }

  if (normalized === "rejected") {
    return {
      label: "Ditolak",
      className: "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 whitespace-nowrap",
    };
  }

  return {
    label: status ?? "-",
    className: "inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap",
  };
}

function getPhotoUrl(foto?: string | null) {
  if (!foto) return "";
  return foto.startsWith("http") ? foto : `http://127.0.0.1:8000/storage/${foto}`;
}

export default function AdminDestinasiPage() {
  const [items, setItems] = useState<DestinasiItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<DestinasiItem | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const [editForm, setEditForm] = useState<EditForm>({
    nama: "",
    kategori: "",
    alamat: "",
    latitude: "1.1291",
    longitude: "104.7313",
    telepon: "",
    email: "",
    deskripsi: "",
  });

  const kategoriOptions = useMemo(
    () => [
      "Kuliner",
      "Hotel",
      "Travel",
      "Kerajinan",
      "Lainnya",
    ],
    []
  );

  const fetchItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/destinasi", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        setItems([]);
        return;
      }

      const resData = await res.json();
      const raw = resData?.data ?? resData ?? [];

      setItems(raw);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetail = (item: DestinasiItem) => {
    setActiveItem(item);
    setDetailOpen(true);
  };

  const openEdit = (item: DestinasiItem) => {
    setActiveItem(item);
    setEditOpen(true);

    setPhotoFile(null);
    setPhotoPreview(getPhotoUrl(item.foto));

    setEditForm({
      nama: item.nama ?? "",
      kategori: item.kategori ?? "",
      alamat: item.alamat ?? "",
      latitude:
        item.latitude !== null && item.latitude !== undefined
          ? String(item.latitude)
          : "1.1291",
      longitude:
        item.longitude !== null && item.longitude !== undefined
          ? String(item.longitude)
          : "104.7313",
      telepon: item.telepon ?? "",
      email: item.email ?? "",
      deskripsi: item.deskripsi ?? "",
    });
  };

  const closeModals = () => {
    setDetailOpen(false);
    setEditOpen(false);
    setActiveItem(null);
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Apakah Anda yakin ingin menghapus destinasi ini?");
    if (!ok) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/destinasi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        alert("Gagal menghapus destinasi");
        return;
      }

      setItems((prev) => prev.filter((x) => x.id !== id));
      // Tutup modal detail jika sedang dibuka
      setDetailOpen(false);
      setEditOpen(false);
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("nama", editForm.nama);
    formData.append("kategori", editForm.kategori);
    formData.append("alamat", editForm.alamat);
    formData.append("latitude", editForm.latitude);
    formData.append("longitude", editForm.longitude);
    formData.append("telepon", editForm.telepon);
    formData.append("email", editForm.email);
    formData.append("deskripsi", editForm.deskripsi);
    formData.append("_method", "PUT");

    if (photoFile) {
      formData.append("foto", photoFile);
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/destinasi/${activeItem.id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(payload?.message || "Gagal menyimpan perubahan");
        return;
      }

      setEditOpen(false);
      setActiveItem(null);
      await fetchItems();
      alert("Perubahan berhasil disimpan.");
    } catch (err) {
      console.error(err);
      alert("Gagal konek ke backend");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <Header
          title="Kelola Destinasi"
          description="Pengelolaan destinasi yang sudah disetujui." 
        />

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Daftar Destinasi
                </p>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Semua Destinasi
                </h2>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Memuat data...
              </p>
            ) : items.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-12">
                Belum ada data.
              </p>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Foto</th>
                      <th className="px-6 py-4 font-semibold">
                        Nama Destinasi
                      </th>
                      <th className="px-6 py-4 font-semibold">
                        Pemilik UMKM
                      </th>
                      <th className="px-6 py-4 font-semibold">Kategori</th>
                      <th className="px-6 py-4 font-semibold">Alamat</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">
                        Tanggal Update
                      </th>
                      <th className="px-6 py-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {items.map((item) => {
                      const badge = getStatusBadge(item.status);
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50 align-top"
                        >
                          <td className="px-6 py-5">
                            {item.foto ? (
                              <img
                                src={getPhotoUrl(item.foto)}
                                alt={item.nama}
                                className="h-14 w-14 rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-500">
                                No
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-5 font-medium text-slate-950">
                            {item.nama}
                          </td>

                          <td className="px-6 py-5 text-slate-700">
                            {item.user?.name || "-"}
                          </td>

                          <td className="px-6 py-5">{item.kategori}</td>

                          <td className="px-6 py-5 max-w-[260px]">
                            <div className="truncate">
                              {item.alamat}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className={badge.className}>{badge.label}</span>
                            {item.status === "rejected" &&
                              item.rejection_reason && (
                                <div className="mt-1 text-[11px] text-red-600">
                                  Alasan: {item.rejection_reason}
                                </div>
                              )}
                          </td>

                          <td className="px-6 py-5">
                            {formatTanggal(item.updated_at ?? item.created_at)}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex gap-3">
                              <button
                                onClick={() => openDetail(item)}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                              >
                                Detail
                              </button>

                              <button
                                onClick={() => openEdit(item)}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(item.id)}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-red-600 hover:border-red-300 hover:bg-red-50"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Detail Modal */}
        {detailOpen && activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Detail Destinasi
                  </h3>
                  <p className="text-sm text-slate-500">
                    {activeItem.nama}
                  </p>
                </div>
                <button
                  onClick={closeModals}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
              </div>

              <div className="max-h-[75vh] overflow-auto px-6 py-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="w-full md:w-52">
                    {activeItem.foto ? (
                      <img
                        src={getPhotoUrl(activeItem.foto)}
                        alt={activeItem.nama}
                        className="h-52 w-52 max-w-full rounded-3xl object-cover"
                      />
                    ) : (
                      <div className="flex h-52 w-52 max-w-full items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                        No Foto
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Nama Pemilik
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {activeItem.user?.name || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Kategori
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {activeItem.kategori || "-"}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Alamat
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {activeItem.alamat || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Latitude
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {activeItem.latitude ?? "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Longitude
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {activeItem.longitude ?? "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Nomor Telepon
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {activeItem.telepon || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Email
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {activeItem.email || "-"}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Deskripsi
                        </div>
                        <div className="mt-1 text-slate-950 font-medium whitespace-pre-line">
                          {activeItem.deskripsi || "-"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Tanggal dibuat
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {formatTanggal(activeItem.created_at)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Tanggal diupdate
                        </div>
                        <div className="mt-1 text-slate-950 font-medium">
                          {formatTanggal(activeItem.updated_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button
                  onClick={() => openEdit(activeItem)}
                  className="rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={closeModals}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editOpen && activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    Edit Destinasi
                  </h3>
                  <p className="text-sm text-slate-500">
                    {activeItem.nama}
                  </p>
                </div>
                <button
                  onClick={closeModals}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="max-h-[75vh] overflow-auto px-6 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Foto Destinasi
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
                    />

                    {photoPreview && (
                      <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Pratinjau Foto
                        </p>
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="max-h-60 w-full rounded-3xl object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-1">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nama Destinasi
                        </label>
                        <input
                          name="nama"
                          value={editForm.nama}
                          onChange={handleEditChange}
                          required
                          className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Kategori
                        </label>
                        <select
                          name="kategori"
                          value={editForm.kategori}
                          onChange={handleEditChange}
                          required
                          className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        >
                          <option value="">Pilih kategori</option>
                          {kategoriOptions.map((k) => (
                            <option key={k} value={k}>
                              {k}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Alamat
                        </label>
                        <textarea
                          name="alamat"
                          value={editForm.alamat}
                          onChange={handleEditChange}
                          required
                          rows={3}
                          className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Latitude
                          </label>
                          <input
                            name="latitude"
                            value={editForm.latitude}
                            onChange={handleEditChange}
                            required
                            className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Longitude
                          </label>
                          <input
                            name="longitude"
                            value={editForm.longitude}
                            onChange={handleEditChange}
                            required
                            className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Telepon
                          </label>
                          <input
                            name="telepon"
                            value={editForm.telepon}
                            onChange={handleEditChange}
                            className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                          </label>
                          <input
                            name="email"
                            value={editForm.email}
                            onChange={handleEditChange}
                            type="email"
                            className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Deskripsi
                        </label>
                        <textarea
                          name="deskripsi"
                          value={editForm.deskripsi}
                          onChange={handleEditChange}
                          required
                          rows={4}
                          className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-200 pt-6">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

