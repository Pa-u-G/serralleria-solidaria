<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany, HasOne};

class Solution extends Model
{
    protected $table = "solutions";

    protected $fillable = ["name","surname","email","phone_number","issue","description","status"];
    
    public function images(): HasMany {
        return $this->hasMany(Solution_img::class);
    }
}
