<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    // Commenting out because Laravel Scout's indexing can't handle the mass
    // import of data from AIS and Canvas.
    // use Searchable;

    public $fillable = [
        'canvas_id',
        'chicago_id',
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

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();

        // Customize array...

        return $array;
    }

    public function offerings()
    {
        return $this->belongsToMany('App\Offering')->withPivot(
            'assigned_seat',
            'is_namespot_addition',
            'canvas_enrollment_state',
            'canvas_role',
            'canvas_role_id',
            'is_in_AIS'
        );
    }
}
