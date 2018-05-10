<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    public function offerings()
    {
        return $this->belongsToMany('App\Offering')->withPivot('assigned_seat');
    }
}
