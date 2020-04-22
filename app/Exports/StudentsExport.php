<?php

namespace App\Exports;

use App\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromCollection, WithHeadings, WithMapping
{
    public function headings(): array
    {
        return [
            'ID',
            'first_name',
            'middle_name',
            'last_name',
            'canvas_id',
            'cnet_id',
            'short_first_name',
            'short_last_name',
            'nickname',
            'picture',
            'academic_career',
            'academic_prog',
            'academic_prog_descr',
            'academic_level',
            'exp_grad_term'
        ];
    }

    public function map($student): array
    {
        return [
            $student->id,
            $student->first_name,
            $student->middle_name,
            $student->last_name,
            $student->canvas_id,
            $student->cnet_id,
            $student->short_first_name,
            $student->short_last_name,
            $student->nickname,
            $student->picture,
            $student->academic_career,
            $student->academic_prog,
            $student->academic_prog_descr,
            $student->academic_level,
            $student->exp_grad_term
        ];
    }

    public function collection()
    {
        return Student::all();
    }
}
