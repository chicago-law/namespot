<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Offering;

class OfferingController extends Controller
{
    public function createRoomFor($offering_id)
    {
        // find the offering
        $offering = Offering::findOrFail($offering_id);

        // find the offering's current room and replicate it
        $old_room = $offering->room;
        $new_room = $old_room->replicate();
        $new_room->save();

        // update the offering's room association
        $offering->room()->dissociate($old_room);
        $offering->room()->associate($new_room);
        $offering->save();

        return response()->json(['newRoomID' => $new_room->id],'200');
    }
}
