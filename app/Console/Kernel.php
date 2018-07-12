<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\TestJob;
use App\Jobs\FetchOfferingsByTerm;

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
        $schedule->job(new TestJob)
                 ->everyMinute();

        // figure out what term it is right now
        // fire off for current plus next

        // $schedule->job(new FetchOfferingsByTerm(current))->dailyAt('1:00');
        // $schedule->job(new FetchOfferingsByTerm(next))->dailyAt('1:05');

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
