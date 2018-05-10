<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    public function room()
    {
        return $this->belongsTo('App\Room');
    }
}
