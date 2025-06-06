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


// --- This is now your main homepage route ---
Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');


// This route is for logged-in users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


// --- Your new route for the order page (This is perfect!) ---
Route::get('/order', function () {
    // This tells Inertia to render the 'OrderPage.tsx' component
    // from your resources/js/Pages directory.
    return Inertia::render('OrderPage');
})->name('order');


// Include other route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
