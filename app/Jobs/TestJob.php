<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobResults;

class TestJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // protected $foo;
    // protected $bar;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->foo = $foo;
        // $this->bar = $bar;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $results = "The test job went down.";
        dd($results);
        // Mail::to(config('app.admin_email'))->send(new JobResults($results));
    }

}
