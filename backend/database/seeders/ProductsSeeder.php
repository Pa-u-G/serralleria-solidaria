<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'category_id' => 1, // Ajusta según tu categoría "Cilindres"
                'code' => 'CIL-001',
                'name' => 'Cilindro de seguridad alta gama',
                'img' => 'cilindro_seguridad.jpg',
                'description' => 'Cilindro de seguridad con protección anti-bumping y anti-taladro.',
                'price' => 49.99,
                'stock' => 50,
                'star' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 1,
                'code' => 'CIL-002',
                'name' => 'Cilindro estándar',
                'img' => 'cilindro_estandar.jpg',
                'description' => 'Cilindro básico para puertas interiores con buena durabilidad.',
                'price' => 19.99,
                'stock' => 120,
                'star' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 2, // Ajusta según tu categoría "Escut"
                'code' => 'ESC-001',
                'name' => 'Escudo protector de puerta',
                'img' => 'escut_protector.jpg',
                'description' => 'Escudo de acero para proteger la cerradura contra ataques.',
                'price' => 29.99,
                'stock' => 80,
                'star' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => 3, // Ajusta según tu categoría "Segon pany"
                'code' => 'SP-001',
                'name' => 'Segundo cerrojo reforzado',
                'img' => 'segon_pany.jpg',
                'description' => 'Cerrojo adicional para incrementar la seguridad de la puerta.',
                'price' => 34.99,
                'stock' => 60,
                'star' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
