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


// Send all web requests through our Shib Auth middleware
Route::middleware(['uchicago-shibboleth'])->group(function () {

  // Logout
  Route::get('/logout', 'HomeController@logout');

  // route for all printable deliveries
  Route::get('/print/{path?}', 'HomeController@print')->where('path', '.*');

  // all others go to regular react page
  Route::get('/{path?}', 'HomeController@react')->where('path', '.*');

});
