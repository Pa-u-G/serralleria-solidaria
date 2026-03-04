<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CharacteristicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('characteristic')->insert([
            [
                'characteristic_id' => 1,
                'description' => 'Negro',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'characteristic_id' => 1,
                'description' => 'Blanco',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'characteristic_id' => 2,
                'description' => "1 metro",
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
        ]);
    }
}
