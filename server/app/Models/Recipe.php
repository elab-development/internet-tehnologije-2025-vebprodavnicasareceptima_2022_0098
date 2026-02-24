<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description'
    ];

    protected $casts = [
        'ingredient_ids' => 'array',
    ];

    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }
}