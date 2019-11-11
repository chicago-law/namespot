<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Offering extends Model
{
    protected $fillable = ['room_id', 'catalog_nbr', 'long_title'];

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
     * This method will just give back all the students associated with this
     * course, without any constraints as to enrollment status.
     */
    public function students()
    {
        return $this->belongsToMany('App\Student')->withPivot(
            'assigned_seat',
            'canvas_role',
            'canvas_enrollment_state',
            'ais_enrollment_state',
            'ais_enrollment_reason',
            'is_in_ais',
            'is_namespot_addition'
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
            // Do a big, inclusive query of anyone who looks good from their
            // respective enrollment sources.
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
                ->orWhere('is_in_ais', 1)
                // Manual addition through the seating chart app
                ->orWhere('is_namespot_addition', 1);
            })
            // Then do any filtering for things that automatically
            // mean we don't want you in the current students list.
            // No withdrawn:
            ->where(function($q) {
                $q->where('ais_enrollment_reason', '!=', 'WDRW')
                  ->orWhereNull('ais_enrollment_reason');
            })
            // No Test Students:
            ->where(function($q) {
                $q->where('full_name', '!=', 'Test Student')
                  ->orWhereNull('full_name');
            });
    }

    public function namespotAddedStudents()
    {
        return $this->students()->where('is_namespot_addition',1);
    }

    public function title() {
        if ($this->long_title) return $this->long_title;
        if ($this->title) return $this->title;
        return '';
    }
}
