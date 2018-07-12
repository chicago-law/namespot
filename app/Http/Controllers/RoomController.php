<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Room;

class RoomController extends Controller
{
    public function new()
    {
        $new_room = new Room;
        $new_room->name = 'untitled';
        $new_room->seat_size = '25';
        $new_room->type = 'template';
        $new_room->save();

        return response()->json([
            'id' => $new_room->id,
            'name' => $new_room->name
        ],200);
    }

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
        return response()->json('Success',200);
    }

    public function count()
    {
        $count = Room::where('type','template')->count();

        return response()->json($count, 200);
    }

    public function checkname(Request $request)
    {
        $is_in_use = true;

        $type = $request->input('type');
        $name = $request->input('name');
        $hits = Room::where($type, $name)->get();
        $hits->count() ? $is_in_use = false : false;

        return response()->json($is_in_use, 200);
    }
}
