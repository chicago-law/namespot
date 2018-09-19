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
        $base_url = config('api.ais_stage_url');
        $username = config('api.ais_username');
        $password = config('api.ais_password');
        $endpoint = "{$base_url}/photoroster/{$this->term}/{$offering->class_nbr}";

        // Make the call
        $response = $client->get($endpoint, [
          'auth' => [$username, $password],
          'verify' => false
        ]);

        $json_body = $response->getBody()->getContents();
        $body = json_decode($json_body);

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

            // First, we need to match up the results here from AIS with results from Canvas,
            // which is what's used to populate our student DB.

            // Get Cnet from email address
            // Also temporarily match on names
            $cnet = substr($ais_student->EMAIL_ADDR, 0, strpos($ais_student->EMAIL_ADDR, '@'));
            $middle = is_string($ais_student->MIDDLE_NAME) ? $ais_student->MIDDLE_NAME : '';
            $first_middle_last = "{$ais_student->FIRST_NAME} {$middle} {$ais_student->LAST_NAME}";
            $first_last = "{$ais_student->FIRST_NAME} {$ais_student->LAST_NAME}";

            $student = Student::where('cnet_id', $cnet)
              ->orWhere('full_name', $first_last)
              ->orWhere('full_name', $first_middle_last)
              ->first();

              // TODO: Create a new student if there isn't one w/ this cnet

              // If we found a student, proceed with updating them!
            if ($student) {

              // Mark that their enrollment is confirmed in AIS
              $offering->students()->syncWithoutDetaching([$student->id => [
                'is_in_ais' => 1
              ]]);

              // Grab the emplid (not included in Canvas, so we'll get it here)
              $student->emplid = $ais_student->EMPLID;

              // Store if the student is FERPA or not
              $student->is_ferpa = $ais_student->FERPA === 'N' ? 0 : 1;

              // Save (necessary because the save() coming up only happens if we assign picture)
              $student->save();

              // If their picture is either null or no-face, then update it from this call
              if (is_null($student->picture) || $student->picture === 'no-face.png'):

                // Create the file name and save it as a student attribute
                // Temporarily including last name as well, because students from
                // AIS test endpoints come back with cnet 'nobody' for everybody.
                $file_name = "{$cnet}_{$ais_student->LAST_NAME}.jpg";
                $student->picture = $file_name;
                $student->save();

                // create and save the jpg file
                $photo_data = $ais_student->PHOTO_DATA;
                $decoded = base64_decode($photo_data);

                Storage::disk('public')->put("student_pictures/{$file_name}", $decoded);
                // file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/images/students/{$file_name}", $decoded);

              endif; // end if no picture
            } // end if student
          endforeach; // end the student loop

          // This offering is done, but let's pause for a few seconds before
          // hitting the API with next Offering.
          sleep(3);

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
      Mail::to(config('app.admin_email'))->send(new JobException($message, array_slice($errors_array, 0, 3)));
    else:
      // Send an email with job results summary
      $results = "FetchPhotoRosterByTerm for {$this->term} completed without exceptions. {$empty_responses} out of " . count($offerings) . " offerings had no photo data.";
      Mail::to(config('app.admin_email'))->send(new JobResults($results));
    endif;

  }
}