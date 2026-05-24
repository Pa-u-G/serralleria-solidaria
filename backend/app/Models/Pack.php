<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany, HasOne, MorphMany};
use App\Models\Product;

class Pack extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_pack')
                    ->withPivot('amount')
                    ->withTimestamps();
    }

    public function images(): HasMany {
        return $this->hasMany(Pack_img::class);
    }

    public function orderDetails()
    {
        return $this->morphMany(OrderDetail::class, 'product');
    }
}