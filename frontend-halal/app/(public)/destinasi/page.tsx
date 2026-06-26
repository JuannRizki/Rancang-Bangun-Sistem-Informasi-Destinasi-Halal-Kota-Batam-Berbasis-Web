"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Destinasi {
  id: number;
  nama: string;
  kategori: string;
  alamat: string;
  latitude: number;
  longitude: number;
  telepon: string;
  email: string;
  deskripsi: string;
}

export default function DestinasiPage() {
  const [destinasi, setDestinasi] = useState<Destinasi[]>([]);
  const [filteredDestinasi, setFilteredDestinasi] = useState<Destinasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Kuliner",
    "Hotel",
    "Travel",
    "Kerajinan",
    "Lainnya",
  ];

  // Fetch destinasi
  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/destinasi-public");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setDestinasi(data);
        setFilteredDestinasi(data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data destinasi");
        setLoading(false);
        console.error(err);
      }
    };

    fetchDestinasi();
  }, []);

  // Filter destinasi
  useEffect(() => {
    let filtered = destinasi;

    if (search) {
      filtered = filtered.filter(
        (d) =>
          d.nama.toLowerCase().includes(search.toLowerCase()) ||
          d.alamat.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((d) => d.kategori === selectedCategory);
    }

    setFilteredDestinasi(filtered);
  }, [search, selectedCategory, destinasi]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600"></div>
          <p className="text-slate-600">Memuat data destinasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Destinasi Halal Batam
              </h1>
              <p className="mt-2 text-slate-600">
                Temukan destinasi halal terbaik di Kota Batam
              </p>
            </div>
            <Link
              href="/map"
              className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              🗺️ Lihat Peta
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl p-6 space-y-4 lg:space-y-0">
          {/* Search */}
          <input
            type="text"
            placeholder="Cari destinasi atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          {/* Category Filter */}
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Filter Kategori
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === ""
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {filteredDestinasi.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">
              Tidak ada destinasi yang sesuai dengan kriteria pencarian
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDestinasi.map((dest) => (
              <div
                key={dest.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg overflow-hidden"
              >
                {/* Category Badge */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                  <div className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                    {dest.kategori}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {dest.nama}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      📍 {dest.alamat}
                    </p>
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-2">
                    {dest.deskripsi}
                  </p>

                  <div className="space-y-2 border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">📞</span> {dest.telepon}
                    </p>
                    <p className="text-sm text-slate-600 break-all">
                      <span className="font-semibold">✉️</span> {dest.email}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Link
                      href={`/destinasi/${dest.id}`}
                      className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Lihat Detail
                    </Link>
                    <a
                      href={`https://www.google.com/maps?q=${dest.latitude},${dest.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-2xl border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Google Maps
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-10 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
          <p className="text-slate-700">
            Menampilkan <span className="font-bold">{filteredDestinasi.length}</span> dari{" "}
            <span className="font-bold">{destinasi.length}</span> destinasi
          </p>
        </div>
      </div>
    </div>
  );
}
