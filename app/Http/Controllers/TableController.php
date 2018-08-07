<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Table;

class TableController extends Controller
{
    function update(Request $request)
    {
        $id = $request->input('id');

        if (!is_null($id) && $id !== 'new'):
            $table = Table::findOrFail($id)->update([
                'sX' => $request->input('sX'),
                'sY' => $request->input('sY'),
                'eX' => $request->input('eX'),
                'eY' => $request->input('eY'),
                'qX' => $request->input('qX'),
                'qY' => $request->input('qY'),
                'qY' => $request->input('qY'),
                'seat_count' => $request->input('seat_count'),
                'label_position' => $request->input('label_position')
                ]);
            else:
                $new_table = new Table;
                $new_table->room_id = $request->input('room_id');
                $new_table->sX = $request->input('sX');
                $new_table->sY = $request->input('sY');
                $new_table->eX = $request->input('eX');
                $new_table->eY = $request->input('eY');
                $new_table->qX = $request->input('qX');
                $new_table->qY = $request->input('qY');
                $new_table->seat_count = $request->input('seat_count');
                $new_table->label_position = $request->input('label_position');
            $new_table->save();
        endif;

        return response()->json('success',200);
    }

    public function delete($table_id)
    {
        Table::destroy($table_id);

        return response()->json('success',200);
    }
}
