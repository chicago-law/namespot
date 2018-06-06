<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Room;

class RoomController extends Controller
{
    protected $fillable = ['name','type','description','seat_size'];

    public function update($room_id, Request $request)
    {
        // find the room
        $room = Room::findOrFail($room_id);

        // loop through and make the updates
        foreach ($request->input() as $key => $value):
            $room->$key = $value;
        endforeach;

        // save and return
        $room->save();
        return response()->json('success',200);
    }
}
