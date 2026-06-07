import Link from "next/link";
import UmkmHeader from "@/components/dashboard/UmkmHeader";
import UmkmSidebar from "@/components/dashboard/UmkmSidebar";
import UmkmDestinasiTable from "@/components/dashboard/UmkmDestinasiTable";

export default function UmkmDestinasiPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <UmkmSidebar />
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <UmkmHeader
          title="Kelola Data Usaha"
          description="Daftar semua usaha yang terdaftar"
          userName="UMKM User"
          status="Aktif"
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 gap-y-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                 Semua usaha yang telah ditambahkan
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Kelola Data Usaha
              </h2>
            </div>

            <Link
              href="/umkm/destinasi/tambah"
              className="inline-flex items-center gap-2 rounded-3xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/10 transition hover:bg-emerald-800"
            >
              <span className="text-base">＋</span>
              Tambah Usaha Baru
            </Link>
          </div>

          <UmkmDestinasiTable />
        </section>
      </main>
    </div>
  );
}