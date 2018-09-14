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
  protected $errors;
  protected $remaining;

  /**
   * Create a new job instance.
   *
   * @return void
   */
  public function __construct($term)
  {
    $this->term = $term;
    $this->token = "Bearer " . config('api.canvas_prod_token');
    $this->errors = [];
    $this->remaining = [];
  }

  /**
   * Execute the job.
   *
   * @return void
   */
  public function handle()
  {
    $offerings = Offering::where('term_code', $this->term)->get();

    foreach ($offerings as $i => $offering):

      // Fire fetch_enrollment for the offering.
      // Function will recursively keep going if results are paginated.
      $base_url = config('api.canvas_prod_url');
      $YYYY = '20' . substr($offering->term_code, 1, 2);
      $QQ = quarterFromTermCode($offering->term_code);
      $Subj = 'LAWS';
      $AIS_catalog_nbr = $offering->catalog_nbr;
      $AIS_section_id = $offering->section;
      $first_url = "{$base_url}/courses/sis_course_id:{$YYYY}.{$QQ}.{$Subj}.{$AIS_catalog_nbr}.{$AIS_section_id}/enrollments";

      $this->fetch_enrollment($offering, $first_url);

      // Give it a few seconds before moving on in the loop.
      sleep(3);

    endforeach; // end for each Offering
  }

  private function fetch_enrollment($offering, $endpoint)
  {
    try {
      // Make the call
      $client = new Client();
      $response = $client->get($endpoint, [
        'headers' => [ 'Authorization' => $this->token ],
        'verify' => false
      ]);

      $body = json_decode($response->getBody()->getContents());

      if (is_array($body)):
        foreach($body as $canvas_student):

          if (
            $canvas_student->role === 'StudentEnrollment'
            || $canvas_student->role === 'ObserverEnrollment'
            || $canvas_student->role === 'Manually Added Student'
          ):
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

            // Attach the student with enrollment relationship data
            $offering->students()->syncWithoutDetaching([$student->id => [
              'canvas_enrollment_state' => $canvas_student->enrollment_state,
              'canvas_role' => $canvas_student->role,
              'canvas_role_id' => $canvas_student->role_id
            ]]);

          endif; // end role type check
        endforeach; // end for each Student
      endif; // end body array check

      // Record the limit remaining.
      $x_limit = Psr7\parse_header($response->getHeader('X-Rate-Limit-Remaining'))[0][0];
      $this->remaining[] = $x_limit;

      // API response is usually paginated. Do we need to run again?
      // Look through all the links in the header, and if "next" is one of them,
      // run it again. Or, if we get through all those links and "next" is not
      // one of them, then we're done with this offering. If last_call is true,
      // then go ahead and fire done_fetching().
      $header_links = Psr7\parse_header($response->getHeader('Link'));
      foreach ($header_links as $i => $link):
        if ($link['rel'] === 'next') {
          $next_url = rtrim(ltrim($link[0], '<'), '>');
          $this->fetch_enrollment($offering, $next_url);
          break;
        } elseif ($i + 1 === count($header_links)) {
          $this->done_fetching($offering);
        }
      endforeach;

    } catch (RequestException $e) {
      if ($e->hasResponse()) {
        $reason = $e->getResponse()->getReasonPhrase();
        $code = $e->getResponse()->getStatusCode();
        $this->errors[] = [
          'reason' => $reason ? $reason : null,
          'code' => $code ? $code : null,
          'time' => date('h:i:s'),
        ];
      } else {
        $api_request = Psr7\str($e->getRequest());
        $this->errors[] = $api_request;
      }

      $this->done_fetching($offering);
    }
  }

  private function done_fetching($offering)
  {
    if (count($this->errors)):
      // send an email with exceptions summary
      $message = "{$offering->long_title} for {$this->term} finished with " . count($this->errors) . " error(s).";
      // $message = "FetchEnrolledStudentsByTerm for {$this->term} finished with " . count($errors) . " errors, out of " . count($offerings) . " offerings.";
      Mail::to('dramus@uchicago.edu')->send(new JobException($message, $this->errors));
    else:
      // send results summary
      $results = "{$offering->long_title} {$offering->section} for {$this->term} completed. " . print_r($this->remaining, true);
      // $results = "FetchEnrolledStudentsByTerm for {$this->term} completed " . count($offerings) . " offerings without any exceptions.";
      Mail::to(config('app.admin_email'))->send(new JobResults($results));
    endif;
  }
}
