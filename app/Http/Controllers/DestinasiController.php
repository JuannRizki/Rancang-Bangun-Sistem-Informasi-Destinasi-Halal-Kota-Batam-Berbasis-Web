<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DestinasiController extends Controller
{
    public function index()
    {
        // Get only user's own destinasi
        return response()->json(
            Destinasi::where('user_id', auth()->id())->get()
        );
    }

    public function adminDashboard()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $totalDestinasi = Destinasi::count();
        $totalUmkm = User::where('role', 'umkm')->count();
        $totalKategori = Destinasi::distinct('kategori')->count('kategori');
        $totalLaporan = 0;

        $recentDestinasi = Destinasi::orderByDesc('updated_at')
            ->take(4)
            ->get(['id', 'nama', 'kategori', 'updated_at'])
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'kategori' => $item->kategori,
                    'status' => 'Aktif',
                    'tanggal' => $item->updated_at->format('d M Y'),
                ];
            });

        return response()->json([
            'total_destinasi' => $totalDestinasi,
            'total_umkm' => $totalUmkm,
            'total_kategori' => $totalKategori,
            'total_laporan' => $totalLaporan,
            'recent_destinasi' => $recentDestinasi,
        ]);
    }

    // Public method to get all destinasi for public map
    public function getAllPublic()
    {
        return response()->json(
            Destinasi::select('id', 'nama', 'kategori', 'alamat', 'latitude', 'longitude', 'telepon', 'email', 'deskripsi', 'foto')->get()
        );
    }

    // Public method to get single destinasi
    public function showPublic($id)
    {
        $destinasi = Destinasi::findOrFail($id);
        return response()->json($destinasi);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required',
            'kategori' => 'required',
            'alamat' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'telepon' => 'required',
            'email' => 'required',
            'deskripsi' => 'required',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('destinasi', 'public');
            $data['foto'] = $path;
        }

        $data['user_id'] = auth()->id();

        $destinasi = Destinasi::create($data);

        return response()->json($destinasi);
    }

    public function show(Destinasi $destinasi)
    {
        return response()->json($destinasi);
    }

    public function update(Request $request, Destinasi $destinasi)
    {
        $data = $request->validate([
            'nama' => 'sometimes|required',
            'kategori' => 'sometimes|required',
            'alamat' => 'sometimes|required',
            'latitude' => 'sometimes|required',
            'longitude' => 'sometimes|required',
            'telepon' => 'sometimes|required',
            'email' => 'sometimes|required',
            'deskripsi' => 'sometimes|required',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('destinasi', 'public');
            $data['foto'] = $path;
        }

        $destinasi->update($data);

        return response()->json($destinasi);
    }

    public function destroy(Destinasi $destinasi)
    {
        $destinasi->delete();

        return response()->json([
            'message' => 'Data berhasil dihapus'
        ]);
    }
}