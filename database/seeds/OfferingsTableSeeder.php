<?php

use Illuminate\Database\Seeder;

class OfferingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Offering::class, 15)
            ->create()
            ->each(function($o) {
                // room
                $o->room_id = rand(1,20);
                $o->save();

                // instructors
                $nums = UniqueRandomNumbersWithinRange(1, 10, 2);
                $o->instructors()->attach([$nums[0],$nums[1]]);
            });
    }
}
