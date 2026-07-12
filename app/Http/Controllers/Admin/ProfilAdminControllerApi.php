<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfilAdminControllerApi extends Controller
{
    public function show(Request $request)
    {
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $admin->id,
                'nama' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($admin->id),
            ],
            'password_lama' => ['nullable', 'string'],
            'password_baru' => ['nullable', 'string', 'min:8'],
            'password_konfirmasi' => ['nullable', 'string', 'same:password_baru'],
        ]);

        $admin->name = $validated['nama'];
        $admin->email = $validated['email'];

        // Password handling (only if user sends all password fields)
        $wantsChangePassword = !empty($request->input('password_baru')) ||
            !empty($request->input('password_lama')) ||
            !empty($request->input('password_konfirmasi'));

        if ($wantsChangePassword) {
            $passwordLama = $request->input('password_lama');
            $passwordBaru = $request->input('password_baru');
            $passwordKonfirmasi = $request->input('password_konfirmasi');

            $request->validate([
                'password_lama' => ['required', 'string'],
                'password_baru' => ['required', 'string', 'min:8'],
                'password_konfirmasi' => ['required', 'string', 'same:password_baru'],
            ]);

            if (!Hash::check($passwordLama, $admin->password)) {
                return response()->json(['message' => 'Password lama tidak sesuai.'], 422);
            }

            $admin->password = Hash::make($passwordBaru);
        }

        $admin->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil admin berhasil diperbarui.',
        ]);
    }
}
