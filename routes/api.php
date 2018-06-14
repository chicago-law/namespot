<?php

use Illuminate\Http\Request;
use App\Http\Resources\Offering as OfferingResource;
use App\Http\Resources\Student as StudentResource;
use App\Http\Resources\Room as RoomResource;
use App\Http\Resources\Table as TableResource;
use App\Offering;
use App\Student;
use App\Room;
use App\Table;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// fetch single offering by ID
Route::get('/offering/{offering_id}', function ($offering_id) {
    return new OfferingResource(Offering::find($offering_id));
});

// take an offering, duplciate its room, assign it to the new room
Route::get('create-room-for/{offering_id}','OfferingController@createRoomFor');

// fetch array of offerings by term code
Route::get('/offerings/{term_code}', function ($term_code) {
    return OfferingResource::collection(Offering::where('term_code',$term_code)->get());
});

// fetch all students for a given offering ID
Route::get('/enrollment/{offering_id}', function ($offering_id) {
    return StudentResource::collection(Offering::find($offering_id)->students()->get());
});

// update a student
Route::post('/student/update/{student_id}', 'StudentController@update');

// fetch all rooms
Route::get('/rooms', function () {
    return RoomResource::collection(Room::all());
});

// update a room
Route::post('/room/update/{room_id}','RoomController@update');

// update (or create new) table
Route::post('/table/update','TableController@update');

// delete a table
Route::delete('/table/{table_id}','TableController@delete');

// fetch all tables for a given room
Route::get('/tables/{room_id}', function($room_id) {
    return TableResource::collection(Table::where('room_id',$room_id)->get());
});