<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DestinasiController;
use App\Models\User;

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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('destinasi', DestinasiController::class);
});