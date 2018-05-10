<?php

use Illuminate\Http\Request;
use App\Http\Resources\Offering as OfferingResource;
use App\Http\Resources\Student as StudentResource;
use App\Http\Resources\Room as RoomResource;
use App\Offering;
use App\Student;
use App\Room;

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

// fetch array of offerings by term code
Route::get('/offerings/{term_code}', function ($term_code) {
    return OfferingResource::collection(Offering::where('term_code',$term_code)->get());
});

// fetch all students for a given offering ID
Route::get('/enrollment/{offering_id}', function ($offering_id) {
    return StudentResource::collection(Offering::find($offering_id)->students()->get());
});

// fetch all rooms
Route::get('/rooms', function () {
    return RoomResource::collection(Room::all());
});
