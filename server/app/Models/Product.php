<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price'
    ];

    protected $casts = [
        'price' => 'decimal:2'
    ];

    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}