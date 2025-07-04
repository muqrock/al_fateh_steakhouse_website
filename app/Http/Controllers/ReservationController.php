<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index()
    {
        return Inertia::render('Reservation');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required',
            'guests' => 'required|integer|min:1',
        ]);

        Reservation::create($validated);

        return redirect()->back()->with('success', 'Reservation successful!');
    }
}
