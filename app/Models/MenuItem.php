<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name', 'category', 'price', 'image',
    ];

    /**
     * Get reviews that mention this menu item
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'menu_item_id');
    }
}
