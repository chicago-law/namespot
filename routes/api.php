<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Resources\Offering as OfferingResource;
use App\Http\Resources\Student as StudentResource;
use App\Http\Resources\Room as RoomResource;
use App\Http\Resources\Table as TableResource;
use App\Offering;
use App\Student;
use App\Room;
use App\Table;
use App\Jobs\FetchOfferingsByTerm;
use App\Jobs\FetchEnrolledStudentsByTerm;
use App\Jobs\FetchPhotoRosterByTerm;
use App\Jobs\FetchAppData;
use App\Jobs\TestJob;

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

/**
 * TEST: RUN A TEST JOB
 */
Route::get('/test', function(Request $request) {
    // FetchOfferingsByTerm::dispatch('2188');
    // FetchEnrolledStudentsByTerm::dispatch('2178');
    // FetchPhotoRosterByTerm::dispatch('2178');
    // TestJob::dispatch();
    return response()->json('Yeah', 200);
});




/**
 * OFFERINGS
 */

// fetch single offering by ID
Route::get('/offering/{offering_id}', function ($offering_id) {
    return new OfferingResource(Offering::find($offering_id));
});
// fetch all offerings for given term code
Route::get('/offerings/{term_code}', function ($term_code) {
    return OfferingResource::collection(Offering::where('term_code',$term_code)->get());
});
// update an offering attribute
Route::post('/offering/update/{offering_id}', 'OfferingController@update');
// take an offering, duplicate its room, assign it to the new room
Route::get('create-room-for/{offering_id}','OfferingController@createRoomFor');

/**
 * STUDENTS
 */

// fetch all students for a given offering ID
Route::get('/enrollment/offering/{offering_id}', function ($offering_id) {
    return StudentResource::collection(Offering::find($offering_id)->students()->get());
});
// fetch all students for a given term code
Route::get('/enrollment/term/{term_code}', 'StudentController@term');
// update a student
Route::post('/student/update/{student_id}', 'StudentController@update');
// remove a student from a class
Route::post('/student/unenroll', 'StudentController@unenroll');
// search for a student by name
Route::get('/students/search', 'StudentController@search');
// upload a new picture file for a student
Route::post('/student/upload-picture', 'StudentController@upload_picture');

/**
 * ROOMS
 */

// fetch all rooms. Only return actual room templates though, ignore the ones
// customized for a specific offering.
Route::get('/rooms', function () {
    return RoomResource::collection(Room::where('type','template')->get());
});
// fetch single room by id
Route::get('/room/{room_id}', function ($room_id) {
    return new RoomResource(Room::find($room_id));
});
// update a room
Route::post('/room/update/{room_id}','RoomController@update');
// create a new room
Route::put('/room','RoomController@new');
// get a count of the rooms in the DB
Route::get('/rooms/count', 'RoomController@count');
// check if a supplied name to a room is already in use. checks both the
// regular name and the db_match_name.
Route::post('/rooms/checkname', 'RoomController@checkname');
// Nudge a room's tables down by 1
Route::post('/nudge/down', 'RoomController@nudgedown');

/**
 * TABLES
 */

// update (or create new) table
Route::post('/table/update','TableController@update');
// delete a table
Route::delete('/table/{table_id}','TableController@delete');
// fetch all tables for a given room
Route::get('/tables/{room_id}', function($room_id) {
    return TableResource::collection(Table::where('room_id',$room_id)->get());
});

/**
 * SETTINGS
 */

 // get all the settings
Route::get('/settings', 'SettingController@get');
// update a setting
Route::post('/settings/update', 'SettingController@update');

/**
 * USERS
 */

 // fetch a user by ID
 Route::get('/users/{user_id}', 'UserController@fetch');