<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\TableResource;
use App\Table;

class TableController extends Controller
{
    public function get(Request $request)
    {
        $room_id = $request->input('roomId');

        if ($room_id) {
            $tables = Table::where('room_id', $room_id)->get();

            return response()->json([
                'tables' => TableResource::collection($tables)->keyBy->id
            ]);
        }

        abort(500, 'Room ID not included in request');
    }

    public function update(Request $request, $tableId)
    {
        $table = Table::findOrFail($tableId);
        $updates = $request->all();

        if (array_key_exists('eX', $updates)) $table->eX = $updates['eX'];
        if (array_key_exists('eY', $updates)) $table->eY = $updates['eY'];
        if (array_key_exists('sX', $updates)) $table->sX = $updates['sX'];
        if (array_key_exists('sY', $updates)) $table->sY = $updates['sY'];
        if (array_key_exists('qX', $updates)) $table->qX = $updates['qX'];
        if (array_key_exists('qY', $updates)) $table->qY = $updates['qY'];
        if (array_key_exists('label_position', $updates)) $table->label_position = $updates['label_position'];
        if (array_key_exists('seat_count', $updates)) $table->seat_count = $updates['seat_count'];

        $table->save();
        return response()->json([
            'tables' => [
                $table->id => new TableResource($table)
            ]
        ]);
    }

    public function create(Request $request)
    {
        $table = new Table;
        $params = $request->all();

        // Attach required points or fail.
        array_key_exists('eX', $params) ? $table->eX = $params['eX'] : abort(500, 'Missing required table parameter');
        array_key_exists('eY', $params) ? $table->eY = $params['eY'] : abort(500, 'Missing required table parameter');
        array_key_exists('sX', $params) ? $table->sX = $params['sX'] : abort(500, 'Missing required table parameter');
        array_key_exists('sY', $params) ? $table->sY = $params['sY'] : abort(500, 'Missing required table parameter');
        array_key_exists('room_id', $params) ? $table->room_id = $params['room_id'] : abort('Missing required table parameter');
        array_key_exists('label_position', $params) ? $table->label_position = $params['label_position'] : abort('Missing required table parameter');
        array_key_exists('seat_count', $params) ? $table->seat_count = $params['seat_count'] : abort('Missing required table parameter');

        // Attach curve points if they're there.
        if (array_key_exists('qX', $params)) $table->qX = $params['qX'];
        if (array_key_exists('qY', $params)) $table->qY = $params['qY'];

        // Save and return.
        $table->save();
        return response()->json(new TableResource($table));
    }

    public function delete(Request $request, $table_id)
    {
        Table::destroy($table_id);
    }
}
