"use client";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20 px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-xl text-emerald-50">
            Sistem Informasi Destinasi Halal Kota Batam Berbasis Web
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-8 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-8">
          <h2 className="text-3xl font-bold mb-4">Visi & Misi</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-emerald-600">Visi</h3>
            <p className="text-slate-700 leading-relaxed">
              Menjadi platform informasi destinasi halal terpercaya di Kota Batam yang membantu 
              wisatawan menemukan pengalaman wisata yang sesuai dengan nilai-nilai halal mereka.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-emerald-600">Misi</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Menyediakan informasi lengkap tentang destinasi wisata halal di Batam</li>
              <li>Memudahkan wisatawan menemukan UMKM dan usaha halal di Kota Batam</li>
              <li>Mendukung pertumbuhan ekonomi bisnis halal di Kota Batam</li>
              <li>Meningkatkan kesadaran tentang pentingnya halal dalam industri pariwisata</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-3xl font-bold mb-6">Tentang Platform</h2>
          
          <p className="text-slate-700 leading-relaxed mb-4">
            Sistem Informasi Destinasi Halal Kota Batam adalah platform digital yang dirancang 
            khusus untuk membantu wisatawan menemukan destinasi, restoran, hotel, dan usaha 
            lainnya yang menyediakan layanan sesuai dengan nilai halal.
          </p>

          <p className="text-slate-700 leading-relaxed mb-4">
            Dengan fitur pencarian lokasi real-time, peta interaktif, dan ulasan dari pengguna, 
            kami memudahkan Anda menemukan tempat yang sempurna untuk dinikmati bersama keluarga.
          </p>

          <p className="text-slate-700 leading-relaxed">
            Kami berkomitmen untuk terus mengembangkan platform ini agar semakin baik dan membantu 
            mengangkat potensi wisata halal di Kota Batam.
          </p>
        </div>
      </div>
    </div>
  );
}
