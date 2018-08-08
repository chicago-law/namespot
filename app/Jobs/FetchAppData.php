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
use App\Jobs\FetchEnrolledStudentsByTerm;
use App\Jobs\FetchOfferingsByTerm;
use App\Jobs\FetchPhotoRosterByTerm;
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
        // convert the single year into an array of AIS term codes
        // ie, 2018 becomes 2188, 2192, 2194
        $term_codes = getTermCodesFromYear($this->year);

        // foreach ($term_codes as $term) {

            $term = '2178';

            // Get the offerings from AIS
            FetchOfferingsByTerm::dispatch($term);
            sleep(120);

            // get enrollments from Canvas for the offerings
            FetchEnrolledStudentsByTerm::dispatch($term);
            sleep(120);

            // get student photos from AIS for the offerings
            FetchPhotoRosterByTerm::dispatch($term);
            sleep(120);

        // } // end term loop

        $results = "Got through dispatching all jobs for {$this->year}, started at {$this->started}.";
        Mail::to(config('app.admin_email'))->send(new JobResults($results));

    }
}
