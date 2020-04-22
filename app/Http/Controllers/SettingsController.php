<?php

namespace App\Http\Controllers;
use App\Setting;

use Illuminate\Http\Request;

class SettingsController extends Controller
{
  public function get()
  {
    $settings = Setting::all();
    $results = [];

    foreach ($settings as $setting) {
      $results[$setting->setting_name] = $setting->setting_value;
    }

    return response()->json([
      'settings' => $results,
    ]);
  }

  public function update(Request $request)
  {
    $updates = $request->input();
    $results = [];

    foreach ($updates as $key => $value) {
      $setting = Setting::find($key);
      if ($setting) {
        $setting->setting_value = $value;
        $setting->save();
        $results[$setting->setting_name] = $setting->setting_value;
      } else {
        abort(500, 'Unrecognized setting name.');
      }
    }

    return response()->json([
      'settings' => $results,
    ]);
  }
}
