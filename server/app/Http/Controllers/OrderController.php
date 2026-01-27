<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\UserResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/orders",
     *   tags={"Orders"},
     *   summary="List orders (admin: all, user: own only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=404, description="No orders found.")
     * )
     */
    public function index()
    {
        if (Auth::user()->role === 'admin') {
            $orders = Order::with(['user', 'items.product'])->latest()->get();
        } else {
            $orders = Order::with(['user', 'items.product'])
                ->where('user_id', Auth::id())
                ->latest()
                ->get();
        }

        if ($orders->isEmpty()) {
            return response()->json('No orders found.', 404);
        }

        return response()->json([
            'orders' => OrderResource::collection($orders),
        ]);
    }

    /**
     * @OA\Get(
     *   path="/api/orders/{order}",
     *   tags={"Orders"},
     *   summary="Get a single order (admin:any, user:own only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="order", in="path", required=true, description="Order ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function show(Order $order)
    {
        if (Auth::user()->role !== 'admin' && $order->user_id !== Auth::id()) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $order->load(['user', 'items.product']);

        return response()->json([
            'order' => new OrderResource($order),
        ]);
    }

    /**
     * @OA\Get(
     *   path="/api/users/{user}/orders",
     *   tags={"Orders"},
     *   summary="Admin: list orders for a specific user",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="user", in="path", required=true, description="User ID", @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="OK"),
     *   @OA\Response(response=403, description="Only admins can view user orders"),
     *   @OA\Response(response=404, description="No orders found for this user.")
     * )
     */
    public function forUser(\App\Models\User $user)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can view user orders'], 403);
        }

        $orders = Order::with(['user', 'items.product'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        if ($orders->isEmpty()) {
            return response()->json('No orders found for this user.', 404);
        }

        return response()->json([
            'user' => new UserResource($user),
            'orders' => OrderResource::collection($orders),
        ]);
    }

    /**
     * @OA\Post(
     *   path="/api/orders",
     *   tags={"Orders"},
     *   summary="Create an order from products (user only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"items"},
     *       @OA\Property(
     *         property="items",
     *         type="array",
     *         @OA\Items(type="object",
     *           required={"product_id","quantity"},
     *           @OA\Property(property="product_id", type="integer", example=1),
     *           @OA\Property(property="quantity", type="number", format="float", example=2)
     *         )
     *       )
     *     )
     *   ),
     *   @OA\Response(response=201, description="Order created"),
     *   @OA\Response(response=403, description="Only users can create orders"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'user') {
            return response()->json(['error' => 'Only users can create orders'], 403);
        }

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
        ]);

        // Učitaj proizvode (za cenu)
        $productIds = collect($validated['items'])->pluck('product_id')->map(fn($v) => (int)$v)->all();
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // Izračunaj total
        $total = 0.0;
        foreach ($validated['items'] as $item) {
            $pid = (int) $item['product_id'];
            $qty = (float) $item['quantity'];
            $price = (float) $products[$pid]->price;
            $total += $price * $qty;
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => number_format($total, 2, '.', ''),
            'status' => 'pending',
        ]);

        foreach ($validated['items'] as $item) {
            $pid = (int) $item['product_id'];
            $qty = (float) $item['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $pid,
                'quantity' => number_format($qty, 2, '.', ''),
                'price' => number_format((float) $products[$pid]->price, 2, '.', ''), // snapshot cene u trenutku kupovine
            ]);
        }

        $order->load(['user', 'items.product']);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => new OrderResource($order),
        ], 201);
    }

    /**
     * @OA\Post(
     *   path="/api/orders/from-recipes",
     *   tags={"Orders"},
     *   summary="Create an order from recipes with include/exclude products (user only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"recipe_ids"},
     *       @OA\Property(property="recipe_ids", type="array", @OA\Items(type="integer"), example={1,2}),
     *       @OA\Property(property="include_product_ids", type="array", @OA\Items(type="integer"), example={19}),
     *       @OA\Property(property="exclude_product_ids", type="array", @OA\Items(type="integer"), example={3})
     *     )
     *   ),
     *   @OA\Response(response=201, description="Order created from recipes"),
     *   @OA\Response(response=403, description="Only users can create orders"),
     *   @OA\Response(response=422, description="Selected recipes and modifiers resulted in an empty cart.")
     * )
     */
    public function storeFromRecipes(Request $request)
    {
        if (Auth::user()->role !== 'user') {
            return response()->json(['error' => 'Only users can create orders'], 403);
        }

        $validated = $request->validate([
            'recipe_ids' => ['required', 'array', 'min:1'],
            'recipe_ids.*' => ['integer', 'distinct', 'exists:recipes,id'],
            
            'include_product_ids' => ['sometimes', 'array'],
            'include_product_ids.*' => ['integer', 'distinct', 'exists:products,id'],

            'exclude_product_ids' => ['sometimes', 'array'],
            'exclude_product_ids.*' => ['integer', 'distinct', 'exists:products,id'],
        ]);

        $include = collect($validated['include_product_ids'] ?? [])->map(fn($v) => (int)$v)->unique()->values();
        $exclude = collect($validated['exclude_product_ids'] ?? [])->map(fn($v) => (int)$v)->unique()->values();

        // Učitaj recepte + njihove ingrediente (ingredient = product_id + quantity)
        $recipes = Recipe::with('ingredients')->whereIn('id', $validated['recipe_ids'])->get();

        // Aggregation po product_id: saberi quantity ako se ponavlja kroz više recepata
        $map = []; // product_id => quantity
        foreach ($recipes as $r) {
            foreach ($r->ingredients as $ing) {
                $pid = (int) $ing->product_id;
                $qty = (float) $ing->quantity;
                $map[$pid] = ($map[$pid] ?? 0) + $qty;
            }
        }

        // include: dodaj ako ne postoji (podrazumevana quantity 1)
        foreach ($include as $pid) {
            $map[(int)$pid] = ($map[(int)$pid] ?? 0) + 1;
        }

        // exclude: ukloni
        foreach ($exclude as $pid) {
            unset($map[(int)$pid]);
        }

        if (empty($map)) {
            return response()->json([
                'error' => 'Selected recipes and modifiers resulted in an empty cart.'
            ], 422);
        }

        $productIds = array_keys($map);
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // total
        $total = 0.0;
        foreach ($map as $pid => $qty) {
            $total += ((float)$products[$pid]->price) * (float)$qty;
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => number_format($total, 2, '.', ''),
            'status' => 'pending',
        ]);

        foreach ($map as $pid => $qty) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => (int) $pid,
                'quantity' => number_format((float)$qty, 2, '.', ''),
                'price' => number_format((float)$products[$pid]->price, 2, '.', ''),
            ]);
        }

        $order->load(['user', 'items.product']);

        return response()->json([
            'message' => 'Order created successfully from recipes',
            'order' => new OrderResource($order),
        ], 201);
    }

    /**
     * @OA\Put(
     *   path="/api/orders/{order}",
     *   tags={"Orders"},
     *   summary="Update an order status (admin only)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="order", in="path", required=true, description="Order ID", @OA\Schema(type="integer")),
     *   @OA\RequestBody(
     *     required=false,
     *     @OA\JsonContent(
     *       @OA\Property(property="status", type="string", enum={"pending","paid","fulfilled","cancelled"}, example="paid")
     *     )
     *   ),
     *   @OA\Response(response=200, description="Order updated"),
     *   @OA\Response(response=403, description="Only admins can update orders"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request, Order $order)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can update orders'], 403);
        }

        $validated = $request->validate([
            'status' => ['sometimes', 'string', 'in:pending,paid,fulfilled,cancelled'],
        ]);

        $order->update($validated);
        $order->load(['user', 'items.product']);

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => new OrderResource($order),
        ]);
    }
}