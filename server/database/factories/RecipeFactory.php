<?php

namespace Database\Factories;

use App\Models\Recipe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Recipe>
 */
class RecipeFactory extends Factory
{
    protected $model = Recipe::class;

    public function definition(): array
    {
        return [
            'name' => ucfirst($this->faker->unique()->words(3, true)),
            'description' => $this->faker->optional()->paragraph(),
        ];
    }
}