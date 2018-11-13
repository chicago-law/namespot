<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Student;

class ImportController extends Controller
{
  public function students(Request $request)
  {
    // These are the Student properties that the DB knows about and will allow us to use.
    $valid_props = [
      'id',
      'canvas_id',
      'cnet_id',
      'first_name',
      'middle_name',
      'last_name',
      'short_first_name',
      'short_last_name',
      'nickname',
      'picture',
      'email',
      'is_ferpa',
      'academic_career',
      'academic_prog',
      'academic_prog_descr',
      'academic_level',
      'exp_grad_term',
    ];
    $row = 1; // For keeping track of what row we're in. Start with 1.
    $students = []; // For keeping track of students we've CRUDed.

    if ($_FILES['namespotData']) {
      $file = $_FILES['namespotData']['tmp_name'];
      if (($handle = fopen($file, 'r')) !== false) {

        // Here's where we'll store the properties that are in the spreadsheet's header row.
        $included_props = [];

        // Now while your way through the rows....
        while (($rowData = fgetcsv($handle)) !== false) {

          // Process the header row.
          if ($row === 1) {
            // Look at all the strings in the header row and make sure we recognize them.
            // If we do, add them to our included_props list.
            foreach ($rowData as $property) {
              if (in_array($property, $valid_props)) {
                $included_props[] = $property;
              } else if (empty($property)) {
                exit("Empty column header found");
              } else {
                exit("Invalid property found in header row: {$property}");
              }
            }
          }

          // Process the rest of the rows as students.
          if ($row > 1) {

            // Zip together the included props with this student's data.
            $student_props = [];
            foreach ($included_props as $i => $property) {
              $student_props[$property] = $rowData[$i];
            }

            // Check id, canvas id, and cnet id to find if student exists already.
            $id = !empty($student_props['id']) ? $student_props['id'] : null;
            $canvas_id = !empty($student_props['canvas_id']) ? $student_props['canvas_id'] : null;
            $cnet_id = !empty($student_props['cnet_id']) ? $student_props['cnet_id'] : null;
            $student = Student::where('id', $id)
                              ->orWhere(function ($q) use ($canvas_id) {
                                $q->whereNotNull('canvas_id')
                                  ->where('canvas_id', $canvas_id);
                                })
                              ->orWhere(function ($q) use ($cnet_id) {
                                $q->whereNotNull('cnet_id')
                                  ->where('cnet_id', $cnet_id);
                                })
                              ->first();

            // New student! Welcome!
            if ($student === null) {
              // The only two fields required for making a new student are first and last names.
              if (empty($student_props['first_name']) || empty($student_props['last_name'])) {
                exit("First and last names are required to generate a new student. Failed at row {$row}.");
              }
              $student = Student::create([
                'first_name' => $student_props['first_name'],
                'last_name' => $student_props['last_name']
              ]);
              $student->save();
            }

            // We're going to pull ID out of student_props if it's there, because that's
            // not anything we can actually use here. We needed it to help find an existing student,
            // but DB will throw an error if we include it here.
            unset($student_props['id']);

            // Now loop through each property and update it in the DB.
            foreach ($student_props as $attr => $value) {
              // Empty cells aren't null, they're just empty strings, so I think it's
              // better to just ignore those ones. Yes, these means you can't use this
              // functionality for mass property clearing out, but w/e.
              if (!empty($value)) {
                $student[$attr] = $value;
              }
            }
            $student->save();

            $students[] = $student;
          } // Finished processing student.
          $row++; // Increment the row and repeat.
        }
      }
      fclose($handle);
    }

    $results = $students;
    return response()->json($results);
  }
}
