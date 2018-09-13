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

    public function students()
    {
        return $this->belongsToMany('App\Student')
            ->wherePivot('canvas_enrollment_state','active')
            ->withPivot(
                'assigned_seat',
                'is_namespot_addition',
                'canvas_enrollment_state',
                'canvas_role',
                'canvas_role_id',
                'is_in_AIS'
            );
    }

    public function namespotAddedStudents()
    {
        return $this->students()->where('is_namespot_addition',1);
    }
}
