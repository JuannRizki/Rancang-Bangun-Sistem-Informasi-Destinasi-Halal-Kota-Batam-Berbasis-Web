<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destinasi extends Model
{
    protected $fillable = [
        'nama',
        'kategori',
        'alamat',
        'latitude',
        'longitude',
        'telepon',
        'email',
        'deskripsi',
        'foto',
        'user_id',
    ];
}