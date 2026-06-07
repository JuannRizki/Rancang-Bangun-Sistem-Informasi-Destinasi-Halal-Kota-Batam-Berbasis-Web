"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!email || !password) {
    setError("Email dan password wajib diisi.");
    return;
  }

  setError(null);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login gagal");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/umkm");
  } catch {
    setError("Tidak bisa terhubung ke server Laravel");
  }
}

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">Masuk</p>
        <h1 className="text-3xl font-semibold text-slate-950">Selamat datang kembali</h1>
        <p className="text-sm text-slate-500">
          Masukkan email dan password Anda untuk melanjutkan ke peta destinasi halal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        <input type="text" name="fakeusername" autoComplete="username" className="hidden" />
        <input type="password" name="fakepassword" autoComplete="new-password" className="hidden" />
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-2 shadow-sm focus-within:border-emerald-600">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z"></path>
                <path d="M22 6l-10 7L2 6"></path>
              </svg>
            </span>
            <input
              type="email"
              name="login-email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border-none bg-transparent pl-11 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="contoh@email.com"
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-2 shadow-sm focus-within:border-emerald-600">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              type="password"
              name="login-password"
              autoComplete="off"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border-none bg-transparent pl-11 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="••••••••"
              required
            />
          </div>
        </label>

        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Ingat saya
          </label>
          <Link href="/forgot-password" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-700 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Masuk
        </button>
      </form>

      <div className="text-center text-sm text-slate-600">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
