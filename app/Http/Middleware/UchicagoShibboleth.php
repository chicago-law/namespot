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
        $uc_email = $request->server('mail');
        $cnet_id = substr($uc_email, 0,  strpos($uc_email, '@'));

        // $shibboleth_uid_keys = array_values(preg_grep('/^(.+)?chicagoID$/', array_keys($request->server())));
        // if (count($shibboleth_uid_keys)) $chicago_id = $request->server($shibboleth_uid_keys[0]);

        // // Look for chicago ID in server variables
        // $shibboleth_uid_keys = array_values(preg_grep('/^(.+)?chicagoID$/', array_keys($request->server())));
        // if (count($shibboleth_uid_keys)) $chicago_id = $request->server($shibboleth_uid_keys[0]);

      }

      // abort if couldn't find chicago id (and not local or dev)
      abort_if(!isset($cnet_id), 401);

      // otherwise, assume success and look for a user in our table with the chicago id
      $user = User::where('cnet_id', $cnet_id)->first();

      // about if the user isn't in our DB's list of approved CNets
      abort_if(is_null($user), 401);

      // Fill in some details on the user
      // $user->chicago_id = $chicago_id;
      // $user->first_name = $request->server('givenName');
      // $user->last_name = $request->server('sn');
      // $user->email = $request->server('mail');
      // $user->save();

      // Now log in the user and be on your way!
      auth()->login($user);
    }
    return $next($request);
  }
}
