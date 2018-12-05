<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    public $timestamps = false;
    public $fillable = [
        'emplid',
        'cnet_id',
        'first_name',
        'last_name',
        'email',
    ];

    public function teaches()
    {
        return $this->belongsToMany('App\Offering');
    }
}
