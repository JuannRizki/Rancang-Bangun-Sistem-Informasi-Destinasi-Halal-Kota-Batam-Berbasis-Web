"use client";

import dynamic from "next/dynamic";

const MapContent = dynamic(
  () => import("@/components/public/MapContent"),
  { ssr: false, loading: () => <LoadingScreen /> }
);

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600"></div>
        <p className="text-slate-600">Memuat peta...</p>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <MapContent />
    </div>
  );
}
