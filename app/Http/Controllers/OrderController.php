<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,online_banking,ewallet',
            'notes' => 'nullable|string',
        ]);

        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $request->total_amount,
            'payment_method' => $request->payment_method,
            'status' => 'completed', // Mark as completed since it's a dummy payment
            'items' => $request->items,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'order_id' => $order->id,
            'message' => 'Order placed successfully!',
        ]);
    }
}
