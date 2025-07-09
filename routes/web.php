<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // Moved to top
use App\Http\Controllers\MenuController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ReservationController;
use App\Models\MenuItem;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
|
*/


// Homepage Route
Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

// Public Routes
Route::get('/menu', [MenuController::class, 'index'])->name('menu');

Route::get('/about', function () {
    return Inertia::render('AboutPage');
})->name('about');

// Public view routes (accessible without login)
Route::get('/review', [ReviewController::class, 'index'])->name('review.index');
Route::get('/reservation', [ReservationController::class, 'index'])->name('reservation.index');

// Customer-only authenticated routes
Route::middleware(['customer'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Order route - requires customer login
    Route::get('/order', function () {
        $menuItems = MenuItem::all()->groupBy('category');
        return Inertia::render('OrderPage', [
            'menu' => $menuItems,
        ]);
    })->name('order');

    // Customer-only actions
    Route::post('/review', [ReviewController::class, 'store']);
    Route::post('/reservation', [ReservationController::class, 'store'])->name('reservation.store');
});


// Admin login/logout routes
Route::get('/admin/login', [\App\Http\Controllers\Auth\AdminSessionController::class, 'create'])->name('admin.login');
Route::post('/admin/login', [\App\Http\Controllers\Auth\AdminSessionController::class, 'store']);
Route::post('/admin/logout', [\App\Http\Controllers\Auth\AdminSessionController::class, 'destroy'])->name('admin.logout');

// Admin protected routes - Use proper middleware
Route::middleware(['admin'])->group(function () {
    Route::get('/admin', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/customers', [\App\Http\Controllers\AdminController::class, 'customers'])->name('admin.customers');
    Route::get('/admin/reservations', [\App\Http\Controllers\AdminController::class, 'reservations'])->name('admin.reservations');
    Route::get('/admin/reviews', [\App\Http\Controllers\AdminController::class, 'reviews'])->name('admin.reviews');
    
    // Review management routes
    Route::post('/admin/reviews/{review}/reply', [\App\Http\Controllers\AdminController::class, 'replyToReview'])->name('admin.reviews.reply');
    Route::delete('/admin/reviews/{review}', [\App\Http\Controllers\AdminController::class, 'deleteReview'])->name('admin.reviews.delete');
    
    Route::put('/admin/reservations/{id}', [\App\Http\Controllers\AdminController::class, 'updateReservation'])->name('admin.reservations.update');
    Route::delete('/admin/reservations/{id}', [\App\Http\Controllers\AdminController::class, 'deleteReservation'])->name('admin.reservations.delete');

    // ==================== MENU ROUTES ADDITION ====================
    Route::get('/admin/menu', [MenuController::class, 'index'])->name('admin.menu.index');
    Route::get('/admin/menu/create', [MenuController::class, 'create'])->name('admin.menu.create');
    Route::post('/admin/menu', [MenuController::class, 'store'])->name('admin.menu.store');
    Route::get('/admin/menu/{menu}/edit', [MenuController::class, 'edit'])->name('admin.menu.edit');
    Route::put('/admin/menu/{menu}', [MenuController::class, 'update'])->name('admin.menu.update');
    Route::delete('/admin/menu/{menu}', [MenuController::class, 'destroy'])->name('admin.menu.destroy');
    // In your admin routes group:
    Route::post('/admin/menu', [MenuController::class, 'store'])->name('admin.menu.store');
    Route::post('/admin/menu/{menu}', [MenuController::class, 'update'])->name('admin.menu.update');
    // ==================== END MENU ROUTES ====================
});

// Include other route files
require __DIR__.'/settings.php';