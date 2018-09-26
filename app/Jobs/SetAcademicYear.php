<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Setting;

class SetAcademicYear implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // get current year
        $current_year = date('Y');

        // get the academic year setting
        $ac_year = Setting::where('setting_name', 'academic_year')->first();

        // set it
        $ac_year->setting_value = $current_year;

        // save it
        $ac_year->save();
    }
}
