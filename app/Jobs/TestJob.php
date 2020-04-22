<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Mail\JobException;
use App\Mail\JobResults;
use App\Offering;
use App\Student;

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
        Log::error('test job hello from constructor');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

        Log::error('test job hello from handle');
    }

}
