<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobException;
use App\Mail\JobResults;
use App\Offering;
use App\Student;
use Illuminate\Support\Carbon;

class FetchCanvasEnrollment implements ShouldQueue
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
    $this->offerings = Offering::where('term_code', $this->term)->whereNull('manually_created_by')->get();
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
      $subj = 'LAWS';
      $AIS_catalog_nbr = $offering->catalog_nbr;
      $AIS_section_id = $offering->section;
      $first_url = "{$base_url}/courses/sis_course_id:{$YYYY}.{$QQ}.{$subj}.{$AIS_catalog_nbr}.{$AIS_section_id}/enrollments";

      // Keep track of whether or not this is the last offering in the loop.
      // If it is, we want to fire off our done_fetching function
      $last_offering = $i + 1 === count($this->offerings) ? true : false;

      // Fire away!
      $this->fetch_enrollment($offering, $first_url, $last_offering);

      // Give it a second before moving on in the loop.
      sleep(.5);

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

          /**
           * My research shows the following possible values for a Canvas role:
           *
           * StudentEnrollment
           * TeacherEnrollment
           * TaEnrollment
           * DesignerEnrollment
           * ObserverEnrollment
           * Manually Added Student
           *
           * We'd like to only capture student-y roles, and also leave out the Test Students.
           */
          if (( $canvas_student->role === 'StudentEnrollment'
            || $canvas_student->role === 'ObserverEnrollment'
            || $canvas_student->role === 'Manually Added Student'
          )
            && $canvas_student->user->name !== 'Test Student'
            && $canvas_student->user->name !== 'Test student'
          ):

            // Find this student in the DB, or make a new one with cnet, or canvas id.
            if (property_exists($canvas_student->user, 'login_id') && !is_null($canvas_student->user->login_id)) {
              $student = Student::firstOrNew(['cnet_id' => $canvas_student->user->login_id]);
            } else if (property_exists($canvas_student->user, 'id') && !is_null($canvas_student->user->id)) {
              // There is a student who's canvas ID has a letter in it for some reason. It looks
              // like a Chicago ID. Anyway, if you try to compare it with something that SQL thinks
              // is an integer, it'll try to turn it into an integer and fail. So, we'll first
              // coerce the canvas user id into a string.
              $student = Student::firstOrNew(['canvas_id' => strval($canvas_student->user->id)]);
            }

            // Proceed only if we were able to make a student with cnet or canvas id.
            if ($student) {

              // IDs
              $student->canvas_id = $canvas_student->user->id;

              // Names. Some of these will get blown away by AIS, because they actually
              // break names down into first, m, last. Full name and full short name are kept though.

              // Canvas has both a regular name and a short name field.
              // Both are first + last in the one field.
              $student->full_name = $canvas_student->user->name;
              $student->short_full_name = $canvas_student->user->short_name;
              $student->sortable_name = $canvas_student->user->sortable_name;

              // Only set first and last if they're null (Canvas defers to AIS for these).
              // What's coming from AIS will overwrite what happens here.

              // Guess first and last names by exploding the full name. Everything
              // before the first space is first name. Everything after is last.
              if (is_null($student->first_name)) $student->first_name = explode(' ', $canvas_student->user->name)[0];
              if (is_null($student->last_name)) $student->last_name = substr($canvas_student->user->name, strpos($canvas_student->user->name, ' ') + 1);

              // Short first name is primarily going to be AIS's preferred first name, but if it's
              // null we can take a guess here.
              // Guess short first name by taking everything up to the first space from canvas's short name.
              if (is_null($student->short_first_name)) $student->short_first_name = explode(' ', $canvas_student->user->short_name)[0];

              // Create short last name by taking everything up to the first comma from canvas's sortable name.
              // (This field is Canvas-only).
              $student->short_last_name = substr($canvas_student->user->sortable_name, 0, strpos($canvas_student->user->sortable_name, ', '));

              // Timestamp
              $student->canvas_last_seen = new Carbon();

              // save in DB
              $student->save();

              // Attach the student with enrollment relationship data
              $offering->students()->syncWithoutDetaching([$student->id => [
                'canvas_enrollment_state' => $canvas_student->enrollment_state,
                'canvas_role' => $canvas_student->role,
                'canvas_role_id' => $canvas_student->role_id
              ]]);

            } // end student check
          endif; // end role type check
        endforeach; // end for each Student
      endif; // end body array check

      // Record the limit remaining.
      $x_limit = Psr7\parse_header($response->getHeader('X-Rate-Limit-Remaining'))[0][0];
      $this->remaining[] = $x_limit;

      // Last, the API response is usually paginated. Do we need to run again?
      // Look through all the links in the header, and if "next" is one of them,
      // run it again. Or, if we get through all those links and "next" is not
      // one of them, then we're done with this offering. If last_offering is true,
      // then go ahead and fire done_fetching().
      $header_links = Psr7\parse_header($response->getHeader('Link'));
      foreach ($header_links as $i => $link):
        if ($link['rel'] === 'next') {
          $next_url = rtrim(ltrim($link[0], '<'), '>');
          sleep(.25);
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

      Log::error('FetchCanvasEnrollment error!', $this->errors);

      // send an email with exceptions summary
      if (config('app.env') === 'prod') {
        $message = "Prod: FetchCanvasEnrollment for {$this->term} finished with " . count($this->errors) . " error(s) out of " . count($this->offerings) . " offerings.";
        Mail::to(config('app.dev_email'))->send(new JobException($message, $this->errors));
      }
    endif;
  }
}
