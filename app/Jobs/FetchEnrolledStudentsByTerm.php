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
use Illuminate\Support\Facades\Storage;
use App\Mail\JobException;
use App\Mail\JobResults;
use App\Offering;
use App\Student;

class FetchEnrolledStudentsByTerm implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  protected $term;
  protected $token;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct($term)
  {
    $this->term = $term;
    $this->token = "Bearer " . config('api.canvas_prod_token');
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
    $calls = 0;

    function fetch_enrollment($offering, $endpoint, $token, $calls) {
      try {
        // Make the call
        $client = new Client();
        $response = $client->get($endpoint, [
          'headers' => [ 'Authorization' => $token ],
          'verify' => false
        ]);

        $body = json_decode($response->getBody()->getContents());

        if (is_array($body)):
          $student_id_array = [];

          foreach($body as $canvas_student):

            if ($canvas_student->role === 'StudentEnrollment' || $canvas_student->role === 'ObserverEnrollment'):
              $student = Student::firstOrNew(['canvas_id' => $canvas_student->user->id]);

              // ids
              $student->canvas_id = $canvas_student->user->id;
              isset($canvas_student->user->login_id) ? $student->cnet_id = $canvas_student->user->login_id : false;

              // names
              $student->full_name = $canvas_student->user->name;
              $student->first_name = explode(' ', $canvas_student->user->name)[0];
              $student->last_name = substr($canvas_student->user->name, strpos($canvas_student->user->name, ' ') + 1);
              $student->short_full_name = $canvas_student->user->short_name;
              $student->short_first_name = explode(' ', $canvas_student->user->short_name)[0];
              $student->short_last_name = substr($canvas_student->user->short_name, strpos($canvas_student->user->short_name, ' ') + 1);
              $student->sortable_name = $canvas_student->user->sortable_name;

              // If student has no picture property or it is null,
              // set it to the default picture.
              !isset($student->picture) || is_null($student->picture) ? $student->picture = 'no-face.png' : false;

              // save in DB
              $student->save();

              // Attach student to its Offering with enrollment information
              $offering->students()->syncWithoutDetaching([
                $student->id => [
                  'canvas_enrollment_state' => $canvas_student->enrollment_state,
                  'canvas_role' => $canvas_student->role,
                  'canvas_role_id' => $canvas_student->role_id
                ]
              ]);

              // $student_id_array[] = $student->id;

            endif; // end role type check

          endforeach; // end for each Student

            /**
             * Before we can safely blow away what we had previously for
             * enrollment with what we got from this API call, we're going to find any
             * students that were attached manually to this offering by the
             * user and add them to $student_id_array.
             */
            // $namespot_added_students = $offering->namespotAddedStudents()->get();
            // if (count($namespot_added_students)) {
            //   foreach ($namespot_added_students as $student):
            //     $student_id_array[] = $student->id;
            //   endforeach;
            // }

            // update offering's enrollment
            // $offering->students()->sync($student_id_array);

        endif; // end body array check

        // API response pagination. Do we need to run again?
        $header_links = Psr7\parse_header($response->getHeader('Link'));
        foreach ($header_links as $link):
          if ($link['rel'] === 'next') {
            $calls++;
            $next_url = rtrim(ltrim($link[0], '<'), '>');
            // dd($next_url);
            fetch_enrollment($offering, $next_url, $token, $calls);
          }
        endforeach;

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

    } // end fetch_enrollment()

    $offering = Offering::where('term_code', $this->term)->first();

    // $offerings = Offering::where('term_code', $this->term)->get();
    // foreach ($offerings as $offering):

      // Fire fetch_enrollment the first time!
      $base_url = config('api.canvas_prod_url');
      $YYYY = '20' . substr($offering->term_code, 1, 2);
      $QQ = quarterFromTermCode($offering->term_code);
      $Subj = 'LAWS';
      $AIS_catalog_nbr = $offering->catalog_nbr;
      $AIS_section_id = $offering->section;
      $first_url = "{$base_url}/courses/sis_course_id:{$YYYY}.{$QQ}.{$Subj}.{$AIS_catalog_nbr}.{$AIS_section_id}/enrollments";

      fetch_enrollment($offering, $first_url, $this->token, $calls);

    // endforeach; // end for each Offering

    // if (count($errors_array)):
    //   // send an email with exceptions summary
    //   $message = "FetchEnrolledStudentsByTerm for {$this->term} finished with " . count($errors_array) . " errors, out of " . count($offerings) . " offerings.";
    //   Mail::to('dramus@uchicago.edu')->send(new JobException($message, array_slice($errors_array, 0, 3)));
    // else:
    //   // send results summary
    //   $results = "FetchEnrolledStudentsByTerm for {$this->term} completed " . count($offerings) . " offerings without any exceptions.";
    //   Mail::to(config('app.admin_email'))->send(new JobResults($results));
    // endif;

  } // end handle()
}
