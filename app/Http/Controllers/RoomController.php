<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Room;
use App\Table;

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
        ], 200);
    }

    public function update($room_id, Request $request)
    {
        // find the room
        $room = Room::findOrFail($room_id);

        // loop through and make the updates
        foreach ($request->input() as $key => $value):
            $room->$key = $value;
        endforeach;

        // save
        $room->save();

        // If the room is custom, then updating it should also touch
        // updated_at timestamp of its offering (which will be just one offering).
        if ($room->type === 'custom') {
            $offering = $room->classes()->first();
            $offering->updated_at = new Carbon();
            $offering->save();
        }

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

    public function nudgedown(Request $request)
    {
        $tables = Table::where('room_id', $request->input('room_id'))->get();

        foreach ($tables as $table):
            $table->sY = $table->sY + 1;
            $table->eY = $table->eY + 1;
            !is_null($table->qY) ? $table->qY = $table->qY + 1 : false;
            $table->save();
        endforeach;

        return response()->json('success', 200);
    }
}
