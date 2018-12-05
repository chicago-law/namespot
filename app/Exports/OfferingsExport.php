<?php

namespace App\Exports;

use App\Offering;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class OfferingsExport implements FromCollection, WithHeadings, WithMapping
{
    public function headings(): array
    {
        return [
            'ID',
            'class_nbr',
            'catalog_nbr',
            'long_title',
            'section',
            'term_code',
            'room_id',
        ];
    }

    public function map($offering): array
    {
        return [
            $offering->ID,
            $offering->class_nbr,
            $offering->catalog_nbr,
            $offering->long_title,
            $offering->section,
            $offering->term_code,
            $offering->room_id,
        ];
    }

    public function collection()
    {
        return Offering::all();
    }
}
