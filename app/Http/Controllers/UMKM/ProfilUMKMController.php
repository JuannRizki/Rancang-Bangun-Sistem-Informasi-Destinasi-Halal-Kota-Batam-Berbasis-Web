<?php

namespace App\Http\Controllers\UMKM;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfilUMKMController extends Controller
{
    // GET /api/umkm/profil
    public function show(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'nama' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    // PUT /api/umkm/profil
    public function update(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            // Password optional
            'password_lama' => ['nullable', 'string'],
            'password_baru' => ['nullable', 'string', 'min:8'],
            'password_baru_confirmation' => ['nullable', 'string', 'same:password_baru'],
        ]);

        $wantsChangePassword = filled($request->input('password_lama')) ||
            filled($request->input('password_baru')) ||
            filled($request->input('password_baru_confirmation'));

        if ($wantsChangePassword) {
            $request->validate([
                'password_lama' => ['required', 'string'],
                'password_baru' => ['required', 'string', 'min:8'],
                'password_baru_confirmation' => [
                    'required',
                    'string',
                    'same:password_baru',
                ],
            ]);

            if (!Hash::check($request->input('password_lama'), $user->password)) {
                return response()->json(['message' => 'Password lama tidak sesuai.'], 422);
            }

            $user->password = Hash::make($request->input('password_baru'));
        }

        $user->name = $validated['nama'];
        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil UMKM berhasil diperbarui.',
        ]);
    }
}

