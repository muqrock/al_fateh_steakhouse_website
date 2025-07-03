<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\MenuItem;

class AdminController extends Controller
{
    /**
     * Show the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function dashboard()
    {
        $stats = [
            'users' => User::count(),
            'reservations' => Reservation::count(),
            'reviews' => Review::count(),
            'menu_items' => MenuItem::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }

    /**
     * Show user management page.
     *
     * @return \Inertia\Response
     */
    public function users()
    {
        $users = User::latest()->paginate(10);
        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    /**
     * Show reservations management page.
     *
     * @return \Inertia\Response
     */
    public function reservations()
    {
        $reservations = Reservation::with('user')->latest()->paginate(10);
        return Inertia::render('Admin/Reservations', [
            'reservations' => $reservations
        ]);
    }

    /**
     * Show reviews management page.
     *
     * @return \Inertia\Response
     */
    public function reviews()
    {
        $reviews = Review::with('user')->latest()->paginate(10);
        return Inertia::render('Admin/Reviews', [
            'reviews' => $reviews
        ]);
    }
}