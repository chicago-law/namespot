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

// specific routes to the printable deliveries
// Route::get('/blank-chart', 'HomeController@blankChart');

// all others go to react
Route::get('/{path?}', 'HomeController@react')->where('path', '.*');

