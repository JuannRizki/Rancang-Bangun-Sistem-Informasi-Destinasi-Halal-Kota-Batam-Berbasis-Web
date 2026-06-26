import Link from "next/link";

const items = [
  { label: "Dashboard", href: "/admin" },
  { label: "Destinasi", href: "/admin/destinasi" },
  { label: "UMKM", href: "/admin/umkm" },
  { label: "Kategori", href: "/admin/kategori" },
  { label: "Laporan", href: "/admin/laporan" },
  { label: "Profil", href: "/admin/profil" },
];

export default function Sidebar() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-8 flex items-center gap-3 rounded-3xl bg-emerald-600 px-4 py-5 text-white shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            🏙
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-100">
              Halal Batam
            </p>

            <h1 className="text-xl font-semibold">
              Dashboard Admin
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
  );
}