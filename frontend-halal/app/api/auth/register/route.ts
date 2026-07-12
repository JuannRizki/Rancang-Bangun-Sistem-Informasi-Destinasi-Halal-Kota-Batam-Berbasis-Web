import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nama, email, password, telepon, alamat, kategori } = await request.json();

    const response = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        nama,
        email,
        password,
        telepon,
        alamat,
        kategori,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(
        { success: true, data },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Registrasi gagal" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
