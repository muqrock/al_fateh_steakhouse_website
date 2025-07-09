<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'menu_item_id', 'name', 'comment', 'rating', 'image_url',
        'admin_reply', 'admin_id', 'admin_replied_at',
    ];

    protected $casts = [
        'admin_replied_at' => 'datetime',
    ];

    /**
     * Get the user that wrote this review
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who replied to this review
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the menu item this review is for
     */
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
