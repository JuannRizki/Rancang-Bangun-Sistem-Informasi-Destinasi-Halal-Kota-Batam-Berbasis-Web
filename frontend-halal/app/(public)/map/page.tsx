"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { configureLeafletIcon, defaultIcon } from "@/lib/leaflet";

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
  foto?: string | null;
}

const getPhotoUrl = (foto?: string | null) => {
  if (!foto) return null;
  return foto.startsWith("http") ? foto : `/storage/${foto}`;
};

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [destinasi, setDestinasi] = useState<Destinasi[]>([]);
  const [selectedDestinasi, setSelectedDestinasi] = useState<Destinasi | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  // Get unique categories
  const categories = Array.from(new Set(destinasi.map((d) => d.kategori))).sort();

  // Filter destinasi berdasarkan kategori
  const filteredDestinasi = selectedCategory
    ? destinasi.filter((d) => d.kategori === selectedCategory)
    : destinasi;

  useEffect(() => {
    configureLeafletIcon();
  }, []);

  // Fetch destinasi data
  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/destinasi-public");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setDestinasi(data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data destinasi");
        setLoading(false);
        console.error(err);
      }
    };

    fetchDestinasi();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || loading) return;

    map.current = L.map(mapContainer.current).setView([1.1291, 104.7313], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map.current);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [loading]);

  // Update markers on filtered destinasi change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => {
      map.current?.removeLayer(marker);
    });
    markersRef.current = {};

    // Add markers for filtered destinasi
    filteredDestinasi.forEach((dest) => {
      const lat = typeof dest.latitude === 'string' ? parseFloat(dest.latitude) : dest.latitude;
      const lng = typeof dest.longitude === 'string' ? parseFloat(dest.longitude) : dest.longitude;
      const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map.current!);
      marker.on("click", () => {
        setSelectedDestinasi(dest);
      });

      // Add popup
      marker.bindPopup(`
        <div class="text-sm">
          <h3 class="font-bold">${dest.nama}</h3>
          <p class="text-xs text-gray-600">${dest.kategori}</p>
        </div>
      `);

      markersRef.current[dest.id] = marker;
    });
  }, [filteredDestinasi]);

  // Clear selected destinasi if not in filtered list
  useEffect(() => {
    if (selectedDestinasi && !filteredDestinasi.find((d) => d.id === selectedDestinasi.id)) {
      setSelectedDestinasi(null);
    }
  }, [selectedCategory, filteredDestinasi, selectedDestinasi]);

  // Center map on selected destinasi
  useEffect(() => {
    if (selectedDestinasi && map.current) {
      map.current.setView(
        [selectedDestinasi.latitude, selectedDestinasi.longitude],
        15
      );
      markersRef.current[selectedDestinasi.id]?.openPopup();
    }
  }, [selectedDestinasi]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600"></div>
          <p className="text-slate-600">Memuat data destinasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-96 flex flex-col border-r border-slate-200 bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Peta Destinasi Halal Batam</h1>
          <p className="mt-1 text-emerald-100 text-sm">
            {filteredDestinasi.length} dari {destinasi.length} destinasi
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="border-b border-slate-200 px-4 py-4">
          <p className="text-xs font-semibold text-slate-600 uppercase mb-3">Filter Kategori</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-2 rounded-full text-xs font-semibold transition ${
                selectedCategory === null
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Semua ({destinasi.length})
            </button>
            {categories.map((cat) => {
              const count = destinasi.filter((d) => d.kategori === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search/List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {error ? (
            <div className="rounded-2xl bg-red-50 p-4 text-red-600 text-sm">
              {error}
            </div>
          ) : filteredDestinasi.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-slate-600 text-sm text-center">
              Belum ada destinasi di kategori ini
            </div>
          ) : (
            filteredDestinasi.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestinasi(dest)}
                className={`w-full text-left rounded-2xl p-4 transition ${
                  selectedDestinasi?.id === dest.id
                    ? "bg-emerald-100 border-2 border-emerald-600"
                    : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {getPhotoUrl(dest.foto) && (
                  <div className="mb-4 overflow-hidden rounded-3xl border border-slate-200">
                    <img
                      src={getPhotoUrl(dest.foto)!}
                      alt={dest.nama}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-slate-900">{dest.nama}</h3>
                <p className="text-xs text-slate-500 mt-1">{dest.kategori}</p>
                <p className="text-xs text-slate-600 mt-1">{dest.alamat}</p>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <Link
            href="/"
            className="block text-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 flex flex-col relative">
        <div
          ref={mapContainer}
          className="flex-1"
        />

        {/* Detail Panel */}
        {selectedDestinasi && (
          <div className="absolute bottom-6 right-6 w-96 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-h-96 overflow-y-auto">
            <button
              onClick={() => setSelectedDestinasi(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            {getPhotoUrl(selectedDestinasi.foto) && (
              <div className="mb-4 overflow-hidden rounded-3xl">
                <img
                  src={getPhotoUrl(selectedDestinasi.foto)!}
                  alt={selectedDestinasi.nama}
                  className="h-44 w-full object-cover"
                />
              </div>
            )}

            <h2 className="text-xl font-bold text-slate-900">
              {selectedDestinasi.nama}
            </h2>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Kategori
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedDestinasi.kategori}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Alamat
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedDestinasi.alamat}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Telepon
                </p>
                <a
                  href={`tel:${selectedDestinasi.telepon}`}
                  className="mt-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  {selectedDestinasi.telepon}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Email
                </p>
                <a
                  href={`mailto:${selectedDestinasi.email}`}
                  className="mt-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 break-all"
                >
                  {selectedDestinasi.email}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Deskripsi
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedDestinasi.deskripsi}
                </p>
              </div>

              <div className="pt-4">
                <a
                  href={`https://www.google.com/maps?q=${selectedDestinasi.latitude},${selectedDestinasi.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-2xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
