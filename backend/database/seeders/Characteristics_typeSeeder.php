<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class Characteristics_typeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('characteristics_type')->insert([
            [
                'type' => 'Color',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Tamaño',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
        ]);
    }
}
