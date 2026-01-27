<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => ucfirst($this->faker->unique()->words(rand(1, 3), true)),
            'description' => $this->faker->optional()->sentence(12),
            'price' => $this->faker->randomFloat(2, 0.5, 30),
        ];
    }
}