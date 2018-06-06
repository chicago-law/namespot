<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Offering;
use App\Room;

class HomeController extends Controller
{
    public function show()
    {
        // $data['class'] = Offering::first();

        return view('home', $data);
    }
}
