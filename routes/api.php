<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DestinasiController;
use App\Models\User;
use App\Http\Controllers\Admin\KategoriController as AdminKategoriController;
use App\Http\Controllers\Public\KategoriController as PublicKategoriController;

Route::get('/test', function () {
    return response()->json(['message' => 'API working']);
});

Route::post('/test-post', function () {
    return response()->json(['message' => 'POST API working']);
});

Route::post('/register-debug', function (Request $request) {
    return response()->json([
        'data' => $request->all(),
        'message' => 'Debug register'
    ]);
});

Route::post('/register-simple', function (Request $request) {
    try {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'User created'
        ]);
    } catch (Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes for destinasi
Route::get('/destinasi-public', [DestinasiController::class, 'getAllPublic']);
Route::get('/destinasi-public/{id}', [DestinasiController::class, 'showPublic']);

// Public routes for dropdown kategori
Route::get('/kategori', [PublicKategoriController::class, 'dropdown']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/dashboard', [DestinasiController::class, 'adminDashboard']);

    // UMKM destinasi routes
    Route::apiResource('destinasi', DestinasiController::class);

    // UMKM profil routes
    Route::get('/umkm/profil', [\App\Http\Controllers\UMKM\ProfilUMKMController::class, 'show']);
    Route::put('/umkm/profil', [\App\Http\Controllers\UMKM\ProfilUMKMController::class, 'update']);


    // Admin approval routes
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::get('/destinasi', [DestinasiController::class, 'getApproved']);
        Route::get('/destinasi/pending', [DestinasiController::class, 'getPending']);
        Route::post('/destinasi/{destinasi}/approve', [DestinasiController::class, 'approve']);
        Route::post('/destinasi/{destinasi}/reject', [DestinasiController::class, 'reject']);

        // Pengguna (UMKM accounts)
        Route::get('/pengguna', [\App\Http\Controllers\Admin\PenggunaController::class, 'index']);

        // Profil admin
        Route::get('/profil', [\App\Http\Controllers\Admin\ProfilAdminControllerApi::class, 'show']);
        Route::put('/profil', [\App\Http\Controllers\Admin\ProfilAdminControllerApi::class, 'update']);


        // CRUD kategori (admin)
        Route::get('/kategori', [AdminKategoriController::class, 'index']);
        Route::post('/kategori', [AdminKategoriController::class, 'store']);
        Route::put('/kategori/{kategori}', [AdminKategoriController::class, 'update']);
        Route::delete('/kategori/{kategori}', [AdminKategoriController::class, 'destroy']);

        // alias: untuk frontend yang memanggil /admin/kategori (sesuai halaman admin saat ini)
        Route::get('/kategori/all', [AdminKategoriController::class, 'dropdown']);
    });
});

