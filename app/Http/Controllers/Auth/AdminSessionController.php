<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AdminSessionController extends Controller
{
    /**
     * Show the admin login form.
     */
    public function create()
    {
        return Inertia::render('AdminLoginPage');
    }

    /**
     * Handle the admin login request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        // Find the first user with role 'admin'
        $admin = User::where('role', 'admin')->first();

        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            return back()->withErrors(['password' => 'Invalid admin password.']);
        }

        // Log in as this admin user
        Auth::login($admin);

        // Always redirect to admin dashboard after admin login
        return redirect('/admin');
    }

    /**
     * Logout admin.
     */
    public function destroy(Request $request)
    {
        // Get the current user before logout
        $currentUser = Auth::user();

        // Only logout if current user is an admin
        if ($currentUser && $currentUser->role === 'admin') {
            Auth::logout();

            // Clear all session data
            $request->session()->flush();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Clear any cached user data
            $request->session()->forget('auth');
        }

        return redirect('/admin/login');
    }
}
