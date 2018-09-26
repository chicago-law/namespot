<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\FetchAppData;
use App\Jobs\SetAcademicYear;
use App\Jobs\TestJob;

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
        // record the start time
        $started = date('h:i:s');

        // At 6am, fire off the job to grab all the data for that year.
        $schedule->job(new FetchAppData($started))->dailyAt('06:00');

        // And once again at 6pm for redundancy, just in case.
        $schedule->job(new FetchAppData($started))->dailyAt('18:00');

        // Once a year on August 1st at 12:00am, move the current academic year
        // setting to whatever the current year is.
        $schedule->job(new SetAcademicYear())->cron('0 0 1 8 *');
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
