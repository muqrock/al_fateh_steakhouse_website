<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'menu_item_id', 'name', 'comment', 'rating', 'image_url',
    ];

    /**
     * Get the user that wrote this review
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the menu item this review is for
     */
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
