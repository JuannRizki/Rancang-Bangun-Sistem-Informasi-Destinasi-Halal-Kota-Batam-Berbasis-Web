import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function AdminProfilPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 lg:p-10">
        <Header title="Profil Admin" description="Perbarui informasi akun dan kontak admin sistem." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-600">Halaman profil berfungsi untuk mengatur data admin dan kredensial login.</p>
        </div>
      </main>
    </div>
  );
}
