<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $recipes = [

            [
                'name' => 'Greek Salad',
                'description' => 'Traditional Greek salad with fresh vegetables and olive oil',
            ],

            [
                'name' => 'Spaghetti Bolognese',
                'description' => 'Italian pasta with beef and tomato sauce',
            ],

            [
                'name' => 'Chicken and Rice',
                'description' => 'Simple chicken breast with rice and spices',
            ],

            [
                'name' => 'Omelette',
                'description' => 'Egg omelette with cheese and parsley',
            ],

            [
                'name' => 'Mashed Potatoes',
                'description' => 'Creamy mashed potatoes with butter and milk',
            ],
            
        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }
    }
}
