<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\OfferingResource;
use App\Http\Resources\EnrollmentsResource;
use App\Http\Resources\StudentResource;
use App\Offering;
use App\Student;

class OfferingController extends Controller
{
  public function get(Request $request)
  {
    $query = Offering::query();

    // Search by ID
    $id = $request->post('id');
    if ($id) {
      $query = $query->where('id', $id);
    }

    // If user is inst, restrict offerings to ones they're teaching or
    // manual creations they made. If staff, they can see all regular
    // offerings but still only manual creations they made.
    // Dev can see all 😇
    if (Auth::user()->role === 'inst') {
      $query = $query->where(function($subQ) {
        $subQ->whereHas('instructors', function($instQ) {
          $instQ->where('cnet_id', Auth::user()->cnet_id);
        });
        $subQ->orWhere('manually_created_by', '=', Auth::user()->id);
      });
    }
    /**
     * 09/16/20: Removing the code that restricts custom classes to only be
     * visible to their authors. Because of COVID we need to have alternate
     * sections of some classes, and we're using custom classes for that.
     * These need to be visible by all, just like regular classes.
     */
    // if (Auth::user()->role === 'staff') {
    //   $query = $query->where(function($subQ) {
    //     $subQ->whereNull('manually_created_by');
    //     $subQ->orWhere(function($subSubQ) {
    //       $subSubQ->whereNotNull('manually_created_by');
    //       $subSubQ->where('manually_created_by', '=', Auth::user()->id);
    //     });
    //   });
    // }

    // Search by term.
    $term_code = $request->post('termCode');
    if ($term_code) {
      $query = $query->where('term_code', $term_code);
    }

    // Get the results, eager loaded with the instructors.
    $query = $query->with('instructors')->get();

    $offerings = OfferingResource::collection($query)->keyBy->id;

    return response()->json([
      'offerings' => $offerings
    ]);
  }

  public function update(Request $request, $offering_id)
  {
    $offering = Offering::findOrFail($offering_id);
    $updates = $request->all();

    // Perform updates
    if (array_key_exists('room_id', $updates)) {
      $offering->room_id = $request->input('room_id');
      // Because this room assignment was initiated by the user, we want to preserve
      // it, rather than just blow it away with our next nightly data fetch.
      $offering->is_preserve_room_id = 1;

      // Because we just changed the room, we have to unseat everyone in it.
      $student_ids = $offering->students()->pluck('id')->toArray();
      $updated_students = [];
      foreach ($student_ids as $id) {
        $updated_students[$id] = ['assigned_seat' => null];
      }
      $offering->students()->sync($updated_students);
    }
    if (array_key_exists('student_id', $updates)) {
      $offering->students()->attach($updates['student_id']);
    }
    if (array_key_exists('paper_size', $updates)) {
      $offering->paper_size = $updates['paper_size'];
    }
    if (array_key_exists('font_size', $updates)) {
      $offering->font_size = $updates['font_size'];
    }
    if (array_key_exists('names_to_show', $updates)) {
      $offering->names_to_show = $updates['names_to_show'];
    }
    if (array_key_exists('use_nicknames', $updates)) {
      $offering->use_nicknames = $updates['use_nicknames'];
    }
    if (array_key_exists('use_prefixes', $updates)) {
      $offering->use_prefixes = $updates['use_prefixes'];
    }
    if (array_key_exists('flipped', $updates)) {
      $offering->flipped = $updates['flipped'];
    }
    if (array_key_exists('title', $updates)) {
      $offering->long_title = $updates['title'];
    }
    if (array_key_exists('term_code', $updates)) {
      $offering->term_code = $updates['term_code'];
    }
    if (array_key_exists('catalog_nbr', $updates)) {
      $offering->catalog_nbr = $updates['catalog_nbr'];
    }
    if (array_key_exists('section', $updates)) {
      $offering->section = $updates['section'];
    }

    // Timestamp this update
    $offering->updated_at = new Carbon();

    // Save and return
    $offering->save();
    return response()->json([
      'offerings' => [
        $offering->id => new OfferingResource($offering)
      ],
      'enrollments' => [
        $offering->id => new EnrollmentsResource($offering)
      ]
    ]);
  }

  public function create(Request $request)
  {
    $new_offering = new Offering;

    // Assign the authed user as the creator.
    $new_offering->manually_created_by = auth()->user()->id;

    // Attributes
    $title = $request->input('title');
    $term_code = $request->input('term_code');
    $catalog_nbr = $request->input('catalog_nbr');
    $section = $request->input('section');

    if (!$title) abort(400);

    $new_offering->long_title = $title;
    $new_offering->term_code = $term_code;
    $new_offering->catalog_nbr = $catalog_nbr;
    $new_offering->section = $section;

    $new_offering->save();

    return response()->json([
      'offerings' => [
        $new_offering->id => new OfferingResource($new_offering)
      ]
    ]);
  }

  public function delete($offering_id)
  {
    $offering = Offering::findOrFail($offering_id);
    $offering->delete();
    return response('Delete successful');
  }

  public function enrollments($offering_id)
  {
    $offering = Offering::findOrFail($offering_id);
    return response()->json([
      'enrollments' => [
        $offering->id => new EnrollmentsResource($offering)
      ]
    ]);
  }

  public function updateEnrollment(Request $request, $offering_id, $student_id)
  {
    if (!$offering_id || !$student_id) {
      abort(500, 'Missing required parameters.');
    }

    $offering = Offering::findOrFail($offering_id);

    if (!$offering) {
      abort(500, 'Offering not find with supplied ID.');
    }

    // We'll do a sync to attach the student id, in case this is a new relationship.
    $offering->students()->syncWithoutDetaching([$student_id]);

    // So far, updatable params include just seat.
    $updates = [];
    if (array_key_exists('seat', $request->all())) $updates['assigned_seat'] = $request->input('seat');

    if (count($updates)) {
      $offering->students()->updateExistingPivot($student_id, $updates);
    }

    return response()->json([
      'enrollments' => [
        $offering->id => new EnrollmentsResource($offering)
      ]
    ]);
  }
  public function createEnrollment(Request $request, $offering_id, $student_id)
  {
    $offering = Offering::findOrFail($offering_id);
    $student = Student::findOrFail($student_id);

    $existing_student_ids = $offering->students()->pluck('id')->toArray();
    if (in_array($student_id, $existing_student_ids)) {
      abort(500, 'Student already enrolled in offering.');
    }

    $offering->students()->attach($student_id, [
      'is_namespot_addition' => 1,
    ]);

    return response()->json([
      'enrollments' => [
        $offering->id => new EnrollmentsResource($offering)
      ],
      'students' => [
        $student_id => new StudentResource($student)
      ]
    ]);
  }

  public function deleteEnrollment(Request $request, $offering_id, $student_id)
  {
    $offering = Offering::findOrFail($offering_id);
    $student = Student::findOrFail($student_id);

    $existing_student_ids = $offering->students()->pluck('id')->toArray();
    if (!in_array($student_id, $existing_student_ids)) {
      abort(500, 'Student already not enrolled in offering.');
    }

    $offering->students()->detach($student_id);

    return response('Student removed from offering', 200);
  }
}
