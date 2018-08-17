<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    public $timestamps = false;

    public function teaches()
    {
        return $this->belongsToMany('App\Offering');
    }
}
