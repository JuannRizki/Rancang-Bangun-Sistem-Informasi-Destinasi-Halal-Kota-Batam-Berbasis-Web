import AdminStats from "@/components/dashboard/AdminStats";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Table from "@/components/dashboard/Table";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 lg:p-10">
        <Header />
        <div className="space-y-8">
          <AdminStats />
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Ringkasan Destinasi</p>
                <h2 className="text-2xl font-semibold text-slate-950">Destinasi Terbaru</h2>
              </div>
              <button className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Tambah Destinasi
              </button>
            </div>
            <Table />
          </section>
        </div>
      </main>
    </div>
  );
}
