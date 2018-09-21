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

class FetchAppData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $year;
    protected $started;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($year, $started)
    {
        $this->year = $year;
        $this->started = $started;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Convert the single year into an array of AIS term codes.
        // Ie, 2018 becomes 2188, 2192, 2194.
        $term_codes = getTermCodesFromYear($this->year);

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
    }
}
