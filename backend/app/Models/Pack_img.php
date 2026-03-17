<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pack_img extends Model
{
    protected $table = "pack_imgs";

    protected $fillable = ["pack_id","name_img","path"];
    
    public function pack(): BelongsTo {
        return $this->belongsTo(Pack::class);
    }
}
