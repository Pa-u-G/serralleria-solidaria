<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CharacteristicType extends Model
{
    protected $table = 'characteristics_type';

    protected $fillable = ['type', 'status'];

    public function characteristics()
    {
        return $this->hasMany(Characteristic::class, 'characteristic_id');
    }
}