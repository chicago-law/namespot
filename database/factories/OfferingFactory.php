<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\Offering::class, function (Faker $faker) {
    $term_codes = ['2188','2192','2194'];
    return [
        'long_title' => $faker->catchPhrase,
        'catalog_nbr' => $faker->numberBetween($min = 12001, $max = 92000),
        'crse_id' => $faker->numberBetween($min = 12001, $max = 92000),
        'class_nbr' => $faker->numberBetween($min = 12001, $max = 92000),
        'term_code' => $term_codes[rand(0,2)],
    ];
});
