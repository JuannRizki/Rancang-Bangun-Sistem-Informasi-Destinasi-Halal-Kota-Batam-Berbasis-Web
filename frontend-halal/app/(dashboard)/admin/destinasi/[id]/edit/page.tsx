"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import MapPicker from "@/components/dashboard/MapPicker";

export default function EditDestinasiPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    alamat: "",
    latitude: "1.1291",
    longitude: "104.7313",
    telepon: "",
    email: "",
    deskripsi: "",
  });
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    const fetchDestinasiData = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/destinasi/${id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setForm({
            nama: data.data.nama || "",
            kategori: data.data.kategori || "",
            alamat: data.data.alamat || "",
            latitude: data.data.latitude?.toString() || "1.1291",
            longitude: data.data.longitude?.toString() || "104.7313",
            telepon: data.data.telepon || "",
            email: data.data.email || "",
            deskripsi: data.data.deskripsi || "",
          });
          if (data.data.foto) {
            setPhotoPreview(`http://127.0.0.1:8000/storage/${data.data.foto}`);
          }
        }
      } catch (error) {
        console.error("Error fetching destinasi:", error);
        alert("Gagal memuat data destinasi");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestinasiData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleLocationSelect = (
    latitude: number,
    longitude: number,
    alamat: string
  ) => {
    setForm({
      ...form,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      alamat: alamat,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("nama", form.nama);
    formData.append("kategori", form.kategori);
    formData.append("alamat", form.alamat);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);
    formData.append("telepon", form.telepon);
    formData.append("email", form.email);
    formData.append("deskripsi", form.deskripsi);
    if (photoFile) {
      formData.append("foto", photoFile);
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/destinasi/${id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Berhasil update destinasi");
        router.push("/admin/destinasi");
      } else {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      alert("Gagal konek ke backend");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-2xl font-semibold">Edit Destinasi</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Usaha <span className="text-red-500">*</span>
              </label>
              <input
                name="nama"
                placeholder="Contoh: Warung Makan Halal"
                value={form.nama}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={form.kategori}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">Pilih kategori</option>
                <option>Kuliner</option>
                <option>Hotel</option>
                <option>Travel</option>
                <option>Kerajinan</option>
                <option>Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              name="alamat"
              placeholder="Alamat lengkap usaha Anda"
              value={form.alamat}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Foto Usaha
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
            />
            {photoPreview && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Pratinjau Foto
                </p>
                <img
                  src={photoPreview}
                  alt="Preview foto usaha"
                  className="max-h-60 w-full rounded-3xl object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Lokasi Peta <span className="text-red-500">*</span>
            </label>
            <MapPicker
              onLocationSelect={handleLocationSelect}
              defaultLat={parseFloat(form.latitude)}
              defaultLng={parseFloat(form.longitude)}
              defaultAlamat={form.alamat}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                name="telepon"
                placeholder="Contoh: 081234567890"
                value={form.telepon}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Contoh: info@usaha.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deskripsi Usaha <span className="text-red-500">*</span>
            </label>
            <textarea
              name="deskripsi"
              placeholder="Deskripsikan usaha Anda"
              value={form.deskripsi}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-2xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/destinasi")}
              className="flex-1 rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
