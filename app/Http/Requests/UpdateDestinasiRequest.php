<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDestinasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && (
            auth()->user()->role === 'admin' || 
            $this->destinasi->user_id === auth()->id()
        );
    }

    public function rules(): array
    {
        return [
            'nama' => 'sometimes|required|string|max:255',
            'kategori' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|required|string|max:500',
            'latitude' => 'sometimes|required|numeric|between:-90,90',
            'longitude' => 'sometimes|required|numeric|between:-180,180',
            'telepon' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
            'deskripsi' => 'sometimes|required|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama usaha wajib diisi',
            'kategori.required' => 'Kategori wajib diisi',
            'alamat.required' => 'Alamat wajib diisi',
            'latitude.required' => 'Latitude wajib diisi',
            'longitude.required' => 'Longitude wajib diisi',
            'telepon.required' => 'Telepon wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'deskripsi.required' => 'Deskripsi wajib diisi',
            'foto.image' => 'File harus berupa gambar',
            'foto.mimes' => 'Format gambar harus jpeg, png, jpg, gif, atau svg',
            'foto.max' => 'Ukuran gambar maksimal 5MB',
        ];
    }
}
