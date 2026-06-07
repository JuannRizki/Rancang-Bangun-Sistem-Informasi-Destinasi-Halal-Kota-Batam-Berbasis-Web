type UmkmHeaderProps = {
  title?: string;
  description?: string;
  userName?: string;
  status?: string;
};

export default function UmkmHeader({
  title = "Dashboard UMKM",
  description = "Ringkasan data usaha Anda",
  userName = "UMKM User",
  status = "Aktif",
}: UmkmHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">Halo, {userName}</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
      </div>
      <div className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">UM</div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Profil UMKM</p>
          <p className="text-xs text-slate-500">Status akun: {status}</p>
        </div>
      </div>
    </header>
  );
}
