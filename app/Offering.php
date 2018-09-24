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

    /**
     * This method will just give back all the students we have ever had enrolled
     * in this course, regardless of current status.
     */
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

    /**
     * This method will give back only students that meet requirements from each
     * of the possible sources. It does its best to only give back students that
     * are currently and actively enrolled and have not dropped or withdrawn.
     */
    public function currentStudents()
    {
        return $this->students()
            // Get rid of any Test Students...
            ->where('full_name', '!=', 'Test Student')
            ->where(function($q) {
                // Enrolled through Canvas
                $q->whereIn('canvas_enrollment_state', [
                    'active',
                    'invited',
                    'current_and_invited',
                    'current_and_future',
                    'current_and_concluded',
                    'creation_pending',
                    'completed'
                ])
                // Enrolled through AIS
                ->orWhere([
                    'is_in_ais' => 1,
                    'ais_enrollment_state' => 'E'
                ])
                // Manual addition through the seating chart app
                ->orWhere('is_namespot_addition', 1);
            });
    }

    public function namespotAddedStudents()
    {
        return $this->students()->where('is_namespot_addition',1);
    }
}
