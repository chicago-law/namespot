<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Offering;

class OfferingController extends Controller
{
    public function update($offering_id, Request $request)
    {
        // find the offering
        $offering = Offering::findOrFail($offering_id);

        // update room_id
        if ($request->input('room_id')):
            $offering->room_id = $request->input('room_id');
            $offering->save();
        endif;

        // update students
        if ($request->input('students')):
            $offering->students()->syncWithoutDetaching($request->input('students'));
        endif;

        return response()->json($offering,200);
    }

    public function createRoomFor($offering_id)
    {
        // find the offering
        $offering = Offering::findOrFail($offering_id);

        // find the offering's current room and replicate it
        $old_room = $offering->room;
        $new_room = $old_room->replicate();
        $new_room->type = 'custom';
        $new_room->name = $new_room->name . ' (customized for LAWS ' . $offering->catalog_nbr . ')';
        $new_room->db_match_name = null;
        $new_room->save();
        $new_room->id;

        // replicate the tables attached to the old room
        foreach ($old_room->tables as $table):
            $new_table = $table->replicate();
            $new_table->room_id = $new_room->id;
            $new_table->save();

            // get any students that were seated at this table for this
            // offering and reassign them.
            foreach ($offering->students as $student):
                if (!is_null($student->pivot->assigned_seat)):
                    list($old_table, $seat) = explode('_',$student->pivot->assigned_seat);
                    $new_assignment = $new_table->id . '_' . $seat;
                    $student->offerings()->updateExistingPivot($offering->id,['assigned_seat' => $new_assignment]);
                    $student->save();
                endif;
            endforeach;
        endforeach;

        // update the offering's room association
        $offering->room_id = $new_room->id;
        $offering->save();

        return response()->json(['newRoomID' => $new_room->id],200);
    }
}
