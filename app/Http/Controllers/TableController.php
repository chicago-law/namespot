<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Table;

class TableController extends Controller
{
    function update(Request $request)
    {
        $id = $request->input('id');
        $table = Table::firstOrNew(['id' => $id]);

        $table->room_id = (int) $request->input('room_id');
        $table->sX = $request->input('sX');
        $table->sY = $request->input('sY');
        $table->eX = $request->input('eX');
        $table->eY = $request->input('eY');
        $table->qX = $request->input('qX');
        $table->qY = $request->input('qY');
        $table->qY = $request->input('qY');
        $table->seat_count = $request->input('seat_count');
        $table->label_position = $request->input('label_position');

        $table->save();

        return response()->json($table, 200);
    }

    public function delete($table_id)
    {
        Table::destroy($table_id);

        return response()->json('success',200);
    }
}
