<?php

use Illuminate\Database\Seeder;

class StudentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Student::class, 350)
            ->create()
            ->each(function ($s) {
                    $offering_ids = UniqueRandomNumbersWithinRange(1, 50, 3);
                    $s->offerings()->attach([
                        $offering_ids[0] => ['assigned_seat' => null],
                        $offering_ids[1] => ['assigned_seat' => null],
                        $offering_ids[2] => ['assigned_seat' => null],
                    ]);
                });
    }
}
