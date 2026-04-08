<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, BelongsToMany, HasMany, HasOne};

class Pack_img extends Model
{
    protected $table = "pack_imgs";

    protected $fillable = ["pack_id","name_img","path"];
    
    public function pack(): BelongsTo {
        return $this->belongsTo(Pack::class);
    }
}
