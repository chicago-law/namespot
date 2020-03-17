<?php

use Illuminate\Database\Seeder;

class InstructorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Instructor::class, 10)
            ->create();
            // ->each(function ($inst) {
            //         $num1 = rand(1,10);
            //         $num2 = rand(1,10);
            //         while($num1 === $num2):
            //             $num2 = rand(1,10);
            //         endwhile;
            //         $inst->teaches()->attach([$num1,$num2]);
            //     });
    }
}
