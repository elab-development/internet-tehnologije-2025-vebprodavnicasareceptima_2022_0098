<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            [
                'name' => 'Tomato',
                'description' => 'Fresh red tomato per kg',
                'price' => 1.20,
            ],
            [
                'name' => 'Cucumber',
                'description' => 'Fresh cucumber per kg',
                'price' => 0.80,
            ],
            [
                'name' => 'Onion',
                'description' => 'Yellow onion per kg',
                'price' => 0.60,
            ],
            [
                'name' => 'Garlic',
                'description' => 'Fresh garlic per 100g',
                'price' => 0.40,
            ],
            [
                'name' => 'Olive Oil',
                'description' => 'Extra virgin olive oil 1L',
                'price' => 5.50,
            ],
            [
                'name' => 'Cheese',
                'description' => 'White cheese per kg',
                'price' => 3.20,
            ],
            [
                'name' => 'Flour',
                'description' => 'White flour 1kg',
                'price' => 1.00,
            ],
            [
                'name' => 'Eggs',
                'description' => 'Pack of 10 eggs',
                'price' => 2.50,
            ],
            [
                'name' => 'Milk',
                'description' => 'Fresh milk 1L',
                'price' => 1.10,
            ],
            [
                'name' => 'Chicken Breast',
                'description' => 'Chicken breast per kg',
                'price' => 6.90,
            ],
            [
                'name' => 'Beef Steak',
                'description' => 'Beef steak per kg',
                'price' => 12.50,
            ],
            [
                'name' => 'Potato',
                'description' => 'Potato per kg',
                'price' => 0.90,
            ],
            [
                'name' => 'Carrot',
                'description' => 'Carrot per kg',
                'price' => 0.70,
            ],
            [
                'name' => 'Rice',
                'description' => 'White rice 1kg',
                'price' => 2.30,
            ],
            [
                'name' => 'Spaghetti',
                'description' => 'Spaghetti pasta 500g',
                'price' => 2.00,
            ],
            [
                'name' => 'Basil',
                'description' => 'Fresh basil bunch',
                'price' => 0.50,
            ],
            [
                'name' => 'Parsley',
                'description' => 'Fresh parsley bunch',
                'price' => 0.40,
            ],
            [
                'name' => 'Butter',
                'description' => 'Butter 250g',
                'price' => 2.10,
            ],

        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}