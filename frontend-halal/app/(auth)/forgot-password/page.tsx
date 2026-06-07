"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSent(true);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">Lupa Password</p>
        <h1 className="text-3xl font-semibold text-slate-950">Reset kata sandi Anda</h1>
        <p className="text-sm text-slate-500">
          Masukkan email terdaftar, kami akan mengirimkan instruksi untuk membuat password baru.
        </p>
      </div>

      {sent ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
          Instruksi reset password telah dikirim ke <strong>{email}</strong>. Silakan cek inbox Anda.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="forgot-email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              placeholder="contoh@email.com"
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-700 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Kirim Instruksi
          </button>
        </form>
      )}

      <div className="text-center text-sm text-slate-600">
        <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
          Kembali ke halaman login
        </Link>
      </div>
    </div>
  );
}
