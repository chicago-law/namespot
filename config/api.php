<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AIS CREDENTIALS
    |--------------------------------------------------------------------------
    |
    | URLs and login credentials for accessing the University's AIS database
    |
    */

    'ais_dev_url' => env('AIS_DEV_URL'),
    'ais_stage_url' => env('AIS_STAGE_URL'),
    'ais_prod_url' => env('AIS_PROD_URL'),
    'ais_username' => env('AIS_USERNAME'),
    'ais_password' => env('AIS_PASSWORD'),

    /*
    |--------------------------------------------------------------------------
    | CANVAS CREDENTIALS
    |--------------------------------------------------------------------------
    |
    | URLs and login credentials for accessing the University's Canvas database
    |
    */

    'canvas_test_url' => env('CANVAS_TEST_URL'),
    'canvas_test_token' => env('CANVAS_TEST_TOKEN'),
    'canvas_beta_url' => env('CANVAS_BETA_URL'),
    'canvas_prod_url' => env('CANVAS_PROD_URL'),
    'canvas_prod_token' => env('CANVAS_PROD_TOKEN')
];
