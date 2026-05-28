<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'shipping_price',      'value' => '9',    'desc' => 'Preu d\'enviament',                      'default' => '9'],
            ['key' => 'install_price_tier1',  'value' => '90',  'desc' => 'Preu d\'instal·lació (fins a 250€)',     'default' => '90'],   // hasta 250€
            ['key' => 'install_price_tier2',  'value' => '120', 'desc' => 'Preu d\'instal·lació (250€ - 500€)',     'default' => '120'],  // 250-500€
            ['key' => 'install_price_tier3',  'value' => '180', 'desc' => 'Preu d\'instal·lació (500€ - 1000€)',    'default' => '180'],  // 500-1000€
            ['key' => 'install_price_tier4',  'value' => '-1',  'desc' => 'Preu d\'instal·lació (>1000€)',          'default' => '-1'],   // >1000€ = a consultar
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'desc' => $setting['desc'],
                    'default' => $setting['default']
                ]
            );
        }
    }
}