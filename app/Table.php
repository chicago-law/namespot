<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    protected $fillable = [
        'room_id',
        'sX',
        'sY',
        'eX',
        'eY',
        'qX',
        'qY',
        'seat_count',
        'label_position'
    ];

    public function room()
    {
        return $this->belongsTo('App\Room');
    }
}
