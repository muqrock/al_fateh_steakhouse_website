<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
Route::get('/order', function () {
    return Inertia::render('OrderPage');
})->name('order');



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

Route::get('/order', [OrderController::class, 'index'])->name('order');



// --- Add this new route for your menu page ---
Route::get('/menu', function () {
    return Inertia::render('MenuPage');
})->name('menu');

// --- Add this new route for your review page ---
Route::get('/review', function () {
    return Inertia::render('ReviewPage');
})->name('review');

// --- Add this new route for your about page ---
Route::get('/about', function () {
    return Inertia::render('AboutPage');
})->name('about');


// Admin Dashboard Route
Route::get('/admin', function () {
    return Inertia::render('AdminDashboard');
});



//  NEW Reservation Routes

use App\Http\Controllers\ReservationController;

Route::get('/reservation', [ReservationController::class, 'index'])->name('reservation.index');
Route::post('/reservation', [ReservationController::class, 'store'])->name('reservation.store');



// Include other route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';