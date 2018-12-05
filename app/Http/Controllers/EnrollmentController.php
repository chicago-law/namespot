<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\EnrollmentsExport;

class EnrollmentController extends Controller
{
    public function export()
    {
        return Excel::download(new EnrollmentsExport, 'enrollments.xlsx');
    }
}
