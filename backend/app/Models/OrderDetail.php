<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class OrderDetail extends Model
{
    protected $fillable = [
        'order_id',
        'product_type',
        'product_id',
        'quantity',
        'extra_key',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Relación morph: puede apuntar a Product o Pack
    public function product(): MorphTo
    {
        return $this->morphTo();
    }
}