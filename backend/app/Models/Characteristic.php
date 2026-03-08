<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Characteristic extends Model
{
    protected $table = 'characteristic';

    protected $fillable = ['characteristic_id', 'description', 'status'];

    public function type()
    {
        return $this->belongsTo(CharacteristicType::class, 'characteristic_id');
    }
}