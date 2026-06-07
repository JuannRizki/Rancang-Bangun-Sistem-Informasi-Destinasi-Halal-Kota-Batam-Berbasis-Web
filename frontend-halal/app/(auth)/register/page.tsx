"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    setError("Semua field wajib diisi.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Password dan konfirmasi password tidak cocok.");
    return;
  }

  setError(null);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Registrasi gagal");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/login");
  } catch {
    setError("Tidak bisa terhubung ke server Laravel");
  }
}

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">Daftar</p>
        <h1 className="text-3xl font-semibold text-slate-950">Buat akun baru</h1>
        <p className="text-sm text-slate-500">
          Daftar untuk mengakses destinasi halal, menandai lokasi favorit, dan mendapatkan rekomendasi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Nama Lengkap</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="Nama lengkap"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="register-email"
            autoComplete="off"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="contoh@email.com"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="register-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="••••••••"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Konfirmasi Password</span>
          <input
            type="password"
            name="register-confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            placeholder="Ulangi password"
            required
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-700 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Daftar
        </button>
      </form>

      <div className="text-center text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Masuk sekarang
        </Link>
      </div>
    </div>
  );
}
