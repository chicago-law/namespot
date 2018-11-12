<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ImportController extends Controller
{
  public function students(Request $request)
  {
    $results = '';
    $row = 1;
    if ($_FILES['namespotData']) {
      $file = $_FILES['namespotData']['tmp_name'];
      if (($handle = fopen($file, 'r')) !== false) {
        while (($data = fgetcsv($handle)) !== false) {
          $count = count($data);
          for ($c = 0; $c < $count; $c++) {
            $results = $results . " {$data[$c]}. ";
          }
        }
      }
      fclose($handle);
    }
    return response()->json($results);
  }
}
