<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (! Auth::check()) {
            // Clear any existing session data
            $request->session()->flush();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('admin.login')->with('error', 'Please log in as admin to access this area.');
        }

        $user = Auth::user();

        // Check if user is admin
        if (! $user || $user->role !== 'admin') {
            // Force logout if non-admin tries to access admin area
            Auth::logout();
            $request->session()->flush();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('admin.login')->with('error', 'Access denied. Admin privileges required.');
        }

        // Add no-cache headers to prevent back button access
        $response = $next($request);
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');

        return $response;
    }
}
