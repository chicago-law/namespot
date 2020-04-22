<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ExceptionOccurred extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($content, $css)
    {
        $this->content = $content;
        $this->css = $css;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $env = config('app.env');
        $subject = "Error in Namespot {$env}";

        return $this->view('emails.exception-occurred')
            ->from('no-reply@namespot.uchicago.edu')
            ->subject($subject)
            ->with([
                'content' => $this->content,
                'css' => $this->css
            ]);
    }
}
