<?php

namespace App\Http\Middleware;

use Closure;
use App\User;

class UchicagoShibboleth
{

  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @param  string|null  $guard
   * @return mixed
   */
  public function handle($request, Closure $next, $guard = null)
  {
    if (!auth()->check()) {

      // If on local or dev environment, get chicago id from config
      if (app()->environment() == 'local' || app()->environment() == 'dev') {
        $cnet_id = config('app.authed_user');
      } else {
        // Look for CNet in server variables
        $cnet_id = $request->server('uid');
      }

      // abort if couldn't find CNet.
      abort_if(!$cnet_id, 401, 'CNet ID not found.');

      // otherwise, assume success and look for a user in our table with the CNEt
      $user = User::where('cnet_id', $cnet_id)->first();

      // abort if the user isn't in our DB's list of approved CNets.
      abort_if(is_null($user), 401, "CNet ID not authorized: {$cnet_id}");

      // Fill in some user details from the server
      if ($request->server('uid') !== null):
        $user->chicago_id = $request->server('chicagoID');
        $user->first_name = $request->server('givenName');
        $user->last_name = $request->server('sn');
        $user->email = $request->server('mail');
        $user->save();
      endif;

      // Now log in the user and be on your way!
      auth()->login($user);
    }
    return $next($request);
  }
}
