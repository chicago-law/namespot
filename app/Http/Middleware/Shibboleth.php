<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;
use App\User;
use App\Offering;

class Shibboleth
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
    if (!auth()->user()) {
      // If on local or dev environment, get Chicago ID from .env
      if (app()->environment() === 'local' || app()->environment() === 'dev') {
        $cnet_id = config('app.default_user');
      } else {
        // Otherwise look for Cnet ID from server. Shib refers to 'cnet' as 'uid'.
        $cnet_id = $request->server('uid');
      }

      // Abort if we couldn't find a CNet.
      abort_if(!$cnet_id, 401);

      // Now look for a user in our table with the cnet.
      $user = User::where('cnet_id', $cnet_id)->first();

      // If we can't find you, then we'll try to make a new user with the role of instructor.
      if (!$user && app()->environment() === 'prod') {
        $cnet_id = $request->server('uid');
        $chicago_id = $request->server('chicagoID');
        $first_name = $request->server('givenName');
        $last_name = $request->server('sn');
        $email = $request->server('mail');

        // Abort if we didn't find what we need for new user.
        if (!$cnet_id || !$chicago_id || !$first_name || !$last_name || !$email) {
          abort(401);
        }

        // Next check if there are classes with this user as an instructor.
        // If we can't find any, then you can't get in.
        $relevant_offerings = Offering::whereHas('instructors', function($inst) use ($cnet_id) {
          $inst->where('cnet_id', $cnet_id);
        })->count();
        if (!$relevant_offerings) {
          abort(401);
        }

        $user = new User;
        $user->cnet_id = $cnet_id;
        $user->chicago_id = $chicago_id;
        $user->first_name = $first_name;
        $user->last_name = $last_name;
        $user->email = $email;
        $user->role = 'inst';

        // Save!
        $user->save();

      } // End if no matching user in DB

      if ($user) {
        auth()->login($user);
      } else {
        abort(401);
      }
    }
    return $next($request);
  }
}
