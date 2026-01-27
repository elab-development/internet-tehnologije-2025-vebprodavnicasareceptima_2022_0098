<?php

namespace App\Http\Controllers;

use App\Http\Resources\IngredientResource;
use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IngredientController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/recipes/{recipe}/ingredients",
     *   tags={"Ingredients"},
     *   summary="List ingredients for a recipe",
     *   @OA\Parameter(name="recipe", in="path", required=true, description="Recipe ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="No ingredients found.")
     * )
     */
    public function forRecipe(Recipe $recipe)
    {
        $ingredients = Ingredient::with('product')
            ->where('recipe_id', $recipe->id)
            ->get();

        if ($ingredients->isEmpty()) {
            return response()->json('No ingredients found.', 404);
        }

        return response()->json([
            'recipe_id' => $recipe->id,
            'ingredients' => IngredientResource::collection($ingredients),
        ]);
    }

    /**
     * @OA\Post(
     *   path="/api/recipes/{recipe}/ingredients",
     *   tags={"Ingredients"},
     *   summary="Add ingredient to a recipe (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="recipe", in="path", required=true, description="Recipe ID", @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"product_id","quantity"},
     *       @OA\Property(property="product_id", type="integer", example=1),
     *       @OA\Property(property="quantity", type="number", format="float", example=0.5)
     *     )
     *   ),
     *   @OA\Response(response=201, description="Ingredient added"),
     *   @OA\Response(response=403, description="Only admins can add ingredients"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function addToRecipe(Request $request, Recipe $recipe)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can add ingredients'], 403);
        }

        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        // spreči duplikate (isti product u istom receptu)
        $exists = Ingredient::where('recipe_id', $recipe->id)
            ->where('product_id', (int)$validated['product_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'error' => 'This product already exists in the recipe. Use update instead.'
            ], 422);
        }

        $ingredient = Ingredient::create([
            'recipe_id' => $recipe->id,
            'product_id' => (int) $validated['product_id'],
            'quantity' => number_format((float)$validated['quantity'], 2, '.', ''),
        ]);

        $ingredient->load('product');

        return response()->json([
            'message' => 'Ingredient added successfully',
            'ingredient' => new IngredientResource($ingredient),
        ], 201);
    }

    /**
     * @OA\Put(
     *   path="/api/ingredients/{ingredient}",
     *   tags={"Ingredients"},
     *   summary="Update an ingredient (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="ingredient", in="path", required=true, description="Ingredient ID", @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=false,
     *     @OA\JsonContent(
     *       @OA\Property(property="product_id", type="integer", example=2),
     *       @OA\Property(property="quantity", type="number", format="float", example=0.7)
     *     )
     *   ),
     *   @OA\Response(response=200, description="Ingredient updated"),
     *   @OA\Response(response=403, description="Only admins can update ingredients"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request, Ingredient $ingredient)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can update ingredients'], 403);
        }

        $validated = $request->validate([
            'product_id' => 'sometimes|integer|exists:products,id',
            'quantity' => 'sometimes|numeric|min:0.01',
        ]);

        // ako menja product_id, proveri da ne napravi duplikat u istom receptu
        if (isset($validated['product_id'])) {
            $dup = Ingredient::where('recipe_id', $ingredient->recipe_id)
                ->where('product_id', (int)$validated['product_id'])
                ->where('id', '!=', $ingredient->id)
                ->exists();

            if ($dup) {
                return response()->json([
                    'error' => 'This product already exists in the recipe.'
                ], 422);
            }
        }

        if (isset($validated['quantity'])) {
            $validated['quantity'] = number_format((float)$validated['quantity'], 2, '.', '');
        }

        $ingredient->update($validated);
        $ingredient->load('product');

        return response()->json([
            'message' => 'Ingredient updated successfully',
            'ingredient' => new IngredientResource($ingredient),
        ]);
    }

    /**
     * @OA\Delete(
     *   path="/api/ingredients/{ingredient}",
     *   tags={"Ingredients"},
     *   summary="Delete an ingredient (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="ingredient", in="path", required=true, description="Ingredient ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Ingredient deleted"),
     *   @OA\Response(response=403, description="Only admins can delete ingredients")
     * )
     */
    public function destroy(Ingredient $ingredient)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can delete ingredients'], 403);
        }

        $ingredient->delete();

        return response()->json(['message' => 'Ingredient deleted successfully']);
    }
}
