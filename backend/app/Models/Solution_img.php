<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany, HasOne};

class Solution_img extends Model
{
    protected $table = "solutions_img";

    protected $fillable = ["solution_id","name_img","path"];
    
    public function solution(): BelongsTo {
        return $this->belongsTo(Solution::class);
    }
}
