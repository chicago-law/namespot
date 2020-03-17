<?php

namespace App\Exports;

use App\Instructor;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InstructorsExport implements FromCollection, WithHeadings, WithMapping
{
    public function headings(): array
    {
        return [
            'ID',
            'emplid',
            'cnet_id',
            'first_name',
            'last_name',
            'email',
        ];
    }

    public function map($instructor): array
    {
        return [
            $instructor->id,
            $instructor->emplid,
            $instructor->cnet_id,
            $instructor->first_name,
            $instructor->last_name,
            $instructor->email,
        ];
    }

    public function collection()
    {
        return Instructor::all();
    }
}
