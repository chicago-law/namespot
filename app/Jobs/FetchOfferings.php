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
use App\Student;
use App\Offering;
use App\Instructor;
use App\Room;


class FetchOfferings implements ShouldQueue
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

    // record errors here
    $errors_array = [];

    try {
      $client = new Client();
      $base_url = config('api.ais_prod_url');
      $username = config('api.ais_username');
      $password = config('api.ais_prod_password');
      $endpoint = "{$base_url}/courses/{$this->term}/LAWS";

      // Make the call
      $response = $client->get($endpoint, [
        'auth' => [$username, $password],
        'verify' => false
      ]);

      $json_body = $response->getBody()->getContents();
      $body = json_decode($json_body);

      foreach($body->UC_CLASS_TBL as $class):

        // Look for the offering in our DB. If it exists already, we'll
        // update with the info that came back, otherwise we'll make a new one.
        $offering = Offering::firstOrNew(['class_nbr' => $class->CLASS_NBR]);

        // ids
        $offering->catalog_nbr = $class->CATALOG_NBR;
        $offering->crse_id = $class->CRSE_ID;
        $offering->class_nbr = $class->CLASS_NBR;
        $offering->section = $class->SECTION;

        // names
        $offering->title = $class->TITLE;
        $offering->long_title = $class->LONG_TITLE;
        $offering->component = $class->COMPONENT;
        $offering->component_descr = $class->COMPONENT_DESCR;

        // location
        $offering->ais_location = is_string($class->LOCATION) ? $class->LOCATION : null;
        $offering->term_code = $this->term;

        // enrollment numbers
        $offering->enrl_cap = $class->ENRL_CAP;
        $offering->enrl_tot = $class->ENRL_TOT;

        // meeting info
        if (isset($class->UC_MEETING_TBL) && !is_null($class->UC_MEETING_TBL)):

          // UC_MEETING_TBL can sometimes be an array...
          // For now, we're just going to ignore meeting times past the first.
          if (is_array($class->UC_MEETING_TBL)):
            $meeting_time = $class->UC_MEETING_TBL[0];
          else:
            $meeting_time = $class->UC_MEETING_TBL;
          endif;

          // When there is no data, it's returned from API as an empty object.
          // If that's the case, we're just going to assign it null.
          $offering->ais_room = is_string($meeting_time->ROOM) ?  $meeting_time->ROOM : null;
          $offering->ais_room_capacity = is_string($meeting_time->ROOM_CAPACITY) ? $meeting_time->ROOM_CAPACITY : null;
          $offering->building = is_string($meeting_time->BUILDING) ? $meeting_time->BUILDING : null;
          $offering->building_desc = is_string($meeting_time->BUILDING_DESCR) ? $meeting_time->BUILDING_DESCR : null;
          $offering->days = is_string($meeting_time->DAYS) ? $meeting_time->DAYS : null;
          $offering->start_time = is_string($meeting_time->START_TIME) ? $meeting_time->START_TIME : null;
          $offering->end_time = is_string($meeting_time->END_TIME) ? $meeting_time->END_TIME : null;
          $offering->start_dt = is_string($meeting_time->START_DT) ? $meeting_time->START_DT : null;
          $offering->end_dt = is_string($meeting_time->END_DT) ? $meeting_time->END_DT : null;

        endif;

        // now save it
        $offering->save();

        // If the user has made a room assignment, is_preserve_room_id will be
        // set to true (1). In that case, don't blow away what they set with
        // what we got back from AIS API.
        if (is_null($offering->is_preserve_room_id) || $offering->is_preserve_room_id === 0) {

          // If the offering is assigned a room in AIS, look to see if it
          // matches any of ours.
          if (!is_null($offering->ais_room)):
            $room = Room::where('db_match_name', $offering->ais_room)->first();
            if ($room):
              $offering->room_id = $room->id;
              $offering->save();
            endif;
          endif;
        }

        // attach instructors
        if (isset($meeting_time) && isset($meeting_time->UC_INSTRUCTOR_TBL)):

          // API returns one instructor as an object, more than one as array
          // of objects, so we'll normalize it to make it always an array.
          $instructors_array = [];
          if (is_array($meeting_time->UC_INSTRUCTOR_TBL)):
            $instructors_array = $meeting_time->UC_INSTRUCTOR_TBL;
          else:
            $instructors_array[] = $meeting_time->UC_INSTRUCTOR_TBL;
          endif;

          foreach($instructors_array as $instructor):
            $db_inst = Instructor::where('emplid',$instructor->EMPLID)->first();
            if (!$db_inst):
              $new_inst = new Instructor;
              $new_inst->emplid = is_string($instructor->EMPLID) ? $instructor->EMPLID : null;
              $new_inst->first_name = is_string($instructor->FIRST_NAME) ? $instructor->FIRST_NAME : null;
              $new_inst->last_name = is_string($instructor->LAST_NAME) ? $instructor->LAST_NAME : null;
              $new_inst->email = is_string($instructor->EMAIL_ADDR) ? $instructor->EMAIL_ADDR : null;
              $new_inst->cnet_id = is_string($instructor->CNET_ID) ? $instructor->CNET_ID : null;
              $new_inst->save();
              $db_inst = $new_inst;
            endif;
            $offering->instructors()->syncWithoutDetaching([
              $db_inst->id => [
                'role' => $instructor->INSTR_ROLE,
                'role_descr' => $instructor->ROLE_DESCR
              ]
            ]);
            unset($instructors_array, $instructor, $db_inst, $new_inst);
          endforeach;

        endif;

        unset($offering, $meeting_time);

      endforeach; // end offering loop

    } catch (RequestException $e) {
      $api_request = Psr7\str($e->getRequest());
      if ($e->hasResponse()) {
        $api_response = Psr7\str($e->getResponse());
      } else {
        $api_response = 'no response';
      }

      $errors_array[] = [
        'api_request' => $api_request,
        'api_response' => $api_response,
        'time' => date('h:i:s'),
      ];
    }

    // if (count($errors_array)):
    //   // send an email with exceptions summary
    //   $message = config('app.env') . ": FetchOfferings for {$this->term} finished with " . count($errors_array) . " errors.";
    //   Mail::to(config('app.admin_email'))->send(new JobException($message, $errors_array));
    // else:
    //   // send summary email
    //   $results = config('app.env') . ": FetchOfferings for {$this->term} found " . count($body->UC_CLASS_TBL) . " offerings, with no errors.";
    //   Mail::to(config('app.admin_email'))->send(new JobResults($results));
    // endif;

  }
}
