<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OfferingsExport;
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
      // Because this room assignment was initiated by the user, we want to preserve
      // it, rather than just blow it away with our next nightly data fetch.
      $offering->is_preserve_room_id = 1;
    endif;

    // update students
    if ($request->input('students')):
      $offering->students()->syncWithoutDetaching($request->input('students'));
    endif;

    // update paper size
    if ($request->input('paper_size')):
      $offering->paper_size = $request->input('paper_size');
    endif;

    // update font size
    if ($request->input('font_size')):
      $offering->font_size = $request->input('font_size');
    endif;

    // update flip perspective
    if ($request->input('flipped') !== null):
      $offering->flipped = (bool) $request->input('flipped');
    endif;

    // update names to show
    if ($request->input('names_to_show')):
      $offering->names_to_show = $request->input('names_to_show');
    endif;

    // update use nicknames
    if ($request->input('use_nicknames') !== null):
      $offering->use_nicknames = (bool) $request->input('use_nicknames');
    endif;

    // timestamp this update
    $offering->updated_at = new Carbon();

    $offering->save();

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

    // Going to just keep the same room name. In places where it's relevant
    // for user to know that this is not the original template, just output
    // "(edited)" after the room name.
    $new_room->db_match_name = null;

    $new_room->save();

    // Store the student seat changes, so we can include in returned JSON.
    $seat_changes = [];

    // Replicate the tables attached to the old room.
    foreach ($old_room->tables as $table):
      $new_table = $table->replicate();
      $new_table->room_id = $new_room->id;
      $new_table->save();

      // Get any students that were seated at this table for this
      // offering and reassign them to its replicant.
      foreach ($offering->students as $student):
        if (!is_null($student->pivot->assigned_seat)):

          // if the table that we're looping through is the same as the table that
          // the student was assigned to, then do the replacement!
          list($old_table, $seat) = explode('_',$student->pivot->assigned_seat);
          if ( (String) $table->id === (String) $old_table) {
            $new_assignment = $new_table->id . '_' . $seat;
            $student->offerings()->updateExistingPivot($offering->id,['assigned_seat' => $new_assignment]);
            $student->save();
            $seat_changes[] = [
              $student->id => [
                'old seat' => $student->pivot->assigned_seat,
                'new seat' => $new_assignment
              ]
            ];
          }
        endif;
        unset($new_assignment, $old_table, $seat);
      endforeach;

    endforeach;

    // update the offering's room association
    $offering->room_id = $new_room->id;
    // Because this room assignment was initiated by the user, we want to preserve
    // it, rather than just blow it away with our next nightly data fetch.
    $offering->is_preserve_room_id = 1;

    // Timestamp this update.
    $offering->updated_at = new Carbon();

    $offering->save();

    return response()->json([
      'newRoomID' => $new_room->id,
      'seatChanges' => $seat_changes
    ], 200);
  }

  public function export()
  {
    return Excel::download(new OfferingsExport, 'offerings.xlsx');
  }
}
