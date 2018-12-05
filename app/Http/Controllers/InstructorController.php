<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\InstructorsExport;

class InstructorController extends Controller
{
    public function export()
    {
        return Excel::download(new InstructorsExport, 'instructors.xlsx');
    }
}
