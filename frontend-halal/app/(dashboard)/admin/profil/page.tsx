"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

type ProfilAdmin = {
  id: number;
  nama: string;
  email: string;
  role: string;
};

export default function AdminProfilPage() {
  const [profil, setProfil] = useState<ProfilAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");

  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [passwordKonfirmasi, setPasswordKonfirmasi] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/admin/profil", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : { data: null }))
      .then((payload) => {
        const p = payload?.data;
        if (!p) return;
        setProfil(p);
        setNama(p.nama ?? "");
        setEmail(p.email ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token || !profil) return;

    const wantsChangePassword =
      passwordLama.trim() !== "" ||
      passwordBaru.trim() !== "" ||
      passwordKonfirmasi.trim() !== "";

    if (wantsChangePassword) {
      if (!passwordLama.trim()) return setError("Password lama wajib diisi.");
      if (!passwordBaru.trim()) return setError("Password baru wajib diisi.");
      if (!passwordKonfirmasi.trim())
        return setError("Konfirmasi password wajib diisi.");
      if (passwordBaru.length < 8)
        return setError("Password baru minimal 8 karakter.");
      if (passwordBaru !== passwordKonfirmasi)
        return setError("Konfirmasi password harus sama.");
    }

    setSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/profil", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nama,
          email,
          ...(wantsChangePassword
            ? {
                password_lama: passwordLama,
                password_baru: passwordBaru,
                password_konfirmasi: passwordKonfirmasi,
              }
            : {}),
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload?.message || "Gagal menyimpan perubahan.");
        return;
      }

      alert(payload?.message || "Profil berhasil diperbarui.");
      setPasswordLama("");
      setPasswordBaru("");
      setPasswordKonfirmasi("");
    } catch (err) {
      setError("Gagal konek ke backend.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profil) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <p className="text-slate-500">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <Header
          title="Profil Admin"
          description="Perbarui informasi akun dan kontak admin sistem."
        />

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm max-w-2xl">
            <div className="flex items-center gap-6 mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-md">
                AB
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {profil.nama || "Admin"}
                </h2>
                <p className="text-slate-500">{profil.email}</p>
                <span className="inline-block mt-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                  Super Admin
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={
                    profil.role === "admin" ? "Administrator" : profil.role
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 text-slate-500"
                  disabled
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-950 mb-2">
                  Ubah Password (opsional)
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password Lama
                    </label>
                    <input
                      type="password"
                      value={passwordLama}
                      onChange={(e) => setPasswordLama(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={passwordBaru}
                      onChange={(e) => setPasswordBaru(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      value={passwordKonfirmasi}
                      onChange={(e) => setPasswordKonfirmasi(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="mt-2 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

