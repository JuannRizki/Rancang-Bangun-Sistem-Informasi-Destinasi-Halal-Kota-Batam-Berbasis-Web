"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const items = [
  { label: "Dashboard", href: "/umkm" },
  { label: "Kelola Data", href: "/umkm/destinasi" },
];

export default function UmkmSidebar() {
  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading...",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          name: data.name,
          email: data.email,
        });
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-8">
        <div>
          <div className="mb-8 flex items-center gap-3 rounded-3xl bg-emerald-600 px-4 py-5 text-white shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <svg
                viewBox="0 0 32 32"
                className="h-10 w-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="10" fill="#0f9d58" />
                <path
                  d="M16 8a5 5 0 0 0-5 5c0 3.4 5 10 5 10s5-6.6 5-10a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
                  fill="#FFFFFF"
                />
                <circle cx="16" cy="13" r="1.2" fill="#EF4444" />
              </svg>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-100">
                Halal Batam
              </p>

              <h1 className="text-xl font-semibold">
                Portal UMKM
              </h1>
            </div>
          </div>

          <nav className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
            {user.name.charAt(0)}
          </div>

          <div>
            <p className="font-medium text-slate-900">
              {user.name}
            </p>

            <p className="text-sm text-slate-500">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}