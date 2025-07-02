
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MenuController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Order Login Route
Route::get('/login', function () {
    return Inertia::render('LoginPage');
})->name('login');


// Homepage Route
Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');

// Dashboard Route (for logged-in users)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Order Page Route
Route::get('/order', function () {
    return Inertia::render('OrderPage');
})->name('order');


// --- Add this new route for your menu page ---
Route::get('/menu', function () {
    return Inertia::render('MenuPage');
})->name('menu');

// (Removed duplicate /review route)

// Review Routes
use App\Http\Controllers\ReviewController;

Route::get('/review', [ReviewController::class, 'index'])->name('review.index');
Route::post('/review', [ReviewController::class, 'store']);

// --- Add this new route for your about page ---
Route::get('/about', function () {
    return Inertia::render('AboutPage');
})->name('about');


// Admin Dashboard Route
Route::get('/admin', function () {
    return Inertia::render('AdminDashboard');
});

// Admin Menu List Route (for Inertia page)
Route::get('/admin/menu', [MenuController::class, 'index'])->name('admin.menu.index');

// For development: Remove auth/admin middleware to allow CRUD without login
Route::resource('admin/menu', MenuController::class)->except(['index']);


//  NEW Reservation Routes

use App\Http\Controllers\ReservationController;

Route::get('/reservation', [ReservationController::class, 'index'])->name('reservation.index');
Route::post('/reservation', [ReservationController::class, 'store'])->name('reservation.store');



// Include other route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';