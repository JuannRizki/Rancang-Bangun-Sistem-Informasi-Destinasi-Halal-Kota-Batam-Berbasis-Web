const stats = [
  { label: "Total Usaha", value: "2", description: "Total usaha terdaftar", accent: "emerald" },
  { label: "Aktif", value: "2", description: "Usaha yang aktif", accent: "sky" },
  { label: "Menunggu", value: "0", description: "Permintaan validasi", accent: "amber" },
  { label: "Total Views", value: "2.090", description: "Kunjungan peta", accent: "violet" },
];

const accentClasses: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  sky: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
};

export default function UmkmStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className={`inline-flex rounded-3xl px-3 py-2 text-xs font-semibold ${accentClasses[stat.accent]}`}>
            {stat.label}
          </div>
          <p className="mt-5 text-4xl font-semibold text-slate-950">{stat.value}</p>
          <p className="mt-3 text-sm text-slate-600">{stat.description}</p>
        </div>
      ))}
    </section>
  );
}
