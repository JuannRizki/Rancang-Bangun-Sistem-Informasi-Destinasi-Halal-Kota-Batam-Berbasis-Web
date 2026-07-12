<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    public function dropdown(Request $request)
    {
        $data = Kategori::orderBy('nama')->get(['nama']);
        return response()->json(['data' => $data]);
    }
}

