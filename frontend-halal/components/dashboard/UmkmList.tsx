"use client";

import { useEffect, useState } from "react";

export default function UmkmList() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/destinasi", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setBusinesses(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-6 space-y-4">
      {businesses.length > 0 ? (
        businesses.map((business: any) => (
          <div
            key={business.id}
            className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600">
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
                <p className="text-lg font-semibold text-slate-950">
                  {business.nama}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {business.alamat}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm">
                <span className="text-slate-400">🏷️</span>
                {business.kategori}
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                Aktif
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
          Belum ada usaha yang ditambahkan
        </div>
      )}
    </div>
  );
}