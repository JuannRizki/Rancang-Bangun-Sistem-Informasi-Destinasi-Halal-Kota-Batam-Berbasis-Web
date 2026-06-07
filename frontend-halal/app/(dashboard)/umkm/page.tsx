import UmkmHeader from "@/components/dashboard/UmkmHeader";
import UmkmSidebar from "@/components/dashboard/UmkmSidebar";
import UmkmStats from "@/components/dashboard/UmkmStats";
import UmkmList from "@/components/dashboard/UmkmList";

export default function UmkmDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <UmkmSidebar />
      </aside>
      <main className="flex-1 p-6 lg:p-10">
        <UmkmHeader userName="UMKM User" status="Aktif" />
        <div className="space-y-8">
          <UmkmStats />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Daftar Usaha Anda</h2>
                <p className="mt-2 text-sm text-slate-500">Lihat update usaha, jumlah pengunjung, dan status aktivasi.</p>
              </div>
            </div>
            <UmkmList />
          </section>
        </div>
      </main>
    </div>
  );
}
