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

class FetchEnrolledStudentsByTerm implements ShouldQueue
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

    // Grab the Offerings
    $offerings = Offering::where('term_code', $this->term)->get();

    foreach ($offerings as $offering):

      // prepare some variables
      $YYYY = '20' . substr($offering->term_code, 1, 2);
      $QQ = quarterFromTermCode($offering->term_code);
      $Subj = 'LAWS';
      $AIS_catalog_nbr = $offering->catalog_nbr;
      $AIS_section_id = $offering->section;

      try {
        $client = new Client();
        $base_url = config('api.canvas_test_url');
        $token = "Bearer " . config('api.canvas_test_token');
        $endpoint = "{$base_url}/courses/sis_course_id:{$YYYY}.{$QQ}.{$Subj}.{$AIS_catalog_nbr}.{$AIS_section_id}/students";

        // Make the call
        $response = $client->get($endpoint, [
          'headers' => [ 'Authorization' => $token ],
          'verify' => false
        ]);

        $body = json_decode($response->getBody()->getContents());

        if (is_array($body) || is_object($body)):
          $student_id_array = [];

          foreach($body as $canvas_student):
            $student = Student::firstOrNew(['canvas_id' => $canvas_student->id]);

            // ids
            $student->canvas_id = $canvas_student->id;
            isset($canvas_student->login_id) ? $student->cnet_id = $canvas_student->login_id : false;

            // names
            $student->full_name = $canvas_student->name;
            $student->first_name = explode(' ', $canvas_student->name)[0];
            $student->last_name = substr($canvas_student->name, strpos($canvas_student->name, ' ') + 1);
            $student->short_full_name = $canvas_student->short_name;
            $student->short_first_name = explode(' ', $canvas_student->short_name)[0];
            $student->short_last_name = substr($canvas_student->short_name, strpos($canvas_student->short_name, ' ') + 1);
            $student->sortable_name = $canvas_student->sortable_name;

            // If student has no picture property or it is null,
            // set it to the default picture.
            !isset($student->picture) || is_null($student->picture) ? $student->picture = 'no-face.png' : false;

            // save in DB
            $student->save();

            $student_id_array[] = $student->id;

          endforeach; // end for each Student

          /**
           * Before we can safely blow away what we had previously for
           * enrollment with what we got from this API call, we're going to find any
           * students that were attached manually to this offering by the
           * user and add them to $student_id_array.
           */
          $manually_attached_students = $offering->manuallyAttachedStudents()->get();
          if (count($manually_attached_students)) {
            foreach ($manually_attached_students as $student):
              $student_id_array[] = $student->id;
            endforeach;
          }

          // update offering's enrollment
          $offering->students()->sync($student_id_array);
        endif;

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

    endforeach; // end for each Offering

    if (count($errors_array)):
      // send an email with exceptions summary
      $message = "FetchEnrolledStudentsByTerm for {$this->term} finished with " . count($errors_array) . " errors, out of " . count($offerings) . " offerings.";
      Mail::to('dramus@uchicago.edu')->send(new JobException($message, $errors_array));
    else:
      // send results summary
      $results = "FetchEnrolledStudentsByTerm for {$this->term} completed " . count($offerings) . " offerings without any exceptions.";
      Mail::to(config('app.admin_email'))->send(new JobResults($results));
    endif;
  }
}
