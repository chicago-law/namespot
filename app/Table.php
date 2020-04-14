<?php

namespace App;

use App\Student;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Table extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'room_id',
        'sX',
        'sY',
        'eX',
        'eY',
        'qX',
        'qY',
        'seat_count',
        'label_position'
    ];

    public function room()
    {
        return $this->belongsTo('App\Room');
    }

    public function studentsAtTable()
    {
        // Find all students with this table ID in their assigned seat.
        return Student::whereHas('offerings', function ($offeringQuery) {
            $offeringQuery->where('assigned_seat', 'like', $this->id . '_%');
        });
    }

    public function removeInvalidSeats()
    {
        $seated_students = $this->studentsAtTable()->with('offerings')->get();

        // For each student, find the offerings where they're at this table.
        foreach ($seated_students as $student) {
            $table_offerings = $student
                ->offerings()
                ->wherePivot('assigned_seat', 'like', $this->id . '_%')
                ->get();

            foreach ($table_offerings as $offering) {
                // Extract the seat num. Is it beyond the table's seat count?
                // (assigned_seat looks like this: "{table_id}_{seat_num}")
                $seat_num = intval(rtrim(explode('_', $offering->pivot->assigned_seat)[1]));
                // (Seat nums are zero-based. Table's seat count is one-based)
                if ($seat_num >= $this->seat_count) {
                    $student->offerings()->updateExistingPivot($offering->id, [
                        'assigned_seat' => null
                    ]);
                }
            }
        }
    }

    public function removeAllSeatAssignments()
    {
        $seated_students = $this->studentsAtTable()->with('offerings')->get();

        // For each student, find the offerings where they're at this table.
        foreach ($seated_students as $student) {
            $table_offerings = $student
                ->offerings()
                ->wherePivot('assigned_seat', 'like', $this->id . '_%')
                ->get();

            foreach ($table_offerings as $offering) {
                $student->offerings()->updateExistingPivot($offering->id, [
                    'assigned_seat' => null
                ]);
            }
        }
    }
}
