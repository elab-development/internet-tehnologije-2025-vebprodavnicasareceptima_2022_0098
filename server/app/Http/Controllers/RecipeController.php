<?php

namespace App\Http\Controllers;

use App\Http\Resources\RecipeResource;
use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RecipeController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/recipes",
     *   tags={"Recipes"},
     *   summary="List recipes (search, product filters, sort, pagination)",
     *   @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string"), description="Search in recipe name/description and product names"),
     *   @OA\Parameter(name="products_any", in="query", required=false, @OA\Schema(type="string"), description="CSV of product IDs; recipe must contain ANY of them"),
     *   @OA\Parameter(name="products_all", in="query", required=false, @OA\Schema(type="string"), description="CSV of product IDs; recipe must contain ALL of them"),
     *   @OA\Parameter(name="products_exclude", in="query", required=false, @OA\Schema(type="string"), description="CSV of product IDs to exclude"),
     *   @OA\Parameter(
     *     name="sort", in="query", required=false,
     *     @OA\Schema(type="string", enum={"name","-name","created_at","-created_at","updated_at","-updated_at","ingredients_count","-ingredients_count"}),
     *     description="Sort field (prefix with - for DESC)"
     *   ),
     *   @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", minimum=1, maximum=100), description="Items per page (default 15)"),
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", minimum=1), description="Page number (default 1)"),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="No recipes found.")
     * )
     */
    public function index(Request $request)
    {
        $v = Validator::make($request->all(), [
            'search' => ['sometimes', 'string', 'max:200'],
            'products_any' => ['sometimes', 'string'],
            'products_all' => ['sometimes', 'string'],
            'products_exclude' => ['sometimes', 'string'],
            'sort' => ['sometimes', 'string', 'in:name,-name,created_at,-created_at,updated_at,-updated_at,ingredients_count,-ingredients_count'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);
        $v->validate();

        $perPage = (int) $request->input('per_page', 15);
        $page    = (int) $request->input('page', 1);
        $search  = trim((string) $request->input('search', ''));
        $sort    = (string) $request->input('sort', 'name');

        $parseIds = fn($csv) => array_values(array_unique(
            array_filter(array_map('intval', explode(',', (string) $csv)), fn($i) => $i > 0)
        ));

        $idsAny = $parseIds($request->input('products_any'));
        $idsAll = $parseIds($request->input('products_all'));
        $idsExclude = $parseIds($request->input('products_exclude'));

        $q = Recipe::query();

        if ($search !== '') {
            $escaped = str_replace(['%', '_'], ['\%', '\_'], $search);

            $q->where(function ($w) use ($escaped) {
                $w->where('name', 'like', "%{$escaped}%")
                    ->orWhere('description', 'like', "%{$escaped}%")
                    ->orWhereHas('ingredients.product', function ($p) use ($escaped) {
                        $p->where('products.name', 'like', "%{$escaped}%");
                    });
            });
        }

        if (!empty($idsAny)) {
            $q->whereHas('ingredients', function ($ing) use ($idsAny) {
                $ing->whereIn('product_id', $idsAny);
            });
        }

        if (!empty($idsAll)) {
            foreach ($idsAll as $pid) {
                $q->whereHas('ingredients', fn($ing) => $ing->where('product_id', $pid));
            }
        }

        if (!empty($idsExclude)) {
            $q->whereDoesntHave('ingredients', function ($ing) use ($idsExclude) {
                $ing->whereIn('product_id', $idsExclude);
            });
        }

        $direction = Str::startsWith($sort, '-') ? 'desc' : 'asc';
        $field = ltrim($sort, '-');

        switch ($field) {
            case 'name':
            case 'created_at':
            case 'updated_at':
                $q->orderBy($field, $direction);
                break;
            case 'ingredients_count':
                $q->withCount('ingredients')->orderBy('ingredients_count', $direction);
                break;
            default:
                $q->orderBy('name', 'asc');
        }

        $recipes = $q->with(['ingredients.product'])->paginate($perPage, ['*'], 'page', $page);

        if ($recipes->isEmpty()) {
            return response()->json('No recipes found.', 404);
        }

        return response()->json([
            'meta'    => [
                'page' => $recipes->currentPage(),
                'per_page' => $recipes->perPage(),
                'total' => $recipes->total(),
                'last_page' => $recipes->lastPage(),
            ],
            'recipes' => RecipeResource::collection($recipes),
        ]);
    }

    /**
     * @OA\Get(
     *   path="/api/recipes/{recipe}",
     *   tags={"Recipes"},
     *   summary="Get a single recipe",
     *   @OA\Parameter(name="recipe", in="path", required=true, description="Recipe ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="Recipe not found")
     * )
     */
    public function show(Recipe $recipe)
    {
        $recipe->load(['ingredients.product']);

        return response()->json([
            'recipe' => new RecipeResource($recipe),
        ]);
    }


    public function ingredients(Recipe $recipe)
    {
        $recipe->load(['ingredients.product']);

        if ($recipe->ingredients->isEmpty()) {
            return response()->json('No ingredients found for this recipe.', 404);
        }

        return response()->json([
            'recipe_id' => $recipe->id,
            'ingredients' => $recipe->ingredients, // resource će se obično koristiti; ali držimo stil:
        ]);
    }

    /**
     * @OA\Post(
     *   path="/api/recipes",
     *   tags={"Recipes"},
     *   summary="Create a new recipe (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","ingredients"},
     *       @OA\Property(property="name", type="string", maxLength=255, example="Greek Salad"),
     *       @OA\Property(property="description", type="string", example="Fresh and easy."),
     *       @OA\Property(
     *         property="ingredients",
     *         type="array",
     *         @OA\Items(type="object",
     *           required={"product_id","quantity"},
     *           @OA\Property(property="product_id", type="integer", example=1),
     *           @OA\Property(property="quantity", type="number", format="float", example=0.5)
     *         )
     *       )
     *     )
     *   ),
     *   @OA\Response(response=201, description="Recipe created"),
     *   @OA\Response(response=403, description="Only admins can create recipes"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can create recipes'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:recipes,name',
            'description' => 'nullable|string',
            'ingredients' => 'required|array|min:1',
            'ingredients.*.product_id' => 'required|integer|distinct|exists:products,id',
            'ingredients.*.quantity' => 'required|numeric|min:0.01',
        ]);

        $recipe = Recipe::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        foreach ($validated['ingredients'] as $ing) {
            Ingredient::create([
                'recipe_id' => $recipe->id,
                'product_id' => (int) $ing['product_id'],
                'quantity' => number_format((float)$ing['quantity'], 2, '.', ''),
            ]);
        }

        $recipe->load(['ingredients.product']);

        return response()->json([
            'message' => 'Recipe created successfully',
            'recipe' => new RecipeResource($recipe),
        ], 201);
    }

    /**
     * @OA\Put(
     *   path="/api/recipes/{recipe}",
     *   tags={"Recipes"},
     *   summary="Update a recipe (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="recipe", in="path", required=true, description="Recipe ID", @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=false,
     *     @OA\JsonContent(
     *       @OA\Property(property="name", type="string", maxLength=255, example="Summer Greek Salad"),
     *       @OA\Property(property="description", type="string", example="With extra basil."),
     *       @OA\Property(
     *         property="ingredients",
     *         type="array",
     *         description="If provided, replaces all ingredients with this list",
     *         @OA\Items(type="object",
     *           required={"product_id","quantity"},
     *           @OA\Property(property="product_id", type="integer", example=1),
     *           @OA\Property(property="quantity", type="number", format="float", example=0.6)
     *         )
     *       )
     *     )
     *   ),
     *   @OA\Response(response=200, description="Recipe updated"),
     *   @OA\Response(response=403, description="Only admins can update recipes"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request, Recipe $recipe)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can update recipes'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:recipes,name,' . $recipe->id,
            'description' => 'sometimes|nullable|string',
            'ingredients' => 'sometimes|array|min:1',
            'ingredients.*.product_id' => 'required_with:ingredients|integer|distinct|exists:products,id',
            'ingredients.*.quantity' => 'required_with:ingredients|numeric|min:0.01',
        ]);

        $recipe->update([
            'name' => $validated['name'] ?? $recipe->name,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : $recipe->description,
        ]);

        if (isset($validated['ingredients'])) {
            Ingredient::where('recipe_id', $recipe->id)->delete();

            foreach ($validated['ingredients'] as $ing) {
                Ingredient::create([
                    'recipe_id' => $recipe->id,
                    'product_id' => (int) $ing['product_id'],
                    'quantity' => number_format((float)$ing['quantity'], 2, '.', ''),
                ]);
            }
        }

        $recipe->load(['ingredients.product']);

        return response()->json([
            'message' => 'Recipe updated successfully',
            'recipe' => new RecipeResource($recipe),
        ]);
    }

    /**
     * @OA\Delete(
     *   path="/api/recipes/{recipe}",
     *   tags={"Recipes"},
     *   summary="Delete a recipe (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="recipe", in="path", required=true, description="Recipe ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Recipe deleted"),
     *   @OA\Response(response=403, description="Only admins can delete recipes")
     * )
     */
    public function destroy(Recipe $recipe)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can delete recipes'], 403);
        }

        $recipe->delete();

        return response()->json(['message' => 'Recipe deleted successfully']);
    }
}
