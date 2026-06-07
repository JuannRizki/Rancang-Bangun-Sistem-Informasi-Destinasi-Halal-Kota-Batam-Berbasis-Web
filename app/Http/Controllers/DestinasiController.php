<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use Illuminate\Http\Request;

class DestinasiController extends Controller
{
    public function index()
    {
        return response()->json(
            Destinasi::where('user_id', auth()->id())->get()
        );
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
        ]);

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
        $destinasi->update($request->all());

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