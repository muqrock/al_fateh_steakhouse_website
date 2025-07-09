<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        // Get current date
        $today = now()->toDateString();
        $currentMonth = now()->startOfMonth();
        $currentYear = now()->startOfYear();

        // Basic counts
        $totalUsers = User::where('role', 'customer')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $totalReservations = Reservation::count();
        $totalReviews = Review::count();
        $totalMenuItems = MenuItem::count();

        // Today's statistics
        $todayReservations = Reservation::whereDate('created_at', $today)->count();
        $todayReviews = Review::whereDate('created_at', $today)->count();
        $todayRegistrations = User::whereDate('created_at', $today)->count();

        // This month's statistics
        $monthlyReservations = Reservation::where('created_at', '>=', $currentMonth)->count();
        $monthlyReviews = Review::where('created_at', '>=', $currentMonth)->count();
        $monthlyRegistrations = User::where('created_at', '>=', $currentMonth)->count();

        // Popular menu items (based on review mentions - you can adjust this logic)
        $popularMenuItems = MenuItem::withCount(['reviews' => function ($query) {
                $query->whereNotNull('menu_item_id');
            }])
            ->orderByDesc('reviews_count')
            ->limit(5)
            ->get();

        // If no items have reviews, just get the first 5 menu items
        if ($popularMenuItems->isEmpty()) {
            $popularMenuItems = MenuItem::limit(5)->get();
        }

        $popularMenuItems = $popularMenuItems->map(function ($item) {
            return [
                'name' => $item->name,
                'category' => $item->category,
                'price' => $item->price,
                'reviews_count' => $item->reviews_count ?? 0
            ];
        });

        // Additional analytics for restaurant management
        $weeklyReservations = Reservation::where('created_at', '>=', now()->subWeek())->count();
        $weeklyReviews = Review::where('created_at', '>=', now()->subWeek())->count();
        $yesterdayReservations = Reservation::whereDate('created_at', now()->subDay())->count();
        
        // Menu item distribution by category
        $menuByCategory = MenuItem::selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        // Customer growth trend
        $customerGrowthThisMonth = User::where('role', 'customer')
            ->where('created_at', '>=', $currentMonth)
            ->count();
        $customerGrowthLastMonth = User::where('role', 'customer')
            ->where('created_at', '>=', now()->subMonth()->startOfMonth())
            ->where('created_at', '<', $currentMonth)
            ->count();
        
        $customerGrowthPercentage = $customerGrowthLastMonth > 0 
            ? round((($customerGrowthThisMonth - $customerGrowthLastMonth) / $customerGrowthLastMonth) * 100, 1)
            : 100;

        // Recent activity
        $recentReservations = Reservation::latest()
            ->limit(5)
            ->get()
            ->map(function ($reservation) {
                return [
                    'name' => $reservation->name,
                    'date' => $reservation->reservation_date,
                    'time' => $reservation->reservation_time,
                    'guests' => $reservation->guests,
                    'created_at' => $reservation->created_at->setTimezone(config('app.timezone'))->format('d-m-Y H:i')
                ];
            });

        $recentReviews = Review::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($review) {
                return [
                    'user_name' => $review->user ? $review->user->name : ($review->name ?? 'Anonymous'),
                    'rating' => $review->rating ?? 'N/A',
                    'comment' => substr($review->comment ?? '', 0, 100) . (strlen($review->comment ?? '') > 100 ? '...' : ''),
                    'created_at' => $review->created_at->setTimezone(config('app.timezone'))->format('d-m-Y H:i')
                ];
            });

        // Average rating
        $averageRating = Review::whereNotNull('rating')->avg('rating');

        // Revenue estimation (if you track prices in reservations)
        $estimatedMonthlyRevenue = MenuItem::avg('price') * $monthlyReservations;

        $stats = [
            // Totals
            'total_users' => $totalUsers,
            'total_admins' => $totalAdmins,
            'total_reservations' => $totalReservations,
            'total_reviews' => $totalReviews,
            'total_menu_items' => $totalMenuItems,

            // Today's stats
            'today_reservations' => $todayReservations,
            'today_reviews' => $todayReviews,
            'today_registrations' => $todayRegistrations,

            // Monthly stats
            'monthly_reservations' => $monthlyReservations,
            'monthly_reviews' => $monthlyReviews,
            'monthly_registrations' => $monthlyRegistrations,

            // Insights
            'average_rating' => round($averageRating, 1),
            'estimated_monthly_revenue' => round($estimatedMonthlyRevenue, 2),
            'popular_menu_items' => $popularMenuItems,
            'recent_reservations' => $recentReservations,
            'recent_reviews' => $recentReviews,
            
            // Additional analytics
            'weekly_reservations' => $weeklyReservations,
            'weekly_reviews' => $weeklyReviews,
            'yesterday_reservations' => $yesterdayReservations,
            'menu_by_category' => $menuByCategory,
            'customer_growth_percentage' => $customerGrowthPercentage,
            'customer_growth_this_month' => $customerGrowthThisMonth,
            'customer_growth_last_month' => $customerGrowthLastMonth,
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
    $reservations = Reservation::all();
   return Inertia::render('Admin/AdminReservations', [
    'reservations' => $reservations,
]);

}

/**
 * Delete a reservation.
 *
 * @param int $id
 * @return \Illuminate\Http\RedirectResponse
 */
public function deleteReservation($id)
{
    $reservation = Reservation::find($id);

    if (!$reservation) {
        return redirect()->back()->with('error', 'Reservation not found.');
    }

    $reservation->delete();

    return redirect()->back()->with('success', 'Reservation deleted successfully.');
}

public function updateReservation(Request $request, $id)
{
    // 1. Find the reservation or fail
    $reservation = Reservation::findOrFail($id);

    // 2. Validate the incoming data
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'required|string|max:20',
        'reservation_date' => 'required|date',
        'reservation_time' => 'required|date_format:H:i',
        'guests' => 'required|integer|min:1',
    ]);

    // 3. Update the reservation with validated data
    $reservation->update($validatedData);

    // 4. Redirect back to the reservations list with a success message
    return redirect()->route('admin.reservations')->with('success', 'Reservation updated successfully.');
}

    /**
     * Show reviews management page.
     *
     * @return \Inertia\Response
     */
    public function reviews()
    {
        $reviews = Review::with(['user', 'admin'])
            ->latest()
            ->paginate(10)
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'user_name' => $review->name, // The name field in the review
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->setTimezone(config('app.timezone'))->format('d-m-Y H:i:s'),
                    'admin_reply' => $review->admin_reply,
                    'admin_replied_at' => $review->admin_replied_at ? $review->admin_replied_at->setTimezone(config('app.timezone'))->format('d-m-Y H:i:s') : null,
                    'user' => $review->user ? [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'email' => $review->user->email,
                    ] : null,
                    'admin' => $review->admin ? [
                        'id' => $review->admin->id,
                        'name' => $review->admin->name,
                    ] : null,
                ];
            });
            
        return Inertia::render('Admin/Reviews', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Reply to a customer review
     *
     * @param Request $request
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function replyToReview(Request $request, Review $review)
    {
        $request->validate([
            'admin_reply' => 'required|string|max:1000',
        ]);

        $review->update([
            'admin_reply' => $request->admin_reply,
            'admin_id' => Auth::id(),
            'admin_replied_at' => now(),
        ]);

        return back()->with('success', 'Reply added successfully');
    }

    /**
     * Delete a customer review
     *
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteReview(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Review deleted successfully');
    }

    /**
     * Show customer management page.
     *
     * @return \Inertia\Response
     */
    public function customers()
    {
        $customers = User::where('role', 'customer')
            ->latest()
            ->paginate(20);
        
        return Inertia::render('Admin/Customers', [
            'customers' => $customers
        ]);
    }
}