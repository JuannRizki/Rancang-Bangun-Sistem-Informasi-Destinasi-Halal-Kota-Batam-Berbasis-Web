import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function AdminKategoriPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 lg:p-10">
        <Header title="Kelola Kategori" description="Buat dan atur kategori destinasi halal di Batam." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">Gunakan halaman ini untuk menambah kategori baru dan mengelola kategori yang ada.</p>
        </div>
      </main>
    </div>
  );
}
