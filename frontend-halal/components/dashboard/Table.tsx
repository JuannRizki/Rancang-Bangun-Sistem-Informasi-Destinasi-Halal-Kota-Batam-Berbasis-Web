const recentDestinasi = [
  { nama: "Kuliner Selasar", kategori: "Kuliner Halal", status: "Aktif", tanggal: "12 Apr 2026" },
  { nama: "Hotel Batam View", kategori: "Akomodasi", status: "Verifikasi", tanggal: "10 Apr 2026" },
  { nama: "Travel Umroh Amanah", kategori: "Jasa & Layanan", status: "Aktif", tanggal: "08 Apr 2026" },
  { nama: "Rumah Makan Dapur Halal", kategori: "Kuliner Halal", status: "Aktif", tanggal: "05 Apr 2026" },
];

export default function Table() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Nama Destinasi</th>
            <th className="px-6 py-4 font-semibold">Kategori</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Tanggal Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {recentDestinasi.map((item) => (
            <tr key={item.nama} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-950">{item.nama}</td>
              <td className="px-6 py-4">{item.kategori}</td>
              <td className="px-6 py-4">{item.status}</td>
              <td className="px-6 py-4">{item.tanggal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
