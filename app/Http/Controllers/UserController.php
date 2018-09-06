<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
    public function fetch($user_id)
    {
        $user = User::findOrFail($user_id);

        return response()->json($user);
    }
}
