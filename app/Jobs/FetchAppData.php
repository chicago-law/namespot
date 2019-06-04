<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobException;
use App\Mail\JobResults;
use App\Jobs\FetchOfferings;
use App\Jobs\FetchCanvasEnrollment;
use App\Jobs\FetchAisEnrollment;
use App\Jobs\FetchPhotoRoster;
use App\Jobs\TestJob;
use App\Setting;

class FetchAppData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $started;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($started)
    {
        $this->started = $started;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Grab the current academic year from the Settings table in DB.
        // Fall back to 2018 if there is no academic year set.
        $academic_year_setting = Setting::where('setting_name','academic_year')->first();
        $year = $academic_year_setting ? $academic_year_setting->setting_value : '2018';

        // Convert the single year into an array of AIS term codes.
        // Ie, 2018 becomes 2188, 2192, 2194.
        $term_codes = getTermCodesFromYear($year);

        foreach ($term_codes as $term) {

            // Get the offerings from AIS
            FetchOfferings::dispatch($term);

            // Get enrollments from Canvas
            FetchCanvasEnrollment::dispatch($term);

            // Get enrollments from AIS
            FetchAisEnrollment::dispatch($term);

            // Wait a minute before calling AIS again
            sleep(60);

            // Get student photos from AIS
            FetchPhotoRoster::dispatch($term);

            // Wait a minute before calling AIS again
            sleep(60);

        } // end term loop

      // Send an email confirming that all jobs finished without errors.
      $results = config('app.env') . ": FetchAppData started at {$this->started} and finished at " . date('h:i:s');
      Mail::to(config('app.admin_email'))->send(new JobResults($results));
    }
}
