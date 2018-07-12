<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Student extends Model
{
    use Searchable;


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
        return $this->belongsToMany('App\Offering')->withPivot('assigned_seat');
    }
}
