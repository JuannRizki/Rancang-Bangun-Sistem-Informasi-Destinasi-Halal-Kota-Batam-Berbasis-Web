"use client";

import { useState, useEffect } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

interface PengajuanData {
  id: number;
  foto: string;
  namaUsaha: string;
  pemilik: string;
  kategori: string;
  alamat: string;
  tanggal: string;
  status: string;
  deskripsi: string;
  kontak: string;
  lat: number;
  lng: number;
}

export default function AdminPengajuanPage() {
  const [data, setData] = useState<PengajuanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PengajuanData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/admin/destinasi/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((resData) => {
        // Response paginated Laravel memiliki data di dalam properti resData.data
        const items = resData.data || resData || [];
        
        // Sesuaikan field dari backend agar cocok dengan interface PengajuanData frontend
        const formattedData = items.map((item: any) => ({
          id: item.id,
          foto: item.foto 
            ? (item.foto.startsWith('http') ? item.foto : `http://127.0.0.1:8000/storage/${item.foto}`) 
            : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          namaUsaha: item.nama || "Tanpa Nama",
          pemilik: item.user?.name || "Tanpa Pemilik",
          kategori: item.kategori || "-",
          alamat: item.alamat || "-",
          tanggal: item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-",
          status: item.status || "pending",
          deskripsi: item.deskripsi || "-",
          kontak: item.telepon || "-",
          lat: item.latitude || 0,
          lng: item.longitude || 0,
        }));

        setData(formattedData);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const endpoint = `http://127.0.0.1:8000/api/admin/destinasi/${id}/approve`;
    console.log("Approve ID:", id);
    console.log("Endpoint:", endpoint);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      
      const resData = await response.json();
      console.log("Response:", resData);

      if (response.ok) {
        setData(data.filter((item) => item.id !== id));
        alert("Pengajuan berhasil disetujui!");
      } else {
        alert(resData.message || "Gagal menyetujui pengajuan.");
      }
    } catch (error) {
      console.error("Error approving destinasi:", error);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan harus diisi!");
      return;
    }
    
    if (!selectedItem) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const endpoint = `http://127.0.0.1:8000/api/admin/destinasi/${selectedItem.id}/reject`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ rejection_reason: rejectReason })
      });
      
      const resData = await response.json();

      if (response.ok) {
        setData(data.filter((item) => item.id !== selectedItem.id));
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedItem(null);
        alert("Pengajuan berhasil ditolak.");
      } else {
        alert(resData.message || "Gagal menolak pengajuan.");
      }
    } catch (error) {
      console.error("Error rejecting destinasi:", error);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-80 border-r border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 lg:p-10 relative">
        <Header title="Pengajuan Destinasi" description="Tinjau dan setujui pengajuan destinasi halal baru dari UMKM." />
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Daftar Pengajuan</p>
                <h2 className="text-2xl font-semibold text-slate-950">Menunggu Persetujuan</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Foto</th>
                    <th className="px-6 py-4 font-semibold">Nama Usaha</th>
                    <th className="px-6 py-4 font-semibold">Pemilik UMKM</th>
                    <th className="px-6 py-4 font-semibold">Kategori</th>
                    <th className="px-6 py-4 font-semibold">Alamat</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Tanggal Pengajuan</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">Memuat data...</td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500">Belum ada data pengajuan.</td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <img src={item.foto} alt={item.namaUsaha} className="h-12 w-12 rounded-xl object-cover" />
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-950">{item.namaUsaha}</td>
                        <td className="px-6 py-4">{item.pemilik}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item.kategori}</span>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate" title={item.alamat}>{item.alamat}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.tanggal}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">{item.status}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => { setSelectedItem(item); setShowDetailModal(true); }}
                              className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                            >
                              Detail
                            </button>
                            <button 
                              onClick={() => handleApprove(item.id)}
                              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 transition hover:bg-emerald-100"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => { setSelectedItem(item); setShowRejectModal(true); }}
                              className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-lg font-semibold text-slate-950">Detail Pengajuan: {selectedItem.namaUsaha}</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img src={selectedItem.foto} alt={selectedItem.namaUsaha} className="w-full sm:w-32 h-32 rounded-2xl object-cover shadow-sm" />
                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Usaha</span>
                    <p className="text-slate-900 font-semibold text-lg">{selectedItem.namaUsaha}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pemilik</span>
                      <p className="text-slate-900 text-sm mt-0.5">{selectedItem.pemilik}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kontak</span>
                      <p className="text-slate-900 text-sm mt-0.5">{selectedItem.kontak}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kategori</span>
                      <p className="text-slate-900 text-sm mt-0.5">{selectedItem.kategori}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tgl Pengajuan</span>
                      <p className="text-slate-900 text-sm mt-0.5">{selectedItem.tanggal}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Deskripsi</span>
                <p className="text-slate-700 text-sm mt-1 leading-relaxed">{selectedItem.deskripsi}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Alamat & Lokasi Map</span>
                <p className="text-slate-700 text-sm mt-1 mb-3">{selectedItem.alamat}</p>
                <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${selectedItem.lat},${selectedItem.lng}&z=15&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => { setShowDetailModal(false); setSelectedItem(selectedItem); setShowRejectModal(true); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 transition"
              >
                Reject Pengajuan
              </button>
              <button 
                onClick={() => { handleApprove(selectedItem.id); setShowDetailModal(false); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
              >
                Approve Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-rose-600">Tolak Pengajuan</h3>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Anda akan menolak pengajuan <strong>{selectedItem.namaUsaha}</strong>. Silakan masukkan alasan penolakan di bawah ini.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tuliskan alasan penolakan secara jelas..."
                className="w-full rounded-2xl border border-slate-200 p-4 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none resize-none min-h-[120px] transition-all bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleReject}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
