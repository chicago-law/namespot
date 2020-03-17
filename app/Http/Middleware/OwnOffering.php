<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;
use App\Offering;

class OwnOffering
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // If you're staff or dev, you may proceed unchecked.
        $role = Auth::user()->role;
        if ($role === 'staff' || $role === 'dev') {
            return $next($request);
        }

        // Otherwise, see if logged in user is teaching the offering or if they
        // manually created it.
        $requested_offering = Offering::findOrFail($request->route('offeringId'));
        if ($requested_offering->isBeingTaughtBy(Auth::user()->cnet_id)
            || $requested_offering->manually_created_by = Auth::user()->id
        ) {
            return $next($request);
        }

        abort(401, 'Not authorized to perform this action.');
    }
}
