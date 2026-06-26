import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-600">
              🍽️ Halal Batam
            </h1>
            <div className="flex gap-4">
              <Link
                href="/destinasi"
                className="text-slate-700 hover:text-emerald-600 font-semibold"
              >
                Daftar Destinasi
              </Link>
              <Link
                href="/map"
                className="text-slate-700 hover:text-emerald-600 font-semibold"
              >
                Peta
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">
          Temukan Destinasi Halal Terbaik di Batam
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Jelajahi berbagai pilihan kuliner, hotel, dan wisata halal yang tersebar di seluruh Kota Batam
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/destinasi"
            className="rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700 shadow-lg"
          >
            Lihat Semua Destinasi
          </Link>
          <Link
            href="/map"
            className="rounded-2xl border-2 border-emerald-600 px-8 py-4 text-lg font-semibold text-emerald-600 transition hover:bg-emerald-50"
          >
            🗺️ Lihat Peta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Fitur Kami
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition">
            <div className="text-4xl mb-4">🗺️</div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Peta Interaktif
            </h4>
            <p className="text-slate-600">
              Lihat semua destinasi halal di peta interaktif dengan lokasi yang akurat
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔍</div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Cari & Filter
            </h4>
            <p className="text-slate-600">
              Cari destinasi berdasarkan kategori atau nama dengan mudah
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition">
            <div className="text-4xl mb-4">📱</div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Hubungi Langsung
            </h4>
            <p className="text-slate-600">
              Hubungi destinasi pilihan Anda melalui telepon atau email
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <div className="rounded-3xl border-2 border-emerald-600 bg-gradient-to-r from-emerald-50 to-slate-50 p-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Punya Usaha Halal?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Daftarkan usaha Anda sebagai UMKM dan tampilkan di peta Batam untuk menjangkau lebih banyak pelanggan
          </p>
          <Link
            href="/register"
            className="inline-block rounded-2xl bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700 shadow-lg"
          >
            Daftar Sebagai UMKM
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-slate-600">
          <p>© 2026 Halal Batam. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
