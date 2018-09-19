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
  protected $token;
  protected $offerings;
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
    $this->offerings = Offering::where('term_code', $this->term)->get();
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
    foreach ($this->offerings as $i => $offering):

      // Fire fetch_enrollment for the offering.
      // Function will recursively keep going if results are paginated.
      $base_url = config('api.canvas_prod_url');
      $YYYY = '20' . substr($offering->term_code, 1, 2);
      $QQ = quarterFromTermCode($offering->term_code);
      $Subj = 'LAWS';
      $AIS_catalog_nbr = $offering->catalog_nbr;
      $AIS_section_id = $offering->section;
      $first_url = "{$base_url}/courses/sis_course_id:{$YYYY}.{$QQ}.{$Subj}.{$AIS_catalog_nbr}.{$AIS_section_id}/enrollments";

      // Keep track of whether or not this is the last offering in the loop.
      // If it is, we want to fire off our done_fetching function
      $last_offering = $i + 1 === count($this->offerings) ? true : false;

      // Fire away!
      $this->fetch_enrollment($offering, $first_url, $last_offering);

      // Give it a few seconds before moving on in the loop.
      sleep(3);

    endforeach; // end for each Offering
  }

  private function fetch_enrollment($offering, $endpoint, $last_offering)
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
            // !isset($student->picture) || is_null($student->picture) ? $student->picture = 'no-face.png' : false;

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

      // Last, the API response is usually paginated. Do we need to run again?
      // Look through all the links in the header, and if "next" is one of them,
      // run it again. Or, if we get through all those links and "next" is not
      // one of them, then we're done with this offering. If last_call is true,
      // then go ahead and fire done_fetching().
      $header_links = Psr7\parse_header($response->getHeader('Link'));
      foreach ($header_links as $i => $link):
        if ($link['rel'] === 'next') {
          $next_url = rtrim(ltrim($link[0], '<'), '>');
          $this->fetch_enrollment($offering, $next_url, $last_offering);
          break;
        } elseif ($i + 1 === count($header_links) && $last_offering) {
          // No more header links to check, AND this is the very last offering in the loop.
          // This was the last call of the last offering.
          $this->done_fetching();
        }
      endforeach;

    } catch (RequestException $e) {
      if ($e->hasResponse()) {
        $reason = $e->getResponse()->getReasonPhrase();
        $code = $e->getResponse()->getStatusCode();
        $this->errors[$offering->title] = [
          'reason' => $reason ? $reason : null,
          'code' => $code ? $code : null,
          'time' => date('h:i:s'),
        ];
      } else {
        $api_request = Psr7\str($e->getRequest());
        $this->errors[$offering->title] = $api_request;
      }
      if ($last_offering) {
        $this->done_fetching();
      }
    }
  }

  private function done_fetching()
  {
    if (count($this->errors)):
      // send an email with exceptions summary
      $message = "FetchEnrolledStudentsByTerm for {$this->term} finished with " . count($this->errors) . " error(s) out of " . count($this->offerings) . " offerings.";
      Mail::to('dramus@uchicago.edu')->send(new JobException($message, $this->errors));
    else:
      // send results summary
      $results = "FetchEnrolledStudentsByTerm for {$this->term} finished " . count($this->offerings) . " offerings without any exceptions.";
      Mail::to(config('app.admin_email'))->send(new JobResults($results));
    endif;
  }
}
