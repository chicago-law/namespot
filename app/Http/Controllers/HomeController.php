<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function react()
    {
        return view('react');
    }

    public function logout()
    {
        return view('logout');
    }
}
