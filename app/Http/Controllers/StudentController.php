<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Student;
use App\Offering;
use App\Http\Resources\Student as StudentResource;

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
                case 'email':
                case 'nickname':
                case 'picture':
                    $student->$key = $value;
                    break;
                case 'assigned_seat':
                    $student->offerings()->updateExistingPivot($request->input('offering_id'),['assigned_seat' => $request->input('assigned_seat')]);
                    $offering = $student->offerings()->find($request->input('offering_id'));
                    $offering->updated_at = new Carbon();
                    $offering->save();
                    break;
                case 'manually_attached':
                    $student->offerings()->sync([ $request->input('offering_id') => ['manually_attached' => true] ]);
                    $offering = $student->offerings()->find($request->input('offering_id'));
                    $offering->updated_at = new Carbon();
                    $offering->save();
                    break;
            }
        endforeach;

        // save and return
        $student->save();

        $response = new StudentResource($student);

        return response()->json($response,200);
    }

    public function search(Request $request)
    {
        $s = $request->input('s');

        // $results = Student::search($s)->get();
        $results = Student::where('full_name', "LIKE", "%$s%")
            ->orWhere('short_full_name', "LIKE", "%$s%")
            ->orWhere('nickname', "LIKE", "%$s%")
            ->orWhere('cnet_id', "LIKE", "%$s%")
            ->get();

        // if a limit is supplied in parameters, take that many, otherwise just
        // take them all
        $limit = $request->input('limit') ? $request->input('limit') : $results->count();

        $response = [
            'count' => $results->count(),
            'students' => StudentResource::collection($results)->take($limit)
        ];

        return response()->json($response, 200);
    }

    public function unenroll(Request $request)
    {
        $student = Student::findOrFail($request->input('student_id'));

        // Update timestamp of the offering in question
        // (needs to happen before we detach!)
        $offering = $student->offerings()->find($request->input('offering_id'));
        $offering->updated_at = new Carbon();
        $offering->save();

        // Now detach
        $student->offerings()->detach($request->input('offering_id'));

        return response()->json('success',200);
    }

    public function term($term_code, Request $request)
    {
        $students_array = [];
        $offerings = Offering::where('term_code', $term_code)->get();
        foreach ($offerings as $offering):
            foreach ($offering->students as $student):
                if (!array_key_exists($student->id, $students_array)):
                    $students_array[] = new StudentResource($student);
                endif;
            endforeach;
        endforeach;

        return response()->json($students_array);
    }

    public function upload_picture(Request $request)
    {
        $new_picture = $request->newPicture;

        if ($new_picture->isValid()):
            $name = $new_picture->getBasename() . "." . $new_picture->guessExtension();
            $path = "images/students/{$name}";
            $result = move_uploaded_file($new_picture, $path);
        else:
            $result = false;
            $name = null;
        endif;

        return response()->json([
            'result' => $result,
            'name' => $name
        ]);
    }
}
