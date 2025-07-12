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
    
    public function update(Request $request, $id) {
        $review = Review::findOrFail($id);
        
        // Check if user owns this review
        if ($review->user_id !== Auth::id()) {
            abort(403);
        }
        
        // Validate the request
        $data = $request->validate([
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);
        
        $review->update([
            'comment' => $data['comment'],
            'rating' => $data['rating'],
            'updated_at' => now()
        ]);
        
        return redirect()->back();
    }
    
    public function destroy($id) {
        $review = Review::findOrFail($id);
        
        // Check if user owns this review
        if ($review->user_id !== Auth::id()) {
            abort(403);
        }
        
        $review->delete();
        
        return redirect()->back();
    }
}
