<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrdersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Deshabilitar verificaciones de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Limpiar datos existentes
        DB::table('order_details')->truncate();
        DB::table('orders')->truncate();
        
        // Volver a habilitar verificaciones
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Obtener IDs existentes
        $directionIds = DB::table('directions')->pluck('id')->toArray();
        $userIds = DB::table('users')->pluck('id')->toArray();
        $productIds = DB::table('products')->pluck('id')->toArray();

        // Estados
        $statuses = ['pendiente', 'enviado', 'en camino', 'recibido'];

        // Crear 8 pedidos
        for ($i = 0; $i < 8; $i++) {
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $userIds[array_rand($userIds)],
                'direction_id' => $directionIds[array_rand($directionIds)],
                'facturation_id' => $directionIds[array_rand($directionIds)],
                'status' => $statuses[array_rand($statuses)],
                'install' => rand(0, 1),
                'total_price' => rand(50, 500),
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now(),
            ]);

            // Añadir 1 o 2 productos al pedido
            $numProducts = rand(1, 2);
            for ($j = 0; $j < $numProducts; $j++) {
                DB::table('order_details')->insert([
                    'order_id' => $orderId,
                    'product_type' => 'App\\Models\\Product',
                    'product_id' => $productIds[array_rand($productIds)],
                    'quantity' => rand(1, 3),
                    'extra_key' => rand(0, 2),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}