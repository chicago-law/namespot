<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    public $timestamps = false;
    protected $fillable = [
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

    public function offerings()
    {
        return $this->belongsToMany('App\Offering')->withPivot(
            'assigned_seat',
            'is_namespot_addition',
            'canvas_enrollment_state',
            'canvas_role',
            'ais_enrollment_state',
            'ais_enrollment_reason',
            'is_in_ais'
        );
    }

    // Return the offerings that match the passed in term and are also active in AIS
    public function activeEnrollments($term)
    {
        return $this->offerings()
            ->where('term_code', $term)
            ->wherePivot('is_in_ais', 1);
    }
}
