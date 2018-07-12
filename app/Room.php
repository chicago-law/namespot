<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['name','type','description','seat_size','db_match_name'];

    public function classes()
    {
        return $this->hasMany('App\Offering');
    }

    public function tables()
    {
        return $this->hasMany('App\Table');
    }
}
