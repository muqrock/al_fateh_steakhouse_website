<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menu_items = MenuItem::all();
        return inertia('AdminMenuList', [
            'menus' => $menu_items
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $menu_item = new MenuItem();
        $menu_item->name = $validated['name'];
        $menu_item->price = $validated['price'];
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_items', 'public');
            $menu_item->image = $path;
        }
        $menu_item->save();
        return redirect()->back();
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MenuItem $menu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $menu->name = $validated['name'];
        $menu->price = $validated['price'];
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_items', 'public');
            $menu->image = $path;
        }
        $menu->save();
        return redirect()->back();
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
        return redirect()->back();
    }
}
