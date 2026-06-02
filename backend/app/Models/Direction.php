<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direction extends Model
{
    protected $fillable = [
        'address', 'postal_code', 'city',
        'nif', 'name', 'surnames', 'phone_number'
    ];
}