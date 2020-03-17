<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;
use App\Http\Resources\RoomResource;
use App\Jobs\FetchOfferings;
use App\Room;
use App\Offering;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OfferingsExport;
use App\Exports\StudentsExport;
use App\Exports\InstructorsExport;
use App\Exports\EnrollmentsExport;
use App\Exports\TeachingsExport;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// All routes go through shib.
Route::middleware(['shibboleth'])->group(function () {

  Route::get('/test', function() {
    //
    return response()->json('Yeah!', 200);
  });

  // Authed User
  Route::get('/authed-user', function (Request $request) {
    $authedUser = auth()->user();
    return response()->json(new UserResource($authedUser));
  });

  // Rooms
  Route::post('/rooms', 'RoomController@create');
  Route::get('/rooms', 'RoomController@get');
  Route::put('/rooms/{roomId}', 'RoomController@update');
  Route::delete('/rooms/{roomId}', 'RoomController@delete');

  // Tables
  Route::post('/tables', 'TableController@create');
  Route::get('/tables', 'TableController@get');
  Route::put('/tables/{tableId}', 'TableController@update');
  Route::delete('/tables/{tableId}', 'TableController@delete');

  // Students
  Route::post('/upload-student-picture', 'StudentController@uploadPicture');
  Route::get('/students', 'StudentController@get');
  Route::put('/students/{studentId}', 'StudentController@update');

  // Offerings
  Route::post('/offerings', 'OfferingController@create');
  Route::get('/offerings', 'OfferingController@get');
  Route::put('/offerings/{offeringId}', 'OfferingController@update')->middleware('own-offering');
  Route::delete('/offerings/{offeringId}', 'OfferingController@delete')->middleware('own-offering');
  Route::post('/offerings/{offeringId}/enrollments/{studentId}', 'OfferingController@createEnrollment')->middleware('own-offering');
  Route::get('/offerings/{offeringId}/enrollments', 'OfferingController@enrollments')->middleware('own-offering');
  Route::put('/offerings/{offeringId}/enrollments/{studentId}', 'OfferingController@updateEnrollment')->middleware('own-offering');
  Route::delete('/offerings/{offeringId}/enrollments/{studentId}', 'OfferingController@deleteEnrollment')->middleware('own-offering');

  // Search
  Route::post('/search/students', 'SearchController@students');

  // Settings
  Route::get('/settings', 'SettingsController@get');
  Route::put('/settings', 'SettingsController@update');

  // Import, Export
  Route::post('/import/{type}', 'ImportController@import');
  Route::get('/export/offerings', function() {
    return Excel::download(new OfferingsExport, 'offerings.xlsx');
  });
  Route::get('/export/students', function() {
    return Excel::download(new StudentsExport, 'students.xlsx');
  });
  Route::get('/export/enrollments', function() {
    return Excel::download(new EnrollmentsExport, 'enrollments.xlsx');
  });
  Route::get('/export/instructors', function() {
    return Excel::download(new InstructorsExport, 'instructors.xlsx');
  });
  Route::get('/export/teachings', function() {
    return Excel::download(new TeachingsExport, 'teachings.xlsx');
  });
});
