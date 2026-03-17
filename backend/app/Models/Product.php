<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany, HasOne};

class Product extends Model
{
    protected $table = "products";

    protected $fillable = ["category_id","code","name","description","price","stock","star"];

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany {
        return $this->hasMany(Product_img::class);
    }
    public function characteristics(): BelongsToMany {
        return $this->belongsToMany(Characteristic::class, 'product_characteristic');
    }
}
