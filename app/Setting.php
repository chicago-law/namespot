<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['setting_name','setting_value'];
    public $timestamps = false;

    protected $primaryKey = 'setting_name';
    public $incrementing = false;
}
