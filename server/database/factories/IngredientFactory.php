<?php

namespace Database\Factories;

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\Recipe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ingredient>
 */
class IngredientFactory extends Factory
{
    protected $model = Ingredient::class;

    public function definition(): array
    {
        return [
            'recipe_id' => Recipe::factory(),
            'product_id' => Product::factory(),
            'quantity' => $this->faker->randomFloat(2, 0.1, 5),
        ];
    }
}