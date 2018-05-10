<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    public function teaches()
    {
        return $this->belongsToMany('App\Offering');
    }
}
