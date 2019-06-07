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
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7;
use App\Mail\JobException;
use App\Mail\JobResults;
use App\Offering;
use App\Student;


class FetchAisEnrollment implements ShouldQueue
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

      // Record all the student IDs we got back for this offering
      $current_student_ids = [];

      try {
        $client = new Client();
        $base_url = config('api.ais_prod_url');
        $username = config('api.ais_username');
        $password = config('api.ais_prod_password');
        $endpoint = "{$base_url}/roster/{$offering->class_nbr}/{$this->term}";

        // Make the call
        $response = $client->get($endpoint, [
          'auth' => [$username, $password],
          'verify' => false
        ]);

        $json_body = $response->getBody()->getContents();
        $body = json_decode($json_body);

        if (isset($body->ROW_COUNT) && $body->ROW_COUNT > 0) {

          // convert UC_CLASS_ROSTER_TBL into an array no matter what
          $ais_student_array = [];
          if (is_array($body->UC_CLASS_ROSTER_TBL)):
            $ais_student_array = $body->UC_CLASS_ROSTER_TBL;
          elseif (is_object($body->UC_CLASS_ROSTER_TBL)):
            $ais_student_array[] = $body->UC_CLASS_ROSTER_TBL;
          endif;

          foreach ($ais_student_array as $ais_student):

            // Find this student in the DB, or make a new one with cnet, or emplid
            if (is_string($ais_student->CNET_ID)) {
              $student = Student::firstOrNew(['cnet_id' => $ais_student->CNET_ID]);
            } else if (is_string($ais_student->EMPLID)) {
              $student = Student::firstOrNew(['emplid' => $ais_student->EMPLID]);
            }

            // Proceed only if we were able to find/make a student with cnet or emplid.
            if ($student) {

              // IDs
              $student->emplid = $ais_student->EMPLID;

              // Names
              $student->first_name = $ais_student->FIRST_NAME;
              $student->middle_name = is_string($ais_student->MIDDLE_NAME) ? $ais_student->MIDDLE_NAME : null;
              $student->last_name = $ais_student->LAST_NAME;

              // Academics
              $student->academic_career = $ais_student->ACAD_CAREER;
              $student->academic_prog = $ais_student->ACAD_PROG;
              $student->academic_prog_descr = $ais_student->ACAD_PROG_DESCR;
              $student->academic_level = $ais_student->ACADEMIC_LEVEL;
              $student->exp_grad_term = is_string($ais_student->EXP_GRAD_TERM) ? $ais_student->EXP_GRAD_TERM : null;

              // Save!
              $student->save();

              // Enrollment
              $offering->students()->syncWithoutDetaching([$student->id => [
                'is_in_ais' => 1,
                'ais_enrollment_state' => $ais_student->STDNT_ENRL_STATUS,
                'ais_enrollment_reason' => $ais_student->ENRL_STATUS_REASON,
              ]]);

              // Save the ID of every student we find enrolled in this offering.
              $current_student_ids[] = $student->id;

            } // end if student
          endforeach; // end the student loop

          // We're done processing everyone that AIS said was in this class now.
          // Next we'll query the DB for all the students we have associated with
          // this class, and anyone who wasn't mentioned in this API response will
          // be marked as not in AIS.
          foreach ($offering->students as $student) {
            if (!in_array($student->id, $current_student_ids)) {
              $offering->students()->syncWithoutDetaching([$student->id => [
                'is_in_ais' => 0
              ]]);
            }
          }

        } else if ((string) $body->ROW_COUNT === '0') {
          $empty_responses++;
        }

        // This offering is done, but let's pause for a second before
        // hitting the API with next Offering.
        sleep(1);

      } catch (RequestException $e) {
        if ($e->hasResponse()) {
          $reason = $e->getResponse()->getReasonPhrase();
          $code = $e->getResponse()->getStatusCode();
          $errors_array[$offering->title] = [
            'reason' => $reason ? $reason : null,
            'code' => $code ? $code : null,
            'time' => date('h:i:s'),
          ];
        } else {
          $api_request = Psr7\str($e->getRequest());
          $errors_array[$offering->title] = [
            'request' => $api_request
          ];
        }
      }

    endforeach; // end offering loop

    if (count($errors_array)):

      // Write errors to the log.
      Log::error('FetchAisEnrollment error!', $errors_array);

      // Attempt to send an email with exceptions summary.
      if (config('app.env') === 'prod') {
        $message =  "Prod: FetchAisEnrollment for {$this->term} finished with " . count($errors_array) . " errors, out of " . count($offerings) . " offerings.";
        Mail::to(config('app.admin_email'))->send(new JobException($message, array_slice($errors_array, 0, 20)));
      }
    endif;
  }
}