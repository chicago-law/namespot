<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    public function classes()
    {
        return $this->hasMany('App\Offering');
    }

    public function tables()
    {
        return $this->hasMany('App\Table');
    }
}
