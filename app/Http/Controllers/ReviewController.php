<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('admin')
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('ReviewPage', ['reviews' => $reviews]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'image_url' => 'nullable|string',
        ]);

        // Add authenticated user information
        $data['user_id'] = Auth::id();
        $data['name'] = Auth::user()->name;

        Review::create($data);
        return redirect()->route('review.index', [], 303)->with('success', 'Review submitted!');
    }
}
