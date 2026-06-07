"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TambahDestinasiPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    alamat: "",
    latitude: "1.100000",
    longitude: "104.050000",
    telepon: "",
    email: "",
    deskripsi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);
    console.log("FORM:", form);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/destinasi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      console.log("RESPONSE:", data);

      if (response.ok) {
        alert("Berhasil tambah usaha");
        router.push("/umkm/destinasi");
      } else {
        alert(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      alert("Gagal konek ke backend");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-2xl font-semibold">
          Tambah Usaha
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-6">
            <input
              name="nama"
              placeholder="Nama Usaha"
              onChange={handleChange}
              className="rounded-2xl border p-4"
            />

            <select
              name="kategori"
              onChange={handleChange}
              className="rounded-2xl border p-4"
            >
              <option value="">
                Pilih kategori
              </option>
              <option>Kuliner</option>
              <option>Hotel</option>
              <option>Travel</option>
            </select>
          </div>

          <textarea
            name="alamat"
            placeholder="Alamat lengkap"
            onChange={handleChange}
            className="w-full rounded-2xl border p-4"
          />

          <div className="grid grid-cols-2 gap-6">
            <input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              className="rounded-2xl border p-4"
            />

            <input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              className="rounded-2xl border p-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <input
              name="telepon"
              placeholder="Nomor Telepon"
              onChange={handleChange}
              className="rounded-2xl border p-4"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="rounded-2xl border p-4"
            />
          </div>

          <textarea
            name="deskripsi"
            placeholder="Deskripsi usaha"
            onChange={handleChange}
            className="w-full rounded-2xl border p-4"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                router.push("/umkm/destinasi")
              }
              className="rounded-2xl border px-6 py-3"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-white"
            >
              Tambah Usaha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}