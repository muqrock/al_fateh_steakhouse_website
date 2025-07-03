<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

        if (!$admin || !Hash::check($request->password, $admin->password)) {
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
        Auth::logout();
        return redirect('/');
    }
}
