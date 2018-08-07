<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// route to test an email template
Route::get('/email/jobexception', function() {
  $job_name = 'yeah';
  $api_request = 'this is the api request';
  $api_response = 'this is the response';

  return new App\Mail\JobResults('yeaaah');
});

// route for all printable deliveries
Route::get('/print/{path?}', 'HomeController@print')->where('path', '.*');

// all others go to regular react page
Route::get('/{path?}', 'HomeController@react')->where('path', '.*');

