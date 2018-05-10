<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Offering extends Model
{
    public function instructors()
    {
        return $this->belongsToMany('App\Instructor');
    }

    public function room()
    {
        return $this->belongsTo('App\Room');
    }

    public function students()
    {
        return $this->belongsToMany('App\Student');
    }
}
