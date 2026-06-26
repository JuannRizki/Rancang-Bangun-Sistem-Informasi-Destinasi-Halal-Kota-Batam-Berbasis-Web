"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
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

export default function DestinasiDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [destinasi, setDestinasi] = useState<Destinasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    configureLeafletIcon();
  }, []);

  // Fetch destinasi detail
  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/destinasi-public/${id}`
        );
        if (!response.ok) throw new Error("Destinasi tidak ditemukan");
        const data = await response.json();
        setDestinasi(data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat detail destinasi");
        setLoading(false);
        console.error(err);
      }
    };

    fetchDestinasi();
  }, [id]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !destinasi || map.current) return;

    map.current = L.map(mapContainer.current).setView(
      [destinasi.latitude, destinasi.longitude],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map.current);

    L.marker([destinasi.latitude, destinasi.longitude], { icon: defaultIcon })
      .addTo(map.current)
      .bindPopup(destinasi.nama)
      .openPopup();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [destinasi]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600"></div>
          <p className="text-slate-600">Memuat detail destinasi...</p>
        </div>
      </div>
    );
  }

  if (error || !destinasi) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Gagal Memuat</h1>
          <p className="mt-2 text-red-600">{error}</p>
          <Link
            href="/map"
            className="mt-6 inline-block rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            ← Kembali ke Peta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/map"
            className="mb-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Kembali ke Peta
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            {destinasi.nama}
          </h1>
          <p className="mt-2 text-slate-600">{destinasi.kategori}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {getPhotoUrl(destinasi.foto) && (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={getPhotoUrl(destinasi.foto)!}
                  alt={destinasi.nama}
                  className="h-96 w-full object-cover"
                />
              </div>
            )}

            {/* Map */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div
                ref={mapContainer}
                className="h-96 w-full"
              />
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Tentang Tempat Ini
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {destinasi.deskripsi}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Hubungi Kami
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Telepon
                  </p>
                  <a
                    href={`tel:${destinasi.telepon}`}
                    className="mt-2 block rounded-2xl bg-emerald-50 p-3 text-center font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    📞 {destinasi.telepon}
                  </a>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Email
                  </p>
                  <a
                    href={`mailto:${destinasi.email}`}
                    className="mt-2 block rounded-2xl bg-blue-50 p-3 text-center font-semibold text-blue-700 transition hover:bg-blue-100 break-all text-sm"
                  >
                    ✉️ {destinasi.email}
                  </a>
                </div>

                {/* Google Maps */}
                <div>
                  <a
                    href={`https://www.google.com/maps?q=${destinasi.latitude},${destinasi.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-2xl bg-blue-600 p-3 text-center font-semibold text-white transition hover:bg-blue-700"
                  >
                    🗺️ Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Lokasi
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Alamat Lengkap
                  </p>
                  <p className="text-slate-700">{destinasi.alamat}</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Koordinat
                  </p>
                  <p className="text-slate-700 font-mono text-xs">
                    {destinasi.latitude.toFixed(4)}, {destinasi.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Kategori
              </p>
              <div className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                {destinasi.kategori}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white p-6 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-600">
            Apakah Anda pemilik tempat ini?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Login sebagai UMKM
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
