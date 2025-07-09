<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the profile page
     */
    public function show()
    {
        return Inertia::render('Profile');
    }

    /**
     * Update the user's profile
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Show payment history
     */
    public function paymentHistory(Request $request)
    {
        $query = Auth::user()->orders();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->whereJsonContains('items', [['name' => $search]])
                  ->orWhere('payment_method', 'like', '%' . $search . '%')
                  ->orWhere('status', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->get('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->get('date_to'));
        }

        // Filter by amount range
        if ($request->filled('min_amount')) {
            $query->where('total_amount', '>=', $request->get('min_amount'));
        }

        if ($request->filled('max_amount')) {
            $query->where('total_amount', '<=', $request->get('max_amount'));
        }

        // Filter by status
        if ($request->filled('status_filter')) {
            $query->where('status', $request->get('status_filter'));
        }

        // Filter by payment method
        if ($request->filled('payment_filter')) {
            $query->where('payment_method', $request->get('payment_filter'));
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy === 'total_amount') {
            $query->orderBy('total_amount', $sortOrder);
        } elseif ($sortBy === 'status') {
            $query->orderBy('status', $sortOrder);
        } elseif ($sortBy === 'payment_method') {
            $query->orderBy('payment_method', $sortOrder);
        } else {
            $query->orderBy('created_at', $sortOrder);
        }

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('PaymentHistory', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'min_amount', 'max_amount', 'status_filter', 'payment_filter', 'sort_by', 'sort_order'])
        ]);
    }
}
