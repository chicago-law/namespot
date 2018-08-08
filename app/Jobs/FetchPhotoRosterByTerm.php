<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobException;
use App\Mail\JobResults;
use App\Offering;
use App\Student;

class FetchPhotoRosterByTerm implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  protected $term;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct($term)
  {
    $this->term = $term;
  }

  /**
   * Execute the job.
   *
   * @return void
   */
  public function handle()
  {

    // Record errors here
    $errors_array = [];
    // Record responses without rows
    $empty_responses = 0;

    // Grab the Offerings
    $offerings = Offering::where('term_code', $this->term)->get();

    foreach ($offerings as $offering):

      try {
        $client = new Client();
        $base_url = config('api.ais_dev_url');
        $username = config('api.ais_username');
        $password = config('api.ais_password');
        $endpoint = "{$base_url}/photoroster/{$this->term}/{$offering->class_nbr}";

        // Make the call
        $response = $client->get($endpoint, [
          'auth' => [$username, $password]
        ]);

        $body = json_decode($response->getBody()->getContents());

        if (
          isset($body->ROW_COUNT)
          && $body->ROW_COUNT > 0
          && isset($body->PHOTO_ROSTER)
        ) {

          // If there's more than one student, AIS will return an array of
          // student objects. If there's only one, it will return just one
          // student object. Let's standardize it into an array no matter what.
          $ais_student_array = [];
          if (is_array($body->PHOTO_ROSTER)):
            $ais_student_array = $body->PHOTO_ROSTER;
          elseif (is_object($body)):
            $ais_student_array[] = $body->PHOTO_ROSTER;
          endif;

          foreach ($ais_student_array as $ais_student):

            // Get Cnet from email address
            $cnet = substr($ais_student->EMAIL_ADDR, 0, strpos($ais_student->EMAIL_ADDR, '@'));

            // Match students from AIS response to students already in our DB (from Canvas)
            // Looking using Cnet, or temporarily, by name
            $middle_and_last = is_string($ais_student->MIDDLE_NAME)
              ? "{$ais_student->MIDDLE_NAME} {$ais_student->LAST_NAME}"
              : $ais_student->LAST_NAME;

            $student = Student::where('cnet_id', $cnet)
              ->orWhere('last_name', $ais_student->LAST_NAME)
              ->orWhere('last_name', $middle_and_last)
              ->first();

            // If we found a student, proceed only if their picture is either null or no-face
            if ($student && (is_null($student->picture) || $student->picture === 'no-face.png')):

              // Create the file name and save it as a student attribute
              // Temporarily including last name as well, because students from
              // AIS test endpoints come back with cnet 'nobody' for everybody.
              $file_name = "{$cnet}_{$ais_student->LAST_NAME}.jpg";
              $student->picture = $file_name;
              $student->save();

              // create and save the jpg file
              $photo_data = $ais_student->PHOTO_DATA;
              $decoded = base64_decode($photo_data);
              // file_put_contents("images/students/{$file_name}", $decoded);

              // this is working when no images were there already
              file_put_contents("Sites/namespot/public/images/students/{$file_name}", $decoded);

            endif;

          endforeach; // end the student loop

          // This offering is done, but let's pause for a few seconds before
          // hitting the API with next Offering.
          sleep(5);

        } else if ((string) $body->ROW_COUNT === '0') {
          $empty_responses++;
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

    endforeach; // end offering loop

    if (count($errors_array)):
      // send an email with exceptions summary
      $message = "FetchPhotoRosterByTerm for {$this->term} finished with " . count($errors_array) . " errors, out of " . count($offerings) . " offerings.";
      Mail::to(config('app.admin_email'))->send(new JobException($message, $errors_array));
    else:
      // Send an email with job results summary
      $results = "FetchPhotoRosterByTerm for {$this->term} completed without exceptions. {$empty_responses} out of " . count($offerings) . " offerings had no photo data.";
      Mail::to(config('app.admin_email'))->send(new JobResults($results));
    endif;

  }
}