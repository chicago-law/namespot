<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\StudentResource;
use App\Student;
use App\Offering;

class StudentController extends Controller
{
  public function get(Request $request)
  {
    $query = Student::query();
    $offering_id = $request->input('offeringId');
    $grad_term = $request->input('term');
    $plan = $request->input('plan');

    // Search by Offering.
    if ($offering_id) {
      $in_offering_ids = Offering::findOrFail($offering_id)->currentStudents()->pluck('id')->toArray();
      $query = $query->whereIn('id', $in_offering_ids);
    }

    // Search by graduation term.
    if ($grad_term) {
      $query = $query->where('exp_grad_term', $grad_term);
    }

    // Search by academic plan.
    if ($plan) {
      $query = $query->where('academic_prog', $plan);
    }

    $response = StudentResource::collection($query->get())->keyBy->id;

    return response()->json([
      'students' => $response
    ]);
  }

  public function update(Request $request, $student_id)
  {
    $student = Student::findOrFail($student_id);

    // Let's try using the fill method to do them all at once.
    // We can break it out into specific properties if need be.
    $student->fill($request->input());
    $student->save();

    return response()->json([
      $student_id => new StudentResource($student)
    ]);
  }

  public function uploadPicture(Request $request)
  {
    $new_picture = $request->newPicture;

    if ($new_picture->isValid()):
    $fileName = 'uploaded_' . $new_picture->getBasename() . '.' . $new_picture->guessExtension();
    Storage::disk('public')->put("student_pictures/{$fileName}", file_get_contents($new_picture));
    $success = Storage::disk('public')->exists("student_pictures/{$fileName}");
    else:
    $success = false;
    $fileName = null;
    endif;

    return response()->json([
    'success' => $success,
    'fileName' => $fileName
    ]);
  }
}
