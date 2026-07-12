"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UMKMProfile {
  id: number;
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
  kategori: string;
  deskripsi: string;
  foto?: string;
}

export default function ProfilUMKMPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UMKMProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");

  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [passwordKonfirmasi, setPasswordKonfirmasi] = useState("");

  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await fetch("http://127.0.0.1:8000/api/umkm/profil", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });


        if (response.ok) {
          const data = await response.json();
          setProfile(data.data);
          setNama(data.data?.nama ?? "");
          setEmail(data.data?.email ?? "");
        } else {
          setError("Gagal memuat profil");
        }

      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal terhubung ke server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <p>Memuat profil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <p className="text-red-500">{error || "Profil tidak ditemukan"}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!profile) return;

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
      const token = localStorage.getItem("token");
      if (!token) return setError("Sesi login tidak ditemukan.");

      const res = await fetch("http://127.0.0.1:8000/api/umkm/profil", {
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
                password_baru_confirmation: passwordKonfirmasi,
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

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profil UMKM</h1>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nama
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
          </div>
        </div>
      </div>
    </div>
  );
}

