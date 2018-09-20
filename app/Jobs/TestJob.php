<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7;
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

        $offering = Offering::where('class_nbr', '89711')->first();

        // foreach ($offerings as $offering):

        try {
            $client = new Client();
            $base_url = config('api.ais_stage_url');
            $username = config('api.ais_username');
            $password = config('api.ais_password');
            $reg_roster_endpoint = "{$base_url}/roster/{$offering->class_nbr}/2178";
            $photo_roster_endpoint = "{$base_url}/photoroster/2178/{$offering->class_nbr}";

            // Make the call
            $response = $client->get($photo_roster_endpoint, [
                'auth' => [$username, $password],
                'verify' => false
            ]);

            $json_body = $response->getBody()->getContents();

            Storage::disk('local')->put('fetch_ais_photo_roster.json', $json_body);

            die;

            $body = json_decode($json_body);

            if (
                isset($body->ROW_COUNT)
                && $body->ROW_COUNT > 0
                && isset($body->PHOTO_ROSTER)
            ) {



            }


        } catch (RequestException $e) {
            $api_request = 'no request';
            $api_response = 'no response';
            $api_request = Psr7\str($e->getRequest());
            if ($e->hasResponse()) {
            $api_response = Psr7\str($e->getResponse());
            }

            $errors_array[] = [
            'api_request' => $api_request,
            'api_response' => $api_response,
            'time' => date('h:i:s'),
            ];
        }

        // endforeach; // end offering loop

        // if (count($errors_array)):
        // // send an email with exceptions summary
        // $message = "FetchPhotoRoster for {$this->term} finished with " . count($errors_array) . " errors, out of " . count($offerings) . " offerings.";
        // Mail::to(config('app.admin_email'))->send(new JobException($message, array_slice($errors_array, 0, 3)));
        // else:
        // // Send an email with job results summary
        // $results = "FetchPhotoRoster for {$this->term} completed without exceptions. {$empty_responses} out of " . count($offerings) . " offerings had no photo data.";
        // Mail::to(config('app.admin_email'))->send(new JobResults($results));
        // endif;


        // $results = "The test job went down.";
        // Mail::to(config('app.admin_email'))->send(new JobResults($results));
    }

}
