<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany, HasOne};

class Product_img extends Model
{
    protected $table = "product_imgs";

    protected $fillable = ["product_id","name_img","path"];
    
    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }
}
