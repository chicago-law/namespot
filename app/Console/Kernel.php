<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\TestJob;
use App\Jobs\FetchOfferings;
use App\Jobs\FetchCanvasEnrollment;
use App\Jobs\FetchPhotoRoster;
use App\Jobs\FetchAppData;
use App\Setting;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Grab the current academic year from the Settings table in DB.
        // Fall back to 2018 if there is no academic year set.
        $academic_year_setting = Setting::where('setting_name','academic_year')->first();
        $year = $academic_year_setting ? $academic_year_setting->setting_value : '2018';

        // record the start time
        $started = date('h:i:s');

        // At 6am, fire off the job to grab all the data for that year.
        $schedule->job(new FetchAppData($year, $started))->dailyAt('06:00');

        // And once again at 6pm for redundancy, just in case.
        $schedule->job(new FetchAppData($year, $started))->dailyAt('18:00');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
