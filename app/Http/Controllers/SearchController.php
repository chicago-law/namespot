<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Student;
use App\Http\Resources\StudentResource;

class SearchController extends Controller
{
    public function students(Request $request)
    {
        $query = $request->input('query');

        if (!$query) abort(500, 'No search query found.');

        $results = Student::where('full_name', "LIKE", "%$query%")
            ->orWhere('short_full_name', "LIKE", "%$query%")
            ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$query}%"])
            ->orWhereRaw("CONCAT(first_name, ' ', short_last_name) LIKE ?", ["%{$query}%"])
            ->orWhereRaw("CONCAT(short_first_name, ' ', last_name) LIKE ?", ["%{$query}%"])
            ->orWhereRaw("CONCAT(short_first_name, ' ', short_last_name) LIKE ?", ["%{$query}%"])
            ->orWhere('nickname', "LIKE", "%$query%")
            ->orWhere('cnet_id', "LIKE", "%$query%")
            ->get();

        // If a limit is supplied in parameters, take that many, otherwise just
        // take them all.
        $limit = $request->input('limit') ? $request->input('limit') : $results->count();

        return response()->json([
            'count' => $results->count(),
            'students' => StudentResource::collection($results)->take($limit)
        ]);
    }
}
