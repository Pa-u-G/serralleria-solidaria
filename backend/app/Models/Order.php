<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'direction_id',
        'facturation_id',
        'status',
        'install',
        'total_price',
    ];

    public function details(): HasMany
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function direction(): BelongsTo
    {
        return $this->belongsTo(Direction::class, 'direction_id');
    }

    public function facturation(): BelongsTo
    {
        return $this->belongsTo(Direction::class, 'facturation_id');
    }
}