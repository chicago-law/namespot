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
use App\Student;

class FetchLawStudents implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  /**
   * Usually all enrollment will happen through the FetchAisEnrollment job, getting
   * students via who's registered in each class. However this won't catch anyone
   * who's not registered for classes yet. In particular, this is geared towards
   * new students that are not yet registered for any classes, but we do want them
   * in the system, available to put into seating charts.
   */

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Execute the job.
   *
   * @return void
   */
  public function handle()
  {
    try {
      $client = new Client();
      $base_url = config('api.ais_prod_url');
      $username = config('api.ais_username');
      $password = config('api.ais_prod_password');
      $endpoint = "{$base_url}/studentsbycareer/LAW";

      // Make the call
      $response = $client->get($endpoint, [
        'auth' => [$username, $password],
        'verify' => false
      ]);

      $json_body = $response->getBody()->getContents();
      $body = json_decode($json_body);

      if (is_object($body) && property_exists($body, 'UC_STUDENT_CAREER_TBL')) {
        $ais_students = $body->UC_STUDENT_CAREER_TBL;

        if (is_array($ais_students) && count($ais_students) > 0) {
          foreach ($ais_students as $ais_student) {
            $cnet_id = safeString($ais_student, 'CNET_ID');
            if ($cnet_id) {
              $student = Student::firstOrNew(['cnet_id' => $cnet_id]);
            }

            // If we found a student, or successfully create a new one, go ahead with sync.
            if ($student) {
              // The basics
              $student->emplid = $ais_student->EMPLID;
              $student->first_name = $ais_student->FIRST_NAME;
              $middle_name = safeString($ais_student, 'MIDDLE_NAME');
              if ($middle_name) $student->middle_name = $middle_name;
              $student->last_name = $ais_student->LAST_NAME;
              $student->short_first_name = safeString($ais_student, 'PREF_FIRST_NAME');
              $email = safeString($ais_student, 'EMAIL_ADDR');

              // Academics
              $student->academic_career = safeString($ais_student, 'ACAD_CAREER');
              $student->academic_prog = safeString($ais_student, 'ACAD_PROG');
              $student->academic_prog_descr = safeString($ais_student, 'ACAD_PROG_DESCR');
              $student->exp_grad_term = safeString($ais_student, 'EXP_GRAD_TERM');

              // Save!
              $student->save();
            }
          } // End AIS students loops
        } // end if is is_array($ais_students)
      } // end if is_object($body)
    } catch (RequestException $e) {
      if ($e->hasResponse()) {
        $reason = $e->getResponse()->getReasonPhrase();
        $code = $e->getResponse()->getStatusCode();
        $errors_array = [
          'reason' => $reason ? $reason : null,
          'code' => $code ? $code : null,
          'time' => date('h:i:s'),
        ];
      } else {
        $api_request = Psr7\str($e->getRequest());
        $errors_array = [
          'request' => $api_request
        ];
      }

     // Attempt to send an email with exceptions summary.
     if (config('app.env') === 'prod') {
      $message =  'Prod: FetchLawStudents had an exception!';
      Mail::to(config('app.admin_email'))->send(new JobException($message, $errors_array));
    }

    }
  }
}
