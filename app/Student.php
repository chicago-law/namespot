<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    public $fillable = [
        'canvas_id',
        'cnet_id',
        'full_name',
        'first_name',
        'last_name',
        'short_name_first',
        'short_name_last',
        'nickname',
        'sortable_name',
        'picture'
    ];

    public $timestamps = false;

    public function offerings()
    {
        return $this->belongsToMany('App\Offering')->withPivot(
            'assigned_seat',
            'is_namespot_addition',
            'canvas_enrollment_state',
            'canvas_role',
            'ais_enrollment_state',
            'is_in_ais'
        );
    }
}
