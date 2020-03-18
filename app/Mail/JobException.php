<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class JobException extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */

    public $job_message;
    public $errors_array;

    public function __construct($job_message, $errors_array)
    {
        $this->job_message = $job_message;
        $this->errors_array = $errors_array;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->from(['address' => 'no-reply@law.uchicago.edu', 'name' => 'Namespot Job'])
            ->subject('Namespot Job Exception')
            ->view('emails.job-exception');
    }
}
