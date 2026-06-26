<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use App\Models\UMKM;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search destinations by name or address
     * GET /api/search/destinations?q=query
     */
    public function searchDestinations(Request $request)
    {
        $query = $request->query('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $results = Destinasi::where('nama', 'LIKE', "%{$query}%")
            ->orWhere('alamat', 'LIKE', "%{$query}%")
            ->orWhere('deskripsi', 'LIKE', "%{$query}%")
            ->select('id', 'nama', 'alamat', 'latitude', 'longitude', 'kategori')
            ->limit(8)
            ->get()
            ->map(function ($item) {
                return [
                    'provider' => 'database',
                    'id' => 'dest_' . $item->id,
                    'placeId' => 'dest_' . $item->id,
                    'description' => $item->nama . ' - ' . $item->alamat,
                    'display_name' => $item->nama . ' - ' . $item->alamat,
                    'lat' => (float) $item->latitude,
                    'lon' => (float) $item->longitude,
                    'kategori' => $item->kategori,
                ];
            });

        return response()->json($results);
    }

    /**
     * Search UMKMs by name or address
     * GET /api/search/umkms?q=query
     */
    public function searchUMKMs(Request $request)
    {
        $query = $request->query('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $results = UMKM::where('nama', 'LIKE', "%{$query}%")
            ->orWhere('alamat', 'LIKE', "%{$query}%")
            ->orWhere('deskripsi', 'LIKE', "%{$query}%")
            ->select('id', 'nama', 'alamat', 'latitude', 'longitude', 'kategori')
            ->limit(8)
            ->get()
            ->map(function ($item) {
                return [
                    'provider' => 'database',
                    'id' => 'umkm_' . $item->id,
                    'placeId' => 'umkm_' . $item->id,
                    'description' => $item->nama . ' - ' . $item->alamat,
                    'display_name' => $item->nama . ' - ' . $item->alamat,
                    'lat' => (float) $item->latitude,
                    'lon' => (float) $item->longitude,
                    'kategori' => $item->kategori,
                ];
            });

        return response()->json($results);
    }
}
