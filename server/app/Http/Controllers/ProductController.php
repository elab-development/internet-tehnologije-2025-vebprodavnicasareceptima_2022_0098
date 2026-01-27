<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/products",
     *   tags={"Products"},
     *   summary="List all products",
     *   @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string"), description="Search by product name"),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="No products found.")
     * )
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $q = Product::query()->orderBy('name');

        if ($search !== '') {
            $q->where('name', 'like', "%{$search}%");
        }

        $products = $q->get();

        if ($products->isEmpty()) {
            return response()->json('No products found.', 404);
        }

        return response()->json([
            'products' => ProductResource::collection($products),
        ]);
    }

    /**
     * @OA\Post(
     *   path="/api/products",
     *   tags={"Products"},
     *   summary="Create a product (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","price"},
     *       @OA\Property(property="name", type="string", example="Olive Oil"),
     *       @OA\Property(property="description", type="string", example="Extra virgin olive oil 1L"),
     *       @OA\Property(property="price", type="number", format="float", example=5.50)
     *     )
     *   ),
     *   @OA\Response(response=201, description="Product created"),
     *   @OA\Response(response=403, description="Only admins can create products"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can create products'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => new ProductResource($product),
        ], 201);
    }

    /**
     * @OA\Get(
     *   path="/api/products/{product}",
     *   tags={"Products"},
     *   summary="Get a single product",
     *   @OA\Parameter(name="product", in="path", required=true, description="Product ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="Product not found")
     * )
     */
    public function show(Product $product)
    {
        return response()->json([
            'product' => new ProductResource($product),
        ]);
    }

    /**
     * @OA\Put(
     *   path="/api/products/{product}",
     *   tags={"Products"},
     *   summary="Update a product (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="product", in="path", required=true, description="Product ID", @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=false,
     *     @OA\JsonContent(
     *       @OA\Property(property="name", type="string", example="Greek Olive Oil"),
     *       @OA\Property(property="description", type="string", example="Extra virgin olive oil 1L"),
     *       @OA\Property(property="price", type="number", format="float", example=5.99)
     *     )
     *   ),
     *   @OA\Response(response=200, description="Product updated"),
     *   @OA\Response(response=403, description="Only admins can update products"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request, Product $product)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can update products'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:products,name,' . $product->id,
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => new ProductResource($product),
        ]);
    }

    /**
     * @OA\Delete(
     *   path="/api/products/{product}",
     *   tags={"Products"},
     *   summary="Delete a product (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="product", in="path", required=true, description="Product ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Product deleted"),
     *   @OA\Response(response=403, description="Only admins can delete products")
     * )
     */
    public function destroy(Product $product)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can delete products'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}