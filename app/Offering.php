<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Offering extends Model
{
    protected $fillable = ['room_id','catalog_nbr'];

    // We're disabling the built in timestamp functionality. There is still the updated_at
    // column though, and we're going to use it manually. Why? Because otherwise everything
    // is timestamp touched every 6pm, 6am when we fetch new app data and that makes it
    // pretty useless.
    public $timestamps = false;

    public function __construct()
    {
      $this->dateFormat = config('app.env') === 'local' ? 'Y-m-d H:i:s' : false;
    }

    public function instructors()
    {
        return $this->belongsToMany('App\Instructor');
    }

    public function room()
    {
        return $this->belongsTo('App\Room');
    }

    // Student is just give me back all the students we have ever had enrolled,
    // regardless of their enrollment state in either Canvas or AIS.
    public function students()
    {
        return $this->belongsToMany('App\Student')->withPivot(
            'assigned_seat',
            'is_namespot_addition',
            'canvas_enrollment_state',
            'canvas_role',
            'ais_enrollment_state',
            'is_in_ais'
       );
    }

    // We're defining currentStudents as students that are coming back from either
    // AIS or Canvas as still enrolled the close. So we're pulling out canvas's inactive,
    // and their deleted. Also pulling out AIS's withdrawn. Or you can be a manual FA addition.
    public function currentStudents()
    {
        return $this->students()
            ->where(function($q) {
                // Good with Canvas
                $q->whereIn('canvas_enrollment_state', [
                    'active',
                    'invited',
                    'current_and_invited',
                    'current_and_future',
                    'current_and_concluded',
                    'creation_pending',
                    'completed'
                ])
                // Good with AIS
                ->orWhere([
                    'is_in_ais' => 1,
                    'ais_enrollment_state' => 'E'
                ])
                // Good with the FAs
                ->orWhere('is_namespot_addition', 1);
            });
    }

    public function namespotAddedStudents()
    {
        return $this->students()->where('is_namespot_addition',1);
    }
}
