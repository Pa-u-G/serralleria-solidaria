<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductPack extends Model
{
    protected $table = 'product_pack';

    protected $fillable = [
        'product_id',
        'pack_id',
        'amount'
    ];
}