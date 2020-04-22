<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name',
        'type',
        'description',
        'seat_size',
        'db_match_name'
    ];
    public $timestamps = false;

    public function classes()
    {
        return $this->hasMany('App\Offering');
    }

    public function tables()
    {
        return $this->hasMany('App\Table');
    }

    /**
     * Find any offerings assigned to this room and set their room_id to null.
     */
    public function unassignOfferings() {
        $offerings = Offering::where('room_id', $this->id)->get();

        foreach ($offerings as $offering) {
            $offering->room_id = null;

            // We also need to clear out any seating assignments for this offering's
            // students.
            $offering->unseatStudents();

            $offering->save();
        }
    }
}
