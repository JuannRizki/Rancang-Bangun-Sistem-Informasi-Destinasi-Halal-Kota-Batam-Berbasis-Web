<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = [
            'Kuliner',
            'Hotel',
            'Oleh-oleh',
            'Travel',
            'Wisata',
        ];

        foreach ($defaults as $name) {
            DB::table('kategori')->updateOrInsert(
                ['nama' => $name],
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        $defaults = [
            'Kuliner',
            'Hotel',
            'Oleh-oleh',
            'Travel',
            'Wisata',
        ];

        DB::table('kategori')->whereIn('nama', $defaults)->delete();
    }
};

