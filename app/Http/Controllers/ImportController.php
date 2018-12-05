<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Student;
use App\Offering;
use App\Instructor;
use App\Http\Resources\Offering as OfferingResource;
use App\Http\Resources\Student as StudentResource;

class ImportController extends Controller
{

  public function __construct()
  {
    // These are the properties that we're allowing for the import process. More columns exist,
    // but those aren't used in the app.
    $this->valid_props = [
      'students' => [
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
        'academic_career',
        'academic_prog',
        'academic_prog_descr',
        'academic_level',
        'exp_grad_term',
      ],
      'offerings' => [
        'id',
        'class_nbr',
        'catalog_nbr',
        'long_title',
        'section',
        'term_code',
        'room_id',
      ],
      'enrollments' => [
        'offering_id',
        'student_id',
        'assigned_seat',
        'canvas_enrollment_state',
        'ais_enrollment_state',
        'is_namespot_addition',
      ],
      'instructors' => [
        'id',
        'emplid',
        'cnet_id',
        'first_name',
        'last_name',
        'email',
      ],
      'teachings' => [
        'instructor_id',
        'offering_id',
      ],
    ];

    // Track which row we're on. 1 is the header row.
    $this->row = 1;
    // Count new entities created.
    $this->created_entities = 0;
    // Count entities updated.
    $this->updated_entities = 0;
  }

  public function import(Request $request, $type)
  {
    $student_ids = []; // Fill with the IDs of new/updated students.
    $offering_ids = []; // Fill with the IDs of new/updated offerings.
    $instructor_ids = []; // Fill with the IDs of new/updated instructors.

    if ($_FILES['namespotData']) {
      $file = $_FILES['namespotData']['tmp_name'];
      if (($handle = fopen($file, 'r')) !== false) {

        // Here's where we'll store the properties that are in the spreadsheet's header row.
        $included_props = [];

        // Now while your way through the rows....
        while (($rowData = fgetcsv($handle)) !== false) {

          // Process the header row.
          if ($this->row === 1) {
            // Look at all the strings in the header row and make sure we recognize them.
            // If we do, add them to our included_props list.
            foreach ($rowData as $property) {
              if (in_array($property, $this->valid_props[$type])) {
                $included_props[] = $property;
              } else if (empty($property)) {
                abort(500, "Empty column header found");
              } else {
                abort(500, "Invalid property found in header row: {$property}");
              }
            }
          }

          // Process the rest of the rows as entities.
          if ($this->row > 1) {

            // Zip together the header cells as keys and the props as values.
            $entity_props = [];
            foreach ($included_props as $i => $property) {
              $entity_props[$property] = $rowData[$i];
            }

            // Depending on the type, process it with the appropriate function and
            // return the updated entity's id.
            switch ($type) {
              case 'students':
                $student_ids[] = $this->processStudent($entity_props);
                break;
              case 'offerings':
                $offering_ids[] = $this->processOffering($entity_props);
                break;
              case 'enrollments':
                $enroll_results = $this->processEnrollment($entity_props);
                $offering_ids[] = $enroll_results[0];
                $student_ids[] = $enroll_results[1];
                break;
              case 'instructors':
                $taught_offerings = $this->processInstructor($entity_props);
                foreach ($taught_offerings as $offering) {
                  $offering_ids[] = $offering->id;
                }
                break;
              case 'teachings':
                $offering_ids[] = $this->processTeaching($entity_props);
                break;
            }
          }
          // Finished processing entity.
          // Increment the row and repeat.
          $this->row++;
        }
      }
      fclose($handle);
    }

    // Prepare the results by turning our ID arrays into JSON resources.
    $student_ids = array_unique($student_ids);
    $students = StudentResource::collection(Student::whereIn('id', $student_ids)->get());
    $offering_ids = array_unique($offering_ids);
    $offerings = OfferingResource::collection(Offering::whereIn('id', $offering_ids)->get());

    $results = [
      'students' => $students,
      'offerings' => $offerings,
      'updated' => $this->updated_entities,
      'created' => $this->created_entities
    ];
    return response()->json($results);
  }

  public function processStudent($entity_props)
  {
    // Check id, canvas id, and cnet id to find if student exists already.
    $id = !empty($entity_props['id']) ? $entity_props['id'] : null;
    $canvas_id = !empty($entity_props['canvas_id']) ? $entity_props['canvas_id'] : null;
    $cnet_id = !empty($entity_props['cnet_id']) ? $entity_props['cnet_id'] : null;
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

    if (is_null($student)) {
      // New student! Welcome!
      // The only two fields required for making a new student are first and last names.
      if (empty($entity_props['first_name']) || empty($entity_props['last_name'])) {
        abort(500, "First and last names are required to generate a new student. Failed at row {$this->row}.");
      }
      $student = Student::create([
        'first_name' => $entity_props['first_name'],
        'last_name' => $entity_props['last_name'],
      ]);
      $student->save();
      $this->created_entities++;
    } else {
      $this->updated_entities++;
    }

    // Remove ID because we only needed it to identify existing entity.
    unset($entity_props['id']);

    // Now loop through each property and update it in the DB.
    foreach ($entity_props as $attr => $value) {
      if (!empty($value)) {
        $student[$attr] = $value;
      }
    }
    $student->save();

    // Return student
    return $student->id;
  }

  public function processOffering($entity_props)
  {
    // check id and class_nbr to see if offering exists already.
    $id = !empty($entity_props['id']) ? $entity_props['id'] : null;
    $class_nbr = !empty($entity_props['class_nbr']) ? $entity_props['class_nbr'] : null;
    $offering = Offering::where('id', $id)
                        ->orWhere(function ($q) use ($class_nbr) {
                          $q->whereNotNull('class_nbr')
                            ->where('class_nbr', $class_nbr);
                          })
                        ->first();

    if (is_null($offering)) {
      // New Offering!
      // Required fields for new offerings: catalog_nbr and long_title.
      if (empty($entity_props['catalog_nbr']) || empty($entity_props['long_title'])) {
        abort(500, "Catalog number and title are required for new offerings. Failed at row {$this->row}.");
      }
      $offering = Offering::create([
        'catalog_nbr' => $entity_props['catalog_nbr'],
        'long_title' => $entity_props['long_title'],
      ]);
      $offering->save();
      $this->created_entities++;
    } else {
      $this->updated_entities++;
    }

    // Remove ID because we only needed it to identify existing entity.
    unset($entity_props['id']);

    // Now loop through each property and update it in the DB.
    foreach ($entity_props as $attr => $value) {
      if (!empty($value)) {
        $offering[$attr] = $value;
      }
    }
    $offering->save();

    // Return offering
    return $offering->id;
  }

  public function processEnrollment($entity_props)
  {
    // Store the IDs and then remove from entity_props
    $offering_id = $entity_props['offering_id'];
    $student_id = $entity_props['student_id'];
    unset($entity_props['offering_id'], $entity_props['student_id']);

    // Requires valid offering_id and student_id.
    $offering = Offering::find($offering_id);
    if (is_null($offering_id) || is_null($offering)) {
      abort(500, "Invalid offering ID found: {$offering_id}");
    }
    $student = Student::find($student_id);
    if (is_null($student_id) || is_null($student)) {
      abort(500, "Invalid student ID found: {$student_id}");
    }

    // Is this going to be an update or a new entry?
    $exists = $offering->students()->where('id', $student_id)->exists();
    if ($exists) {
      $this->updated_entities++;
    } else {
      $this->created_entities++;
    }

    // Look ahead of time at which cells have values.
    $updates = [];
    foreach ($entity_props as $attr => $value) {
      if (!empty($value)) {
        $updates[$attr] = $value;
      }
    }

    /**
     * We're also going to manually set is_in_ais to true. This simply makes
     * them count as "active" students, because if you're doing your enrollment
     * this way via importing, then you probably don't need the AIS and Canvas
     * active / inactive logic that's in this app.
     */
    $updates['is_in_ais'] = 1;

    // Now update the join table
    $offering->students()->syncWithoutDetaching([$student_id => $updates]);

    // Return ids
    return [
      $offering->id,
      $student->id,
    ];
  }

  public function processInstructor($entity_props)
  {
    // Check id, emplid, and cnet id to find if instructor exists already.
    $id = !empty($entity_props['id']) ? $entity_props['id'] : null;
    $emplid = !empty($entity_props['emplid']) ? $entity_props['emplid'] : null;
    $cnet_id = !empty($entity_props['cnet_id']) ? $entity_props['cnet_id'] : null;
    $instructor = Instructor::where('id', $id)
                      ->orWhere(function ($q) use ($emplid) {
                        $q->whereNotNull('emplid')
                          ->where('emplid', $emplid);
                        })
                      ->orWhere(function ($q) use ($cnet_id) {
                        $q->whereNotNull('cnet_id')
                          ->where('cnet_id', $cnet_id);
                        })
                      ->first();

    if (is_null($instructor)) {
      // New Instructor
      // The only two fields required for making a new instructor are first and last names.
      if (empty($entity_props['first_name']) || empty($entity_props['last_name'])) {
        abort(500, "First and last names are required to generate a new instructor. Failed at row {$this->row}.");
      }
      $instructor = Instructor::create([
        'first_name' => $entity_props['first_name'],
        'last_name' => $entity_props['last_name'],
      ]);
      $instructor->save();
      $this->created_entities++;
    } else {
      $this->updated_entities++;
    }

    // Remove ID because we only needed it to identify existing entity.
    unset($entity_props['id']);

    // Now loop through each property and update it in the DB.
    foreach ($entity_props as $attr => $value) {
      if (!empty($value)) {
        $instructor[$attr] = $value;
      }
    }
    $instructor->save();

    // Find any offerings that this instructor teachers and return those IDs
    return $instructor->teaches()->pluck('id')->toArray();
  }

  public function processTeaching($entity_props)
  {
    // Store the IDs and then remove from entity_props
    $instructor_id = $entity_props['instructor_id'];
    $offering_id = $entity_props['offering_id'];
    unset($entity_props['offering_id'], $entity_props['instructor_id']);

    // Requires valid offering_id and instructor_id.
    $instructor = Instructor::find($instructor_id);
    if (is_null($instructor_id) || is_null($instructor)) {
      abort(500, "Invalid instructor ID found: {$instructor_id}");
    }
    $offering = Offering::find($offering_id);
    if (is_null($offering_id) || is_null($offering)) {
      abort(500, "Invalid offering ID found: {$offering_id}");
    }

    // Is this going to be an update or a new entry?
    $exists = $offering->instructors()->where('id', $instructor_id)->exists();
    if ($exists) {
      $this->updated_entities++;
    } else {
      $this->created_entities++;
    }

    // Now update the join table
    $offering->instructors()->syncWithoutDetaching($instructor_id);

    // Return id
    return $offering->id;
  }

}