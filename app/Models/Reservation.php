<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone', // ✅ Make sure this is included
        'reservation_date',
        'reservation_time',
        'guests',
    ];


}
