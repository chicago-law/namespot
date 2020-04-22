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
        'prefix',
        'sortable_name',
        'picture',
        'ais_last_seen',
        'canvas_last_seen',
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

    /**
     * Comes from AIS's first name field.
     */
    public function firstName()
    {
        return utf8_encode(nameCasing($this->first_name));
    }

    /**
     * Comes from AIS's middle name field.
     */
    public function middleName()
    {
        if ($this->middle_name) {
            return utf8_encode(nameCasing($this->middle_name));
        }
        return null;
    }

    /**
     * Comes from AIS's last name field.
     */
    public function lastName()
    {
        return utf8_encode(nameCasing($this->last_name));
    }

    /**
     * First choice is AIS's Preferred Name field.
     * Second choice is the first word of Canvas's "short name" field.
     */
    public function shortFirstName()
    {
        if ($this->short_first_name) {
            return utf8_encode(nameCasing($this->short_first_name));
        }
        return $this->firstName();
    }

    /**
     * Everything up to the comma in Canvas's "sortable name" field.
     *
     * Ie, "Thomas, Jonathan Taylor" -> "Thomas"
     * or "De La Rocha, Zack" -> "De La Rocha
     */
    public function shortLastName()
    {
        if ($this->short_last_name) {
            return utf8_encode(nameCasing($this->short_last_name));
        }
        return $this->lastName();
    }
}
