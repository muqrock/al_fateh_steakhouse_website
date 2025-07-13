<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Health check for Render
Route::get('/healthz', fn() => response()->json(['status' => 'ok']));

// Homepage
Route::get('/', fn() => Inertia::render('HomePage'))->name('home');

// Guest-only auth routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('/reset-password/{token}', fn() => Inertia::render('auth/reset-password'))->name('password.reset');
    Route::post('/reset-password', fn() => redirect(route('login')))->name('password.store');
});

// Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

// Email verification
Route::middleware('auth')->group(function () {
    Route::get('/verify-email', EmailVerificationPromptController::class)->name('verification.notice');
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')->name('verification.send');

    // Password confirmation
    Route::get('/confirm-password', fn() => Inertia::render('auth/confirm-password'))->name('password.confirm');
    Route::post('/confirm-password', function (Request $request) {
        $request->validate(['password' => ['required', 'current_password']]);
        $request->session()->put('auth.password_confirmed_at', time());
        return redirect()->intended();
    })->name('password.confirm.store');
});

// Public routes
Route::get('/menu', [MenuController::class, 'index'])->name('menu');
Route::get('/about', fn() => Inertia::render('AboutPage'))->name('about');
Route::get('/review', [ReviewController::class, 'index'])->name('review.index');

// Customer-only routes
Route::middleware(['customer'])->group(function () {
    Route::get('/reservation', [ReservationController::class, 'index'])->name('reservation.index');
    Route::get('/order', function () {
        $menuItems = MenuItem::all()->groupBy('category');
        return Inertia::render('OrderPage', ['menu' => $menuItems]);
    })->name('order');

    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::get('/payment-history', [\App\Http\Controllers\ProfileController::class, 'paymentHistory'])->name('payment-history');

    Route::post('/review', [ReviewController::class, 'store']);
    Route::put('/review/{review}', [ReviewController::class, 'update'])->name('review.update');
    Route::delete('/review/{review}', [ReviewController::class, 'destroy'])->name('review.destroy');
    Route::post('/reservation', [ReservationController::class, 'store'])->name('reservation.store');
    Route::post('/order', [\App\Http\Controllers\OrderController::class, 'store'])->name('order.store');
});

// Admin login
Route::get('/admin/login', [\App\Http\Controllers\Auth\AdminSessionController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [\App\Http\Controllers\Auth\AdminSessionController::class, 'store']);
Route::post('/admin/logout', [\App\Http\Controllers\Auth\AdminSessionController::class, 'destroy'])->name('admin.logout');

// Admin-only routes
Route::middleware(['admin'])->group(function () {
    Route::get('/admin', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/customers', [\App\Http\Controllers\AdminController::class, 'customers'])->name('admin.customers');
    Route::get('/admin/reservations', [\App\Http\Controllers\AdminController::class, 'reservations'])->name('admin.reservations');
    Route::get('/admin/reviews', [\App\Http\Controllers\AdminController::class, 'reviews'])->name('admin.reviews');

    // Review actions
    Route::post('/admin/reviews/{review}/reply', [\App\Http\Controllers\AdminController::class, 'replyToReview'])->name('admin.reviews.reply');
    Route::put('/admin/reviews/{review}/reply', [\App\Http\Controllers\AdminController::class, 'updateReplyToReview'])->name('admin.reviews.reply.update');
    Route::delete('/admin/reviews/{review}', [\App\Http\Controllers\AdminController::class, 'deleteReview'])->name('admin.reviews.delete');

    // Reservation actions
    Route::put('/admin/reservations/{id}', [\App\Http\Controllers\AdminController::class, 'updateReservation'])->name('admin.reservations.update');
    Route::delete('/admin/reservations/{id}', [\App\Http\Controllers\AdminController::class, 'deleteReservation'])->name('admin.reservations.delete');

    // Menu routes (✅ no duplicates now)
    Route::get('/admin/menu', [MenuController::class, 'index'])->name('admin.menu.index');
    Route::get('/admin/menu/create', [MenuController::class, 'create'])->name('admin.menu.create');
    Route::post('/admin/menu', [MenuController::class, 'store'])->name('admin.menu.store');
    Route::get('/admin/menu/{menu}/edit', [MenuController::class, 'edit'])->name('admin.menu.edit');
    Route::put('/admin/menu/{menu}', [MenuController::class, 'update'])->name('admin.menu.update');
    Route::delete('/admin/menu/{menu}', [MenuController::class, 'destroy'])->name('admin.menu.destroy');
});

// Authenticated user-only review update (optional)
Route::put('/review/{id}', [ReviewController::class, 'update'])->middleware('auth');

// Include additional route files
require __DIR__.'/settings.php';
