<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Offering extends Model
{
    protected $fillable = ['room_id','catalog_nbr'];

    public function __construct()
    {
      $this->dateFormat = config('app.env') === 'local' ? 'Y-m-d H:i:s' : false;
    //   $this->dateFormat = 'Y-m-d H:i:s';
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
