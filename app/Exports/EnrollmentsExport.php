<?php

namespace App\Exports;

use App\Offering;
use App\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\Exportable;

class EnrollmentsExport implements FromArray, WithHeadings, ShouldQueue
{
  use Exportable;

  public function headings(): array
  {
    return [
      'offering_id',
      'student_id',
      'assigned_seat',
      'canvas_enrollment_state',
      'ais_enrollment_state',
      'is_namespot_addition',
    ];
  }

  public function array(): array
  {
    $results = [];
    $offerings = Offering::all();
    foreach($offerings as $offering):
      foreach ($offering->students as $student) {
        $results[] = [
          $offering->id,
          $student->id,
          $student->getOriginal('pivot_assigned_seat'),
          $student->getOriginal('pivot_canvas_enrollment_state'),
          $student->getOriginal('pivot_ais_enrollment_state'),
          $student->getOriginal('pivot_is_namespot_addition'),
        ];
      }
    endforeach;

    return $results;
  }
}
