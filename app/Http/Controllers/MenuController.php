<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use GuzzleHttp\Client;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    $menuItems = MenuItem::all();

    // If visiting /admin/menu, show admin view
    if (request()->is('admin*')) {
        return inertia('AdminMenuList', [
            'menus' => $menuItems
        ]);
    }

    // For public MenuPage
    $groupedItems = $menuItems->groupBy('category');
    return inertia('MenuPage', [
        'menu' => $groupedItems
    ]);
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('AdminMenuList');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255', // Added category validation
            'price' => 'required|numeric|min:0', // Added min:0 validation
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,heic|max:2048', // Allow .heic
        ]);

        $menu_item = new MenuItem();
        $menu_item->name = $validated['name'];
        $menu_item->category = $validated['category'] ?? null; // Handle null category
        $menu_item->price = $validated['price'];
        
        if ($request->hasFile('image')) {
            $url = $this->uploadToSupabase($request->file('image'));
            $menu_item->image = $url;
        }
        
        $menu_item->save();
        
        return redirect()->back()->with('success', 'Menu item created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(MenuItem $menu)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MenuItem $menu)
    {
        return Inertia::render('AdminMenuList', [
            'editMenu' => $menu
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MenuItem $menu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255', // Added category
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,heic|max:2048', // Allow .heic
        ]);

        $menu->name = $validated['name'];
        $menu->category = $validated['category'] ?? null;
        $menu->price = $validated['price'];
        
        if ($request->hasFile('image')) {
            // No need to delete old image in Supabase for now
            $url = $this->uploadToSupabase($request->file('image'));
            $menu->image = $url;
        }
        
        $menu->save();
        
        return redirect()->back()->with('success', 'Menu item updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuItem $menu)
    {
        if ($menu->image) {
            Storage::disk('public')->delete($menu->image);
        }
        $menu->delete();
        return redirect()->back()->with('success', 'Menu item deleted successfully');
    }

    private function uploadToSupabase($file)
    {
        $bucket = env('SUPABASE_BUCKET');
        $supabaseUrl = env('SUPABASE_URL');
        $serviceKey = env('SUPABASE_SERVICE_KEY');

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = "public/$filename"; // 'public' folder in your bucket

        $client = new Client([
            'base_uri' => "$supabaseUrl/storage/v1/",
            'headers' => [
                'Authorization' => "Bearer $serviceKey",
                'apikey' => $serviceKey,
            ],
        ]);

        $response = $client->post("object/$bucket/$path", [
            'headers' => [
                'Content-Type' => $file->getMimeType(),
                'Cache-Control' => 'public, max-age=31536000',
            ],
            'body' => fopen($file->getRealPath(), 'r'),
        ]);

        if ($response->getStatusCode() === 200) {
            // Construct public URL
            return "$supabaseUrl/storage/v1/object/$bucket/$path";
        }
        return null;
    }
}