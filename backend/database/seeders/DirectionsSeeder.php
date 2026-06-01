<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('directions')->insert([
            [
                'address' => 'Carrer Major 123',
                'postal_code' => '08001',
                'city' => 'Barcelona',
                'nif' => '12345678A',
                'name' => 'Juan',
                'surnames' => 'García Pérez',
                'phone_number' => '612345678',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'address' => 'Avinguda Diagonal 456',
                'postal_code' => '08002',
                'city' => 'Barcelona',
                'nif' => '87654321B',
                'name' => 'María',
                'surnames' => 'López Martínez',
                'phone_number' => '623456789',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'address' => 'Carrer Balmes 789',
                'postal_code' => '08003',
                'city' => 'Barcelona',
                'nif' => '11223344C',
                'name' => 'Carlos',
                'surnames' => 'Sánchez Ruiz',
                'phone_number' => '634567890',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}