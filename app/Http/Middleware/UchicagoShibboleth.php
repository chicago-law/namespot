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
        $chicago_id = config('app.authed_user');
      } else {
        // Look for chicago ID in server variables
        $shibboleth_uid_keys = array_values(preg_grep('/^(.+)?chicagoID$/', array_keys($request->server())));
        if (count($shibboleth_uid_keys)) $chicago_id = $request->server($shibboleth_uid_keys[0]);
      }

      // abort if couldn't find chicago id (and not local or dev)
      abort_if(!isset($chicago_id), 401);

      // otherwise, assume success and look for a user in our table with the chicago id
      $user = User::where('chicago_id', $chicago_id)->first();

      // check if we have an email for this user in our user table.
      // if not, grab it from their shib auth login
      if (!is_null($user) && is_null($user->email)):
        if (!is_null($request->server('mail'))):
          $user->email = $request->server('mail');
          $user->save();
        endif;
      endif;

      // if they have a cnet, but we can't find them in user table,
      // add them to the table as a faculty member
      // if (is_null($user)) {
      //   $user = new User;
      //   $user->chicago_id = $chicago_id;
      //   $user->lastname = $request->server('sn');
      //   $user->firstname = $request->server('givenName');
      //   $user->email = $request->server('mail');
      //   $user->type = 'faculty';
      //   $user->save();
      // }

      // log in user!
      auth()->login($user);
    }
    return $next($request);
  }

}
