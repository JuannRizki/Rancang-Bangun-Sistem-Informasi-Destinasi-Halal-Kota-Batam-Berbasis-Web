export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-10">
        <header className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-3xl bg-emerald-600 px-4 py-5 text-white shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <svg viewBox="0 0 32 32" className="h-10 w-10" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="10" fill="#0f9d58" />
                <path d="M16 8a5 5 0 0 0-5 5c0 3.4 5 10 5 10s5-6.6 5-10a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="#FFFFFF" />
                <circle cx="16" cy="13" r="1.2" fill="#EF4444" />
              </svg>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-100">Halal Batam</p>
              <h1 className="text-xl font-semibold">Destinasi Halal Kota Batam</h1>
            </div>
          </div>
          <nav className="flex items-center justify-end">
            <a href="/login" className="inline-flex items-center rounded-full border border-emerald-700 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
              Login
            </a>
          </nav>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              Sistem Informasi Geografis (GIS)
            </div>
            <div className="space-y-6">
              <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl lg:mx-0">
                Temukan Destinasi <span className="text-emerald-700">Halal</span> di Kota Batam
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl lg:mx-0">
                Jelajahi 275+ lokasi kuliner, akomodasi, dan jasa halal yang tersebar di seluruh Kota Batam.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <a href="/map" className="inline-flex items-center justify-center rounded-3xl bg-emerald-700 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800">
                <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700">
                  <svg viewBox="0 0 32 32" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="10" fill="#0f9d58" />
                    <path d="M16 8a5 5 0 0 0-5 5c0 3.4 5 10 5 10s5-6.6 5-10a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="#FFFFFF" />
                    <circle cx="16" cy="13" r="1.2" fill="#EF4444" />
                  </svg>
                </span>
                Buka Peta Lengkap
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-emerald-700">150+</p>
                <p className="mt-3 text-sm text-slate-600">Kuliner</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-sky-700">45+</p>
                <p className="mt-3 text-sm text-slate-600">Akomodasi</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-violet-700">80+</p>
                <p className="mt-3 text-sm text-slate-600">Jasa</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200 bg-slate-100 p-6 shadow-sm">
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-0 shadow-inner shadow-slate-200/40">
              <div className="relative h-[320px] w-full overflow-hidden rounded-[1.75rem] bg-slate-50">
                <img src="/barelang.jpg" alt="Barelang Bridge" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/30" />
                <div className="absolute left-5 bottom-5 right-5 rounded-[1.5rem] bg-slate-900/30 px-4 py-3 text-sm text-white shadow-lg shadow-slate-950/20 backdrop-blur-sm">
                  Jelajahi Destinasi Halal Kota Batam
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Kategori Destinasi</p>
            <h2 className="mt-4 text-4xl font-semibold text-slate-950">Temukan berbagai jenis destinasi halal yang Anda butuhkan</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-amber-50 p-8 shadow-sm">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 text-white">🍴</div>
              <h3 className="text-2xl font-semibold text-slate-950">Kuliner Halal</h3>
              <p className="mt-4 text-slate-600">Restoran, rumah makan, kafe, dan warung dengan sertifikasi halal.</p>
              <p className="mt-6 text-3xl font-bold text-orange-600">150+</p>
              <p className="text-sm text-slate-500">Lokasi tersedia</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-sky-50 p-8 shadow-sm">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-700 text-white">🏨</div>
              <h3 className="text-2xl font-semibold text-slate-950">Akomodasi</h3>
              <p className="mt-4 text-slate-600">Hotel, penginapan, dan guest house dengan fasilitas ramah muslim.</p>
              <p className="mt-6 text-3xl font-bold text-sky-700">45+</p>
              <p className="text-sm text-slate-500">Lokasi tersedia</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-violet-50 p-8 shadow-sm">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-700 text-white">🧳</div>
              <h3 className="text-2xl font-semibold text-slate-950">Jasa & Layanan</h3>
              <p className="mt-4 text-slate-600">Layanan keuangan syariah, travel umroh, dan jasa halal lainnya.</p>
              <p className="mt-6 text-3xl font-bold text-violet-700">80+</p>
              <p className="text-sm text-slate-500">Lokasi tersedia</p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Fitur Unggulan</p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-950">Kemudahan dalam menemukan destinasi halal</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Temukan lokasi halal dengan cepat lewat fitur peta interaktif, pencarian, filter kategori, dan detail lengkap.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
                <p className="font-semibold text-emerald-700">Peta Interaktif</p>
                <p className="mt-3 text-sm text-slate-600">Visualisasi lokasi dalam peta digital.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
                <p className="font-semibold text-emerald-700">Pencarian Cepat</p>
                <p className="mt-3 text-sm text-slate-600">Temukan lokasi dengan mudah.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
                <p className="font-semibold text-emerald-700">Filter Kategori</p>
                <p className="mt-3 text-sm text-slate-600">Sortir berdasarkan jenis usaha.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
                <p className="font-semibold text-emerald-700">Detail Lengkap</p>
                <p className="mt-3 text-sm text-slate-600">Informasi alamat, kontak, dan foto.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-emerald-700 px-8 py-12 text-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-200">Siap Menjelajahi Destinasi Halal?</p>
              <h2 className="mt-3 text-4xl font-semibold">Mulai temukan ribuan lokasi halal di sekitar Anda</h2>
            </div>
            <a href="/map" className="inline-flex items-center justify-center rounded-3xl bg-white px-8 py-4 text-base font-semibold text-emerald-700 transition hover:bg-slate-100">
              Buka Peta Sekarang
            </a>
          </div>
        </section>

        <footer className="mt-16 rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-10 text-slate-200">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <p className="text-xl font-semibold text-white">Halal Batam</p>
              <p className="mt-4 text-sm text-slate-400">Sistem Informasi Destinasi Halal berbasis GIS untuk Kota Batam.</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Navigasi</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white">Beranda</a></li>
                <li><a href="#map" className="hover:text-white">Peta</a></li>
                <li><a href="#" className="hover:text-white">Tentang</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Kontak</p>
              <p className="mt-4 text-sm text-slate-300">Kota Batam, Kepulauan Riau</p>
              <p className="mt-2 text-sm text-slate-300">Indonesia</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
