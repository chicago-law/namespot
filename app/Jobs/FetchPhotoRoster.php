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


class FetchPhotoRoster implements ShouldQueue
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

            // Find student in DB with emplid. We should indeed have that
            // because if you're in this list, you were in the AIS enrollment list.
            $student = Student::where('emplid', $ais_student->EMPLID)->first();

            // If we found a student, proceed with updating them!
            if ($student) {

              // Store if the student is FERPA or not
              $student->is_ferpa = $ais_student->FERPA === 'N' ? 0 : 1;

              // Save (necessary because the save() coming up only happens if we assign picture)
              $student->save();

              // If their picture is either null, then update it from this call
              if (is_null($student->picture)):

                // Create the file name and save it as a student attribute
                // Temporarily including last name as well, because students from
                // AIS test endpoints come back with cnet 'nobody' for everybody.
                $file_name = !is_null($student->cnet_id)
                  ? "{$student->cnet_id}_{$ais_student->EMPLID}.jpg"
                  : "{$student->last_name}_{$ais_student->EMPLID}.jpg";
                $student->picture = $file_name;
                $student->save();

                // create and save the jpg file
                $photo_data = $ais_student->PHOTO_DATA;
                $decoded = base64_decode($photo_data);
                Storage::disk('public')->put("student_pictures/{$file_name}", $decoded);

              endif; // end if null picture
            } // end if student
          endforeach; // end the student loop

          // This offering is done, but let's pause for a second before
          // hitting the API with next Offering.
          sleep(1);

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
      $message = "FetchPhotoRoster for {$this->term} finished with " . count($errors_array) . " errors, out of " . count($offerings) . " offerings.";
      Mail::to(config('app.admin_email'))->send(new JobException($message, array_slice($errors_array, 0, 3)));
    else:
      // Send an email with job results summary
      $results = "FetchPhotoRoster for {$this->term} completed without exceptions. {$empty_responses} out of " . count($offerings) . " offerings had no photo data.";
      Mail::to(config('app.admin_email'))->send(new JobResults($results));
    endif;

  }
}