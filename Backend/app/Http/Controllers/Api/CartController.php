<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Get user's active cart with items
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $request->user()->cart()->with(['items.product'])->first();

        if (!$cart || $cart->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'items' => [],
                    'total' => 0,
                    'total_items' => 0,
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $cart->items,
                'total' => $cart->total,
                'total_items' => $cart->total_items,
            ],
        ]);
    }

    /**
     * Add product to cart
     */
    public function addItem(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is active and in stock
        if (!$product->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak tersedia',
            ], 400);
        }

        if ($product->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
                'available_stock' => $product->stock,
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Get or create active cart
            $cart = $request->user()->getOrCreateCart();

            // Check if product already in cart
            $cartItem = $cart->items()->where('product_id', $product->id)->first();

            if ($cartItem) {
                // Update quantity if already exists
                $newQuantity = $cartItem->quantity + $request->quantity;
                
                if ($product->stock < $newQuantity) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok tidak mencukupi',
                        'available_stock' => $product->stock,
                    ], 400);
                }

                $cartItem->quantity = $newQuantity;
                $cartItem->save();
            } else {
                // Create new cart item
                $cartItem = $cart->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $request->quantity,
                    'price' => $product->price,
                ]);
            }

            DB::commit();

            $cart->load(['items.product']);

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan ke keranjang',
                'data' => [
                    'cart_item' => $cartItem,
                    'total' => $cart->total,
                    'total_items' => $cart->total_items,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan produk ke keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, CartItem $cartItem): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // // Check if cart item belongs to user
        // if ($cartItem->cart->user_id !== $request->user()->id) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Unauthorized',
        //     ], 403);
        // }

        // Check stock availability
        if ($cartItem->product->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
                'available_stock' => $cartItem->product->stock,
            ], 400);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        $cart = $cartItem->cart;
        $cart->load(['items.product']);

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil diperbarui',
            'data' => [
                'cart_item' => $cartItem,
                'total' => $cart->total,
                'total_items' => $cart->total_items,
            ],
        ]);
    }

    /**
     * Remove item from cart
     */
    public function removeItem(Request $request, CartItem $cartItem): JsonResponse
    {
        // // Check if cart item belongs to user
        // if ($cartItem->cart->user_id !== $request->user()->id) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Unauthorized',
        //     ], 403);
        // }

        $cart = $cartItem->cart;
        $cartItem->delete();

        $cart->load(['items.product']);

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil dihapus dari keranjang',
            'data' => [
                'total' => $cart->total,
                'total_items' => $cart->total_items,
            ],
        ]);
    }

    /**
     * Clear all items from cart
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = $request->user()->cart;

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Keranjang tidak ditemukan',
            ], 404);
        }

        $cart->clearItems();

        return response()->json([
            'success' => true,
            'message' => 'Keranjang berhasil dikosongkan',
        ]);
    }
}
