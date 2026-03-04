<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Cilindres',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Escut',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Segon pany',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
