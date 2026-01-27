<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\Recipe;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        $recipes = Recipe::all()->keyBy('name');
        $products = Product::all()->keyBy('name');

        $ingredients = [

            // Greek Salad
            [
                'recipe' => 'Greek Salad',
                'product' => 'Tomato',
                'quantity' => 0.5,
            ],
            [
                'recipe' => 'Greek Salad',
                'product' => 'Cucumber',
                'quantity' => 0.3,
            ],
            [
                'recipe' => 'Greek Salad',
                'product' => 'Onion',
                'quantity' => 0.1,
            ],
            [
                'recipe' => 'Greek Salad',
                'product' => 'Olive Oil',
                'quantity' => 0.05,
            ],
            [
                'recipe' => 'Greek Salad',
                'product' => 'Cheese',
                'quantity' => 0.2,
            ],

            // Spaghetti Bolognese
            [
                'recipe' => 'Spaghetti Bolognese',
                'product' => 'Spaghetti',
                'quantity' => 0.5,
            ],
            [
                'recipe' => 'Spaghetti Bolognese',
                'product' => 'Beef Steak',
                'quantity' => 0.4,
            ],
            [
                'recipe' => 'Spaghetti Bolognese',
                'product' => 'Tomato',
                'quantity' => 0.3,
            ],
            [
                'recipe' => 'Spaghetti Bolognese',
                'product' => 'Onion',
                'quantity' => 0.1,
            ],
            [
                'recipe' => 'Spaghetti Bolognese',
                'product' => 'Olive Oil',
                'quantity' => 0.05,
            ],

            // Chicken and Rice
            [
                'recipe' => 'Chicken and Rice',
                'product' => 'Chicken Breast',
                'quantity' => 0.5,
            ],
            [
                'recipe' => 'Chicken and Rice',
                'product' => 'Rice',
                'quantity' => 0.4,
            ],
            [
                'recipe' => 'Chicken and Rice',
                'product' => 'Carrot',
                'quantity' => 0.2,
            ],
            [
                'recipe' => 'Chicken and Rice',
                'product' => 'Garlic',
                'quantity' => 0.05,
            ],

            // Omelette
            [
                'recipe' => 'Omelette',
                'product' => 'Eggs',
                'quantity' => 3,
            ],
            [
                'recipe' => 'Omelette',
                'product' => 'Cheese',
                'quantity' => 0.2,
            ],
            [
                'recipe' => 'Omelette',
                'product' => 'Parsley',
                'quantity' => 0.05,
            ],

            // Mashed Potatoes
            [
                'recipe' => 'Mashed Potatoes',
                'product' => 'Potato',
                'quantity' => 0.8,
            ],
            [
                'recipe' => 'Mashed Potatoes',
                'product' => 'Milk',
                'quantity' => 0.2,
            ],
            [
                'recipe' => 'Mashed Potatoes',
                'product' => 'Butter',
                'quantity' => 0.1,
            ],

        ];

        foreach ($ingredients as $item) {

            Ingredient::create([
                'recipe_id' => $recipes[$item['recipe']]->id,
                'product_id' => $products[$item['product']]->id,
                'quantity' => $item['quantity'],
            ]);
        }
    }
}
