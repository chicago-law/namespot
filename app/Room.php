<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['name','type','description','seat_size'];

    public function classes()
    {
        return $this->hasMany('App\Offering');
    }

    public function tables()
    {
        return $this->hasMany('App\Table');
    }
}
