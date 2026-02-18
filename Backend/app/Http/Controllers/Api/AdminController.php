<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all users (admin only)
     */
    public function users(Request $request): JsonResponse
    {
        $users = User::with('roles')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users),
        ]);
    }

    /**
     * Get all orders (admin only)
     */
    public function orders(Request $request): JsonResponse
    {
        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Delete user and all related data (admin only)
     */
    public function destroyUser(User $user): JsonResponse
    {
        try {
            DB::transaction(function () use ($user) {
                // Get user orders
                $orders = $user->orders;
                
                // Delete all order items for each order
                foreach ($orders as $order) {
                    $order->items()->delete();
                }
                
                // Delete all orders
                $user->orders()->delete();
                
                // Delete user
                $user->delete();
            });

            return response()->json([
                'success' => true,
                'message' => 'User dan semua data terkait berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus user: ' . $e->getMessage(),
            ], 500);
        }
    }
}
