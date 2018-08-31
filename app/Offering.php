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
        return $this->belongsToMany('App\Student')->withPivot('assigned_seat', 'manually_attached');
    }

    public function manuallyAttachedStudents()
    {
        return $this->students()->where('manually_attached',1);
    }
}
