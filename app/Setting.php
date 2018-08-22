<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['setting_name','setting_value'];
    public $timestamps = false;

    // No primary key on the setting's table
    protected $primaryKey = null;
    public $incrementing = false;
}
