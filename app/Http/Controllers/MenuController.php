<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $menuItems = MenuItem::all();
    
    // For AdminMenuList
    if (request()->is('admin*')) {
        return inertia('AdminMenuList', [
            'menus' => $menuItems
        ]);
    }
    
    // For MenuPage (group by category)
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Added mime types
        ]);

        $menu_item = new MenuItem();
        $menu_item->name = $validated['name'];
        $menu_item->category = $validated['category'] ?? null; // Handle null category
        $menu_item->price = $validated['price'];
        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_items', 'public');
            $menu_item->image = $path;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $menu->name = $validated['name'];
        $menu->category = $validated['category'] ?? null;
        $menu->price = $validated['price'];
        
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($menu->image) {
                Storage::disk('public')->delete($menu->image);
            }
            $path = $request->file('image')->store('menu_items', 'public');
            $menu->image = $path;
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
}