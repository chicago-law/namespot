<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentsResource extends JsonResource
{
    // So glad that $preserveKeys exists.
    public $preserveKeys = true;

    public function __construct($offering)
    {
        $this->offering = $offering;
    }
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Create an array of student ids.
        // By using currentStudents method on Offering, we're only getting
        // the students that are actually, actively enrolled.
        // Dropped and withdrawn are excluded.
        $enrollments = [];
        foreach ($this->offering->currentStudents as $student):
            $enrollments[$student->id] = [
                'student_id' => (string) $student->id,
                'seat' => is_null($student->pivot->assigned_seat) ? null : trim($student->pivot->assigned_seat),
                'canvas_role' => $student->pivot->canvas_role,
                'canvas_enrollment_state' => $student->pivot->canvas_enrollment_state,
                'ais_enrollment_state' => $student->pivot->ais_enrollment_state,
                'ais_enrollment_reason' => $student->pivot->ais_enrollment_reason,
                'is_in_ais' => (int) $student->pivot->is_in_ais,
                'is_namespot_addition' => (int) $student->pivot->is_namespot_addition
            ];
        endforeach;

        return $enrollments;
    }
}
