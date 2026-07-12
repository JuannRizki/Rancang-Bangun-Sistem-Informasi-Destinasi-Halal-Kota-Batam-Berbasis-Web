<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KategoriController extends Controller
{
    private function authorizeAdmin(Request $request)
    {
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return null;
    }

    public function index(Request $request)
    {
        $authFail = $this->authorizeAdmin($request);
        if ($authFail) return $authFail;

        $data = Kategori::orderBy('nama')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $authFail = $this->authorizeAdmin($request);
        if ($authFail) return $authFail;

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255|unique:kategori,nama',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $kategori = Kategori::create([
            'nama' => $request->input('nama'),
        ]);

        return response()->json(['message' => 'Kategori berhasil dibuat', 'data' => $kategori], 201);
    }

    public function update(Request $request, Kategori $kategori)
    {
        $authFail = $this->authorizeAdmin($request);
        if ($authFail) return $authFail;

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255|unique:kategori,nama,' . $kategori->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $kategori->update([
            'nama' => $request->input('nama'),
        ]);

        return response()->json(['message' => 'Kategori berhasil diperbarui', 'data' => $kategori]);
    }

    public function destroy(Request $request, Kategori $kategori)
    {
        $authFail = $this->authorizeAdmin($request);
        if ($authFail) return $authFail;

        // Hindari menghapus kategori yang masih dipakai (karena destinasis menyimpan nama kategori sebagai string)
        $used = app('App\\Models\\Destinasi')->where('kategori', $kategori->nama)->exists();
        if ($used) {
            return response()->json([
                'message' => 'Kategori tidak bisa dihapus karena masih digunakan pada destinasi.'
            ], 409);
        }

        $kategori->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }

    // Untuk dropdown / publik (ambil semua kategori)
    public function dropdown(Request $request)
    {
        $data = Kategori::orderBy('nama')->get(['nama']);
        return response()->json(['data' => $data]);
    }
}

