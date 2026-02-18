<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Get all user orders
     */
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Create order from cart (checkout)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'payment_method' => 'required|in:store,cod',
            'delivery_type' => 'required|in:pickup,delivery',
            'delivery_address' => 'required_if:delivery_type,delivery|nullable|string',
            'customer_phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
        ]);

        $cart = $request->user()->cart()->with(['items.product'])->first();

        if (!$cart || $cart->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Keranjang kosong',
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Validate stock for all items
            foreach ($cart->items as $cartItem) {
                if (!$cartItem->product->isInStock()) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Produk {$cartItem->product->name} tidak tersedia",
                    ], 400);
                }

                if ($cartItem->product->stock < $cartItem->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Stok {$cartItem->product->name} tidak mencukupi",
                        'available_stock' => $cartItem->product->stock,
                    ], 400);
                }
            }

            // Create order
            $shippingCost = $request->delivery_type === 'delivery' ? 10000 : 0;
            $totalAmount = $cart->total + $shippingCost;
            
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $totalAmount,
                'shipping_cost' => $shippingCost,
                'payment_method' => $request->payment_method,
                'delivery_type' => $request->delivery_type,
                'delivery_address' => $request->delivery_address,
                'customer_phone' => $request->customer_phone,
                'notes' => $request->notes,
                'status' => 'pending',
            ]);

            // Create order items and decrease stock
            foreach ($cart->items as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                ]);

                // Decrease product stock
                $cartItem->product->decreaseStock($cartItem->quantity);
            }

            // Clear cart and mark as checked out
            $cart->clearItems();
            $cart->update(['status' => 'checked_out']);

            DB::commit();

            $order->load(['items.product']);

            return response()->json([
                'success' => true,
                'message' => 'Order berhasil dibuat',
                'data' => $order,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific order
     */
public function show(Request $request, Order $order): JsonResponse
{
    $user = $request->user();

    // // Jika bukan pemilik DAN bukan admin
    // if ($order->user_id !== $user->id && !$user->hasRole('admin')) {
    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Unauthorized',
    //     ], 403);
    // }

    $order->load(['items.product']);

    return response()->json([
        'success' => true,
        'data' => $order,
    ]);
}


    /**
     * Cancel order
     */
    public function cancel(Request $request, Order $order): JsonResponse
    {
        // Check if order belongs to user
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if (!$order->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Order tidak dapat dibatalkan',
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Return stock
            foreach ($order->items as $orderItem) {
                $orderItem->product->increaseStock($orderItem->quantity);
            }

            $order->markAsCancelled();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order berhasil dibatalkan',
                'data' => $order,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membatalkan order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve order (change status to completed)
     */
    public function approve(Request $request, Order $order): JsonResponse
    {
        // Check if order belongs to user
        if ($order->user_id !== $request->user()->id  && !$request->user()->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if order is in pending status
        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya order dengan status pending yang dapat di-approve',
            ], 400);
        }

        try {
            $order->update(['status' => 'completed']);

            $order->load(['items.product']);

            return response()->json([
                'success' => true,
                'message' => 'Order berhasil diselesaikan',
                'data' => $order,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
