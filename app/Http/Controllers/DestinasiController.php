<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use App\Models\User;
use App\Http\Requests\StoreDestinasiRequest;
use App\Http\Requests\UpdateDestinasiRequest;
use App\Http\Requests\ApproveDestinasiRequest;
use App\Http\Requests\RejectDestinasiRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DestinasiController extends Controller
{
    // Get user's own destinasi (include all statuses for UMKM to track their submissions)
    public function index()
    {
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

        $totalDestinasi = Destinasi::approved()->count();
        $totalUmkm = User::where('role', 'umkm')->count();
        $totalKategori = Destinasi::approved()->distinct('kategori')->count('kategori');
        $pendingApproval = Destinasi::pending()->count();

        $recentDestinasi = Destinasi::approved()
            ->orderByDesc('updated_at')
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
            'pending_approval' => $pendingApproval,
            'recent_destinasi' => $recentDestinasi,
        ]);
    }

    // Public method to get all APPROVED destinasi for public map
    public function getAllPublic()
    {
        return response()->json(
            Destinasi::approved()
                ->select('id', 'nama', 'kategori', 'alamat', 'latitude', 'longitude', 'telepon', 'email', 'deskripsi', 'foto')
                ->get()
        );
    }

    // Public method to get single APPROVED destinasi
    public function showPublic($id)
    {
        $destinasi = Destinasi::approved()->findOrFail($id);
        return response()->json($destinasi);
    }

    // Store destinasi with status "pending" by default
    public function store(StoreDestinasiRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('destinasi', 'public');
            $data['foto'] = $path;
        }

        $data['user_id'] = auth()->id();
        $data['status'] = 'pending'; // Set status to pending automatically

        $destinasi = Destinasi::create($data);

        return response()->json([
            'message' => 'Pengajuan usaha berhasil dikirim. Menunggu persetujuan admin.',
            'data' => $destinasi
        ], 201);
    }

    // Get single destinasi (for owner or admin)
    public function show(Destinasi $destinasi)
    {
        // Check if user is owner or admin
        if (auth()->user()->role !== 'admin' && $destinasi->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($destinasi);
    }

    // Update destinasi
    public function update(UpdateDestinasiRequest $request, Destinasi $destinasi)
    {
        // Check authorization
        if (auth()->user()->role !== 'admin' && $destinasi->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('destinasi', 'public');
            $data['foto'] = $path;
        }

        // If UMKM is updating, reset status to pending and clear rejection reason
        if (auth()->user()->role !== 'admin') {
            $data['status'] = 'pending';
            $data['rejection_reason'] = null;
        }

        $destinasi->update($data);

        return response()->json([
            'message' => 'Data berhasil diperbarui',
            'data' => $destinasi
        ]);
    }

    // Delete destinasi
    public function destroy(Destinasi $destinasi)
    {
        // Check authorization
        if (auth()->user()->role !== 'admin' && $destinasi->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $destinasi->delete();

        return response()->json([
            'message' => 'Data berhasil dihapus'
        ]);
    }

    // ============ APPROVAL SYSTEM METHODS ============

    // Admin: Get all destinations with status "approved"
    public function getApproved(Request $request)
    {
        $this->authorizeAdmin();

        $destinasi = Destinasi::approved()
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $destinasi,
        ]);
    }

    // Admin: Get all pending destinasi
    public function getPending(Request $request)
    {
        $this->authorizeAdmin();

        $pending = Destinasi::pending()
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 15));

        return response()->json($pending);
    }


    // Admin: Approve destinasi
    public function approve(ApproveDestinasiRequest $request, Destinasi $destinasi)
    {
        if ($destinasi->status !== 'pending') {
            return response()->json([
                'message' => 'Data tidak dalam status pending'
            ], 400);
        }

        $destinasi->update([
            'status' => 'approved',
            'rejection_reason' => null,
        ]);

        return response()->json([
            'message' => 'Data destinasi berhasil disetujui dan akan ditampilkan untuk publik',
            'data' => $destinasi
        ]);
    }

    // Admin: Reject destinasi dengan alasan
    public function reject(RejectDestinasiRequest $request, Destinasi $destinasi)
    {
        if ($destinasi->status !== 'pending') {
            return response()->json([
                'message' => 'Data tidak dalam status pending'
            ], 400);
        }

        $destinasi->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return response()->json([
            'message' => 'Data destinasi berhasil ditolak',
            'data' => $destinasi
        ]);
    }

    // Helper method to check admin authorization
    private function authorizeAdmin()
    {
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            abort(403, 'Only admin can access this resource');
        }
    }
}