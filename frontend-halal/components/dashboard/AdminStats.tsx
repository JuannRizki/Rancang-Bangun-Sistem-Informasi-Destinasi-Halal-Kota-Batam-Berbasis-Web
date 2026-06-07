const stats = [
  { label: "Total Destinasi", value: "275", description: "Destinasi halal aktif" },
  { label: "UMKM Terdaftar", value: "102", description: "Pelaku usaha halal" },
  { label: "Kategori", value: "12", description: "Jenis destinasi" },
  { label: "Laporan Masuk", value: "24", description: "Permintaan validasi" },
];

export default function AdminStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
          <p className="mt-5 text-4xl font-semibold text-slate-950">{item.value}</p>
          <p className="mt-3 text-sm text-slate-600">{item.description}</p>
        </div>
      ))}
    </section>
  );
}
