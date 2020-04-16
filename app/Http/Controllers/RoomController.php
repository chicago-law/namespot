<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Resources\OfferingResource;
use App\Http\Resources\EnrollmentsResource;
use App\Http\Resources\RoomResource;
use App\Room;
use App\Offering;

class RoomController extends Controller
{
  public function get(Request $request)
  {
    $query = Room::query();

    // Search by ID
    $id = $request->input('roomId');
    if ($id) {
      $query = $query->where('id', $id);
    } else {
      // If no ID, then just return all the rooms that are templates.
      $query = $query->where('type', 'template');
    }

    $query = $query->get();

    $rooms = RoomResource::collection($query)->keyBy->id;

    return response()->json([
      'rooms' => $rooms
    ]);
  }

  public function update(Request $request, $room_id)
  {
    $room = Room::findOrFail($room_id);
    $updates = $request->all();

    // Seat size
    if (array_key_exists('seat_size', $updates)) {
      $room->seat_size = $request->seat_size;
    }

    // Room name
    if (array_key_exists('name', $updates)) {
      if ($room->name === '') {
        $room->name = null;
      } else {
        $room->name = $request->name;
      }
    }

    // Save and return
    $room->save();
    return response()->json([
      'rooms' => [
        $room->id => new RoomResource($room)
      ]
    ]);
  }

  public function create(Request $request)
  {
    $new_room = new Room;

    // Aiming for a sensible default seat size
    // (though null is technically allowed)
    $new_room->seat_size = 75;

    // Default to a reusable 'template' type. If this is a custom room,
    // we'll change it to that next.
    $new_room->type = 'template';

    // Now save. Gives $new_room a usable ID.
    $new_room->save();

    // If an offering ID was in the request, then we're creating a new custom
    // room for an offering.
    $offering_id = $request->input('offeringId');
    if ($offering_id) {
      $offering = Offering::findOrFail($offering_id);
      $new_room->type = 'custom';
      $new_room->db_match_name = null;

      // Save
      $new_room->save();

      // If the offering has a room currently, duplicate its properties
      // on the new room and move over any students that were seated.
      $old_room = $offering->room;
      if ($old_room) {
        $new_room->name = $old_room->name;
        $new_room->seat_size = $old_room->seat_size;
        $new_room->save();

        // Replicate the tables attached to the old room.
        foreach ($old_room->tables as $table):
          $new_table = $table->replicate();
          $new_table->room_id = $new_room->id;
          $new_table->save();

          // Get any students that were seated at this table for this
          // offering and reassign them to its replicant.
          foreach ($offering->students as $student):
            if (!is_null($student->pivot->assigned_seat)) {
              // Explode the seat value. It's formatted like "tableId_seatIndex".
              list($old_table_id, $seat_index) = explode('_', $student->pivot->assigned_seat);

              // if the table that we're looping through is the same as the table that
              // this student was assigned to, then do the replacement!
              if ((string) $table->id === (string) $old_table_id) {
                $new_assignment = $new_table->id . '_' . $seat_index;
                $student->offerings()->updateExistingPivot($offering->id, ['assigned_seat' => $new_assignment]);
                $student->save();
              }
            }
            unset($new_assignment, $old_table_id, $seat_index);

          endforeach; // End student loop
        endforeach; // End table loop
      } // End old_room If

      // Attach new room to offering.
      $offering->room_id = $new_room->id;

      // Because this room assignment was initiated by the user, we want to preserve
      // it, rather than just blowing it away with our next nightly data fetch.
      $offering->is_preserve_room_id = 1;

      // Timestamp this update.
      $offering->updated_at = new Carbon();

      // Save
      $offering->save();
    } // End offering_id If

    // Build the response and return.
    $response_array = [
      'rooms' => [
        $new_room->id => new RoomResource($new_room)
      ]
    ];

    if ($offering_id) {
      $response_array['enrollments'] = [
        $offering->id => new EnrollmentsResource($offering)
      ];
      $response_array['offerings'] = [
        $offering_id => new OfferingResource($offering)
      ];
    }

    return response()->json($response_array);
  }

  public function delete($room_id)
  {
    // First remove any attached offerings.
    $room = Room::findOrFail($room_id);
    $room->unassignOfferings();

    $delete = Room::destroy($room_id);

    if ($delete === 1) {
      return response('Delete successful', 200);
    }
    return response('Delete unsuccessful', 500);
  }
}
