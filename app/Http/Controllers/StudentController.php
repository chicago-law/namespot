<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Student;

class StudentController extends Controller
{
    protected $fillable = ['nickname','email'];

    public function update($student_id, Request $request)
    {
        // find the student
        $student = Student::findOrFail($student_id);

        // loop through and make the updates
        // handle each one as needed through the switch
        foreach ($request->input() as $key => $value):
            switch ($key) {
                case 'nickname':
                case 'email':
                    $student->$key = $value;
                    break;
                case 'assigned_seat':
                    $student->offerings()->updateExistingPivot($request->input('offering_id'),['assigned_seat' => $request->input('assigned_seat')]);
                    break;
            }
        endforeach;

        // save and return
        $student->save();
        return response()->json('success',200);
    }
}
