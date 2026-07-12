<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PenggunaController extends Controller
{
    public function index(Request $request)
    {
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $users = User::query()
            ->where('role', 'umkm')
            ->withCount('destinasi')
            ->orderByDesc('created_at')
            ->get([
                'id',
                'name',
                'email',
                'role',
                'created_at',
            ])
            ->map(function (User $u) {
                return [
                    'id' => $u->id,
                    'nama' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'jumlah_destinasi' => (int) $u->destinasi_count,
                    'tanggal_registrasi' => $u->created_at ? $u->created_at->toDateString() : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }
}
