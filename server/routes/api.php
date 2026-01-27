<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExternalRecipeController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RecipeController;
use Illuminate\Support\Facades\Route;

// Public Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public read routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{recipe}', [RecipeController::class, 'show']);
Route::get('/recipes/{recipe}/ingredients', [IngredientController::class, 'forRecipe']);

Route::middleware(['auth:sanctum'])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Products (admin write)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Recipes (admin write)
    Route::post('/recipes', [RecipeController::class, 'store']);
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update']);
    Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy']);

    // Ingredients - admin write
    Route::post('/recipes/{recipe}/ingredients', [IngredientController::class, 'addToRecipe']);
    Route::put('/ingredients/{ingredient}', [IngredientController::class, 'update']);
    Route::delete('/ingredients/{ingredient}', [IngredientController::class, 'destroy']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/from-recipes', [OrderController::class, 'storeFromRecipes']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);

    // Admin-only helper
    Route::get('/users/{user}/orders', [OrderController::class, 'forUser']);
});