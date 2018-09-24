<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Setting;

class HomeController extends Controller
{
    public function react()
    {
        $data = [];
        $academic_year = Setting::where('setting_name','academic_year')->first();
        $data['academic_year'] = isset($academic_year) ? $academic_year->setting_value : '2018';

        return view('react', $data);
    }

    public function print()
    {
        return view('print-react');
    }

    public function logout()
    {
        return view('logout');
    }
}
